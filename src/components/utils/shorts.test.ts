import { describe, it, expect } from 'vitest';
import {
  PINNED_SHORT_ID,
  selectShorts,
  splitTitle,
  shortThumbnailUrl,
  shortFallbackThumbnailUrl,
  shortEmbedUrl,
  shortWatchUrl,
  type ShortItem,
} from './shorts';

const feed: ShortItem[] = [
  { id: 'newest', title: 'Newest', published: '2026-10-05T10:00:00+00:00' },
  { id: 'second', title: 'Second', published: '2026-10-03T10:00:00+00:00' },
  { id: PINNED_SHORT_ID, title: 'Intro', published: '2026-09-24T01:00:00+00:00' },
  { id: 'third', title: 'Third', published: '2026-10-01T10:00:00+00:00' },
  { id: 'oldest', title: 'Oldest', published: '2026-09-20T10:00:00+00:00' },
];

describe('selectShorts', () => {
  it('puts the pinned intro first, then the three most recent others', () => {
    expect(selectShorts(feed).map((s) => s.id)).toEqual([
      PINNED_SHORT_ID,
      'newest',
      'second',
      'third',
    ]);
  });

  it('skips the pinned slot when the intro is absent from the feed', () => {
    const withoutIntro = feed.filter((s) => s.id !== PINNED_SHORT_ID);
    expect(selectShorts(withoutIntro).map((s) => s.id)).toEqual(['newest', 'second', 'third']);
  });

  it('returns everything available when the feed has fewer than four items', () => {
    const small = feed.slice(0, 3);
    expect(selectShorts(small).map((s) => s.id)).toEqual([PINNED_SHORT_ID, 'newest', 'second']);
  });

  it('never lists the pinned item twice', () => {
    const ids = selectShorts(feed).map((s) => s.id);
    expect(ids.filter((id) => id === PINNED_SHORT_ID)).toHaveLength(1);
  });

  it('honours a custom pinned id and recent count', () => {
    expect(selectShorts(feed, 'oldest', 1).map((s) => s.id)).toEqual(['oldest', 'newest']);
  });

  it('returns an empty list for an empty feed', () => {
    expect(selectShorts([])).toEqual([]);
  });
});

describe('splitTitle', () => {
  it('splits a series suffix off the headline', () => {
    expect(splitTitle("Your OTC quote got copied. Here's the fix | VS The Market #1")).toEqual({
      headline: "Your OTC quote got copied. Here's the fix",
      series: 'VS The Market #1',
    });
  });

  it('returns the whole title as headline when there is no series', () => {
    expect(splitTitle('How Bonds Keep UnleakTrade Fair')).toEqual({
      headline: 'How Bonds Keep UnleakTrade Fair',
    });
  });
});

describe('url helpers', () => {
  it('builds the vertical poster url', () => {
    expect(shortThumbnailUrl('abc')).toBe('https://i.ytimg.com/vi/abc/oar2.jpg');
  });

  it('builds the fallback poster url', () => {
    expect(shortFallbackThumbnailUrl('abc')).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg');
  });

  it('builds a privacy-enhanced autoplaying embed url', () => {
    const url = new URL(shortEmbedUrl('abc'));
    expect(url.origin).toBe('https://www.youtube-nocookie.com');
    expect(url.pathname).toBe('/embed/abc');
    expect(url.searchParams.get('autoplay')).toBe('1');
    expect(url.searchParams.get('playsinline')).toBe('1');
    expect(url.searchParams.get('rel')).toBe('0');
  });

  it('builds the public watch url', () => {
    expect(shortWatchUrl('abc')).toBe('https://www.youtube.com/shorts/abc');
  });
});
