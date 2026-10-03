export type ShortItem = {
  id: string;
  title: string;
  published: string;
};

/** The channel intro Short, always shown first in the carousel. */
export const PINNED_SHORT_ID = "WBzioQO_4lw";

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
