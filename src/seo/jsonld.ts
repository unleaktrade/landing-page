/**
 * schema.org structured data, serialised into the prerendered pages only
 * (crawlers always load a URL fresh, so client navigation never needs it).
 */
import { TELEGRAM_URL, YOUTUBE_URL } from "../components/utils/links";
import { SITE_NAME, SITE_URL } from "./routes";

type JsonLd = Record<string, unknown>;

export interface FaqEntry {
  question: string;
  answer: string;
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    sameAs: [
      "https://twitter.com/unleaktrade",
      "https://github.com/unleaktrade",
      YOUTUBE_URL,
      TELEGRAM_URL,
    ],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * Plain text for structured data: drops the FAQ renderer's `**bold**` and
 * `` `code` `` markers and the literal bullet prefixes, keeps line breaks.
 */
export function toPlainText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^\u2022\s*/gm, "- ")
    .trim();
}

export function faqPageJsonLd(entries: FaqEntry[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: toPlainText(e.answer) },
    })),
  };
}

/**
 * `<script type="application/ld+json">` tags. `<` is escaped so no answer text
 * can ever close the script element early.
 */
export function jsonLdScripts(blocks: JsonLd[]): string {
  return blocks
    .map(
      (b) =>
        `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(b).replace(/</g, "\\u003c")}</script>`
    )
    .join("\n    ");
}
