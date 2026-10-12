/**
 * Build-time prerender entry (never shipped to the browser). Built with
 * `vite build --ssr` and driven by scripts/prerender.mjs, which writes one
 * static HTML file per public route.
 */
import { PassThrough } from "node:stream";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./App";
import { faqData } from "./components/FAQ";
import {
  faqPageJsonLd,
  jsonLdScripts,
  organizationJsonLd,
  websiteJsonLd,
} from "./seo/jsonld";
import {
  headTags,
  outputFileFor,
  PRERENDERED_PAGES,
  sitemapXml,
  type PageSeo,
} from "./seo/routes";

export { headTags, outputFileFor, PRERENDERED_PAGES, sitemapXml };
export type { PageSeo };

/** Render a route to HTML, waiting for every Suspense boundary to resolve. */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  );
  const chunks: Buffer[] = [];
  const sink = new PassThrough();
  prelude.pipe(sink);
  for await (const chunk of sink) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

/** schema.org blocks for a page, as ready-to-inject script tags. */
export function structuredData(page: PageSeo): string {
  switch (page.path) {
    case "/":
      return jsonLdScripts([organizationJsonLd(), websiteJsonLd()]);
    case "/faq":
      return jsonLdScripts([faqPageJsonLd(faqData)]);
    default:
      return "";
  }
}
