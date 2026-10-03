import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseFeed, syncShorts, main } from './fetch-shorts.mjs';

const fixtureXml = readFileSync(join(process.cwd(), 'scripts/__fixtures__/feed.xml'), 'utf8');

/** Fake YouTube: the feed, 200 for Shorts, 303 to /watch for long-form. */
function fakeYoutube({ consentBounceFor = [] } = {}) {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.includes('/feeds/videos.xml')) {
      return new Response(fixtureXml, { status: 200 });
    }
    const id = url.split('/shorts/')[1];
    if (consentBounceFor.includes(id)) {
      return new Response(null, {
        status: 302,
        headers: { location: 'https://consent.youtube.com/m?continue=https://www.youtube.com/shorts/' + id },
      });
    }
    if (id.startsWith('longform')) {
      return new Response(null, {
        status: 303,
        headers: { location: `https://www.youtube.com/watch?v=${id}` },
      });
    }
    return new Response(null, { status: 200 });
  };
  return { fetchImpl, calls };
}

const silentLog = { warn: () => {}, error: () => {}, log: () => {} };

describe('parseFeed', () => {
  it('extracts channel metadata', () => {
    const { channel } = parseFeed(fixtureXml);
    expect(channel).toEqual({
      id: 'UCtestchannel000000000000',
      title: 'UnleakTrade Education',
      url: 'https://www.youtube.com/channel/UCtestchannel000000000000',
    });
  });

  it('extracts every entry in feed order with decoded titles', () => {
    const { items } = parseFeed(fixtureXml);
    expect(items.map((i) => i.id)).toEqual(['short000001', 'longform001', 'short000002']);
    expect(items[2]).toEqual({
      id: 'short000002',
      title: "Your OTC quote got copied. Here's the fix | VS The Market #1",
      published: '2026-10-01T16:00:20+00:00',
    });
  });

  it('normalises em and en dashes in titles to a plain hyphen', () => {
    const { items } = parseFeed(fixtureXml);
    expect(items[0].title).toBe('Older short with an em dash - and an & ampersand');
    expect(items[0].title).not.toMatch(/[\u2012-\u2015]/);
  });

  it('throws on a document without entries', () => {
    expect(() => parseFeed('<feed></feed>')).toThrow(/no entries/i);
  });
});

describe('syncShorts', () => {
  let dir;
  let outFile;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'shorts-'));
    outFile = join(dir, 'shorts.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('writes only Shorts, newest first', async () => {
    const { fetchImpl } = fakeYoutube();
    await syncShorts({ channelId: 'UCtestchannel000000000000', outFile, fetchImpl, log: silentLog });
    const data = JSON.parse(readFileSync(outFile, 'utf8'));
    expect(data.items.map((i) => i.id)).toEqual(['short000002', 'short000001']);
    expect(data.channel.id).toBe('UCtestchannel000000000000');
  });

  it('carries no timestamp and leaves an up-to-date file untouched, so builds do not dirty git', async () => {
    const { fetchImpl } = fakeYoutube();
    await syncShorts({ channelId: 'UCtestchannel000000000000', outFile, fetchImpl, log: silentLog });
    const first = readFileSync(outFile, 'utf8');
    expect(JSON.parse(first).fetchedAt).toBeUndefined();
    const before = statSync(outFile).mtimeMs;
    await new Promise((resolve) => setTimeout(resolve, 20));
    await syncShorts({ channelId: 'UCtestchannel000000000000', outFile, fetchImpl, log: silentLog });
    expect(statSync(outFile).mtimeMs).toBe(before);
    expect(readFileSync(outFile, 'utf8')).toBe(first);
  });

  it('keeps an entry when the Shorts check bounces to the consent page', async () => {
    const { fetchImpl } = fakeYoutube({ consentBounceFor: ['short000001'] });
    await syncShorts({ channelId: 'UCtestchannel000000000000', outFile, fetchImpl, log: silentLog });
    const data = JSON.parse(readFileSync(outFile, 'utf8'));
    expect(data.items.map((i) => i.id)).toContain('short000001');
  });

  it('writes the file without a trailing-dash character anywhere', async () => {
    const { fetchImpl } = fakeYoutube();
    await syncShorts({ channelId: 'UCtestchannel000000000000', outFile, fetchImpl, log: silentLog });
    expect(readFileSync(outFile, 'utf8')).not.toMatch(/[\u2012-\u2015]/);
  });

  it('rejects when the feed cannot be fetched and leaves an existing file alone', async () => {
    writeFileSync(outFile, '{"items":[{"id":"keep"}]}');
    const fetchImpl = async () => {
      throw new Error('offline');
    };
    await expect(
      syncShorts({ channelId: 'UC', outFile, fetchImpl, log: silentLog }),
    ).rejects.toThrow(/offline/);
    expect(readFileSync(outFile, 'utf8')).toBe('{"items":[{"id":"keep"}]}');
  });

  it('rejects when the feed answers with a non-2xx status', async () => {
    const fetchImpl = async () => new Response('nope', { status: 500 });
    await expect(
      syncShorts({ channelId: 'UC', outFile, fetchImpl, log: silentLog }),
    ).rejects.toThrow(/500/);
  });
});

describe('main', () => {
  let dir;
  let outFile;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'shorts-main-'));
    outFile = join(dir, 'shorts.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('returns 0 after a successful sync', async () => {
    const { fetchImpl } = fakeYoutube();
    const code = await main({ channelId: 'UC', outFile, fetchImpl, log: silentLog });
    expect(code).toBe(0);
    expect(existsSync(outFile)).toBe(true);
  });

  it('returns 0 and keeps the committed file when the sync fails', async () => {
    writeFileSync(outFile, '{"items":[]}');
    const fetchImpl = async () => {
      throw new Error('offline');
    };
    const code = await main({ channelId: 'UC', outFile, fetchImpl, log: silentLog });
    expect(code).toBe(0);
    expect(readFileSync(outFile, 'utf8')).toBe('{"items":[]}');
  });

  it('returns 1 when the sync fails and no file exists to fall back on', async () => {
    const fetchImpl = async () => {
      throw new Error('offline');
    };
    const code = await main({ channelId: 'UC', outFile, fetchImpl, log: silentLog });
    expect(code).toBe(1);
    expect(existsSync(outFile)).toBe(false);
  });
});
