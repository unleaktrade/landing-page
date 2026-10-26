/**
 * Per-route SEO metadata: the single source for the build-time prerender
 * (scripts/prerender.mjs), the generated sitemap and the client-side head
 * updates on navigation (Seo.tsx).
 *
 * Copy rules from CLAUDE.md apply here too: no long dashes, compare to
 * categories rather than named competitors.
 */

export const SITE_URL = "https://unleak.trade";
export const SITE_NAME = "UnleakTrade";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSeo {
  /** Route path (no trailing slash, "/" for home). */
  path: string;
  /** Set when this URL duplicates another page: the canonical points there. */
  canonicalPath?: string;
  title: string;
  description: string;
  /** false renders `noindex`. Only indexable, self-canonical pages enter the sitemap. */
  indexable: boolean;
  ogImage?: string;
  changefreq?: "weekly" | "monthly";
  priority?: number;
}

const HOME: PageSeo = {
  path: "/",
  title: "UnleakTrade | Confidential OTC Trading and RFQ Auctions on Solana",
  description:
    "Trade any SPL token through private, sealed-bid OTC auctions on Solana: blind quotes, competitive price discovery, verified liquidity and guaranteed on-chain settlement.",
  indexable: true,
  changefreq: "weekly",
  priority: 1.0,
};

const FAQ: PageSeo = {
  path: "/faq",
  title: "FAQ | How UnleakTrade OTC Auctions Work",
  description:
    "Answers on UnleakTrade's commit-reveal RFQ auctions: bonds, fees, liquidity attestations, settlement, the Devnet beta and the uUSDC test token.",
  indexable: true,
  changefreq: "monthly",
  priority: 0.8,
};

const ROADMAP: PageSeo = {
  path: "/roadmap",
  title: "Roadmap | UnleakTrade",
  description:
    "The UnleakTrade roadmap: from the public Devnet beta to mainnet, building Solana's private, permissionless OTC market infrastructure phase by phase.",
  indexable: true,
  changefreq: "monthly",
  priority: 0.7,
};

const BUILDER: PageSeo = {
  path: "/builder",
  title: "The Builder | UnleakTrade",
  description:
    "Who builds UnleakTrade: an independent project combining deep protocol expertise with strategic vision to bring institutional-grade privacy to crypto OTC markets.",
  indexable: true,
  changefreq: "monthly",
  priority: 0.6,
};

const ACADEMY: PageSeo = {
  path: "/academy",
  title: "UnleakTrade Academy | Wick Masters, the arcade guide to crypto charts",
  description:
    "Learn to read crypto charts one pattern at a time. Download the free Wick Masters demo: candlestick basics, the seven single-candle patterns and a printable cheat sheet.",
  indexable: true,
  changefreq: "weekly",
  priority: 0.7,
};

const WAITLIST: PageSeo = {
  path: "/waitlist",
  title: "Request Access | UnleakTrade",
  description:
    "Join the UnleakTrade waitlist to activate your spot and receive the 1,000 uUSDC Devnet airdrop (a test token with no real-world value) for the public beta.",
  indexable: true,
  changefreq: "weekly",
  priority: 0.8,
};

const TEAM: PageSeo = {
  path: "/team",
  title: "Team | UnleakTrade",
  description:
    "The people building UnleakTrade, confidential OTC trading and RFQ auctions on Solana.",
  // The Team links are hidden in the navigation, so keep it out of the index.
  indexable: false,
};

const ACTIVATE: PageSeo = {
  path: "/activate",
  title: "Activate Your Spot | UnleakTrade",
  description: "Activate your UnleakTrade waitlist spot.",
  indexable: false,
};

// /app renders the waitlist (it is the navbar CTA target), so it is a duplicate.
const APP: PageSeo = { ...WAITLIST, path: "/app", canonicalPath: "/waitlist" };

/** Routes the build prerenders to static HTML, in sitemap order. */
export const PRERENDERED_PAGES: PageSeo[] = [HOME, FAQ, ROADMAP, BUILDER, ACADEMY, WAITLIST, APP, TEAM];

/** Resolve the metadata for any pathname the router can render. */
export function resolveSeo(pathname: string): PageSeo {
  const path = pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  const [, first = ""] = path.split("/");
  switch (first) {
    case "":
      return HOME;
    case "faq":
      return FAQ;
    case "roadmap":
      return ROADMAP;
    case "builder":
      return BUILDER;
    case "academy":
      return ACADEMY;
    case "team":
      return TEAM;
    case "activate":
      return ACTIVATE;
    case "waitlist":
      // Personal referral links (/waitlist/<sponsor>) canonicalise to /waitlist
      // so they never compete with it.
      return path === "/waitlist" ? WAITLIST : { ...WAITLIST, path, canonicalPath: "/waitlist" };
    case "app":
      return APP;
    default:
      // Unknown routes redirect to home on the client.
      return HOME;
  }
}

export function canonicalUrl(page: PageSeo): string {
  const path = page.canonicalPath ?? page.path;
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Path of the prerendered file for a page, relative to the build dir. */
export function outputFileFor(page: PageSeo): string {
  return page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
}

export function sitemapXml(pages: PageSeo[], lastmod: string): string {
  const urls = pages
    .filter((p) => p.indexable && !p.canonicalPath)
    .map(
      (p) =>
        `  <url>\n    <loc>${canonicalUrl(p)}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        (p.changefreq ? `    <changefreq>${p.changefreq}</changefreq>\n` : "") +
        (p.priority !== undefined ? `    <priority>${p.priority.toFixed(1)}</priority>\n` : "") +
        `  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The route-specific head tags, as an HTML string for the prerender. Every tag
 * carries `data-seo` so Seo.tsx can find and update them on navigation.
 */
export function headTags(page: PageSeo): string {
  const url = canonicalUrl(page);
  const image = page.ogImage ?? DEFAULT_OG_IMAGE;
  const title = escapeAttr(page.title);
  const desc = escapeAttr(page.description);
  return [
    `<title>${title}</title>`,
    `<meta data-seo name="description" content="${desc}" />`,
    `<meta data-seo name="robots" content="${robotsContent(page)}" />`,
    `<link data-seo rel="canonical" href="${url}" />`,
    `<meta data-seo property="og:title" content="${title}" />`,
    `<meta data-seo property="og:description" content="${desc}" />`,
    `<meta data-seo property="og:url" content="${url}" />`,
    `<meta data-seo property="og:image" content="${image}" />`,
    `<meta data-seo name="twitter:title" content="${title}" />`,
    `<meta data-seo name="twitter:description" content="${desc}" />`,
    `<meta data-seo name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}

export function robotsContent(page: PageSeo): string {
  return page.indexable
    ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    : "noindex,follow";
}
