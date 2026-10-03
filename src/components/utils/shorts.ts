export type ShortItem = {
  id: string;
  title: string;
  published: string;
};

/** The channel intro Short, always shown first in the carousel. */
export const PINNED_SHORT_ID = "WBzioQO_4lw";

/**
 * Shorts from the UnleakTrade Education channel. Static on purpose: to add a
 * new Short, copy its id from youtube.com/shorts/<id> and add an entry here.
 * The carousel shows the pinned intro plus the three most recent by `published`.
 */
export const shortsData: ShortItem[] = [
  {
    id: "sCgjBjxvgQA",
    title: "Deal agreed. Who wires first? | VS The Market #3",
    published: "2026-10-03T16:00:07+00:00",
  },
  {
    id: "o9ikIrMt0Hw",
    title: "Free OTC quotes mean nothing. Bonds fix that | VS The Market #2",
    published: "2026-10-01T16:00:20+00:00",
  },
  {
    id: "dP0y_nO0bl8",
    title: "Your OTC quote got copied. Here's the fix | VS The Market #1",
    published: "2026-09-29T16:00:19+00:00",
  },
  {
    id: "q98il8RsMkI",
    title: "How Bonds Keep UnleakTrade Fair",
    published: "2026-09-24T07:52:25+00:00",
  },
  {
    id: PINNED_SHORT_ID,
    title: "We’re building the best OTC desk on Solana",
    published: "2026-09-24T01:19:49+00:00",
  },
];

/**
 * Pinned intro first (if the feed still has it), then the most recent
 * `recentCount` other items, newest first.
 */
export function selectShorts(
  items: ShortItem[],
  pinnedId: string = PINNED_SHORT_ID,
  recentCount = 3,
): ShortItem[] {
  const pinned = items.find((item) => item.id === pinnedId);
  const recent = items
    .filter((item) => item.id !== pinnedId)
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
    .slice(0, recentCount);
  return pinned ? [pinned, ...recent] : recent;
}

/** "Headline | Series #1" becomes a headline plus an optional series badge. */
export function splitTitle(title: string): { headline: string; series?: string } {
  const separator = title.indexOf(" | ");
  if (separator === -1) return { headline: title };
  return {
    headline: title.slice(0, separator).trim(),
    series: title.slice(separator + 3).trim(),
  };
}

/** Vertical 9:16 poster that YouTube generates for Shorts. */
export const shortThumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/oar2.jpg`;

/** Landscape poster that exists for every video, used when the vertical one is missing. */
export const shortFallbackThumbnailUrl = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Privacy-enhanced player: no YouTube cookies until the visitor presses play. */
export const shortEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

export const shortWatchUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;
