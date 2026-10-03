// Syncs the list of YouTube Shorts shown on the home page.
//
// Reads the channel's public Atom feed (no API key), keeps only Shorts,
// and writes src/data/shorts.json. Runs as `prebuild`, so every deploy
// refreshes the list. If anything fails, the committed JSON is kept and
// the build goes on; we only fail hard when there is no file at all.
//
// Manual refresh: npm run shorts:sync

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const DEFAULT_CHANNEL_ID = "UCyImSuZ3XZcvHDCvpVk8NTA";
// npm runs scripts from the package root, so cwd is the repo.
const DEFAULT_OUT_FILE = resolve(process.cwd(), "src/data/shorts.json");

// Without these cookies, EU egress gets bounced to consent.youtube.com.
const YOUTUBE_HEADERS = {
  "user-agent": "Mozilla/5.0 (compatible; unleaktrade-landing-page shorts sync)",
  "accept-language": "en-US,en;q=0.9",
  cookie: "CONSENT=YES+cb; SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg",
};

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => ENTITIES[name]);
}

// CLAUDE.md: no em dashes, en dashes, horizontal bars or figure dashes anywhere
// in the repo, and this JSON is committed. Titles are display labels on our
// page, so flattening them to a hyphen is acceptable.
function stripDashes(text) {
  return text.replace(/[\u2012-\u2015]/g, "-");
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? decodeEntities(match[1].trim()) : undefined;
}

export function parseFeed(xml) {
  const entryBlocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  if (entryBlocks.length === 0) {
    throw new Error("Feed has no entries");
  }

  const head = xml.slice(0, xml.indexOf("<entry>"));
  const channelUrl = head.match(/<link rel="alternate" href="([^"]+)"/)?.[1];
  const channel = {
    id: channelUrl?.split("/channel/")[1] ?? "",
    title: tag(head, "title") ?? "",
    url: channelUrl ?? "",
  };

  const items = entryBlocks.map((block) => ({
    id: tag(block, "yt:videoId"),
    title: stripDashes(tag(block, "title") ?? ""),
    published: tag(block, "published"),
  }));

  return { channel, items };
}

// A Short answers 200 on /shorts/<id>. Long-form answers 303 to /watch?v=.
// Anything else (consent bounce, transient error) keeps the entry, so a
// hiccup never empties the list.
async function isShort(id, fetchImpl) {
  try {
    const response = await fetchImpl(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
      headers: YOUTUBE_HEADERS,
    });
    const location = response.headers.get("location") ?? "";
    return !(response.status >= 300 && response.status < 400 && location.includes("/watch"));
  } catch {
    return true;
  }
}

export async function syncShorts({
  channelId = DEFAULT_CHANNEL_ID,
  outFile = DEFAULT_OUT_FILE,
  fetchImpl = fetch,
  log = console,
} = {}) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetchImpl(feedUrl, { headers: YOUTUBE_HEADERS });
  if (!response.ok) {
    throw new Error(`Feed request failed with status ${response.status}`);
  }

  const { channel, items } = parseFeed(await response.text());

  const flags = await Promise.all(items.map((item) => isShort(item.id, fetchImpl)));
  const shorts = items
    .filter((_, index) => flags[index])
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published));

  if (shorts.length === 0) {
    throw new Error("Feed has entries but none of them is a Short");
  }

  const data = { channel, items: shorts };
  const json = JSON.stringify(data, null, 2) + "\n";

  // No timestamp, and no rewrite when nothing changed: a plain `npm run build`
  // must not dirty the committed JSON.
  if (existsSync(outFile) && readFileSync(outFile, "utf8") === json) {
    log.log(`shorts: ${shorts.length} Shorts, ${outFile} already up to date`);
    return data;
  }

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, json);
  log.log(`shorts: wrote ${shorts.length} Shorts to ${outFile}`);
  return data;
}

export async function main(options = {}) {
  const outFile = options.outFile ?? DEFAULT_OUT_FILE;
  const log = options.log ?? console;
  try {
    await syncShorts({ ...options, outFile, log });
    return 0;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (existsSync(outFile)) {
      log.warn(`shorts: sync failed (${reason}); keeping the committed ${outFile}`);
      return 0;
    }
    log.error(`shorts: sync failed (${reason}) and ${outFile} does not exist`);
    return 1;
  }
}

// Only run when executed as `node scripts/fetch-shorts.mjs`, not when imported by tests.
const invokedDirectly =
  typeof process.argv[1] === "string" &&
  import.meta.url.startsWith("file:") &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.exitCode = await main();
}
