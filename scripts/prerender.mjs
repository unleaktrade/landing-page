// Build-time prerender (static site generation) for unleak.trade.
//
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx`.
// For every public route it renders the React tree to HTML and writes
// build/<route>.html with that route's own <title>, description, canonical,
// Open Graph tags and JSON-LD. GitHub Pages serves /faq from faq.html with a
// 200, where the old SPA setup answered every non-home URL with the 404.html
// fallback (HTTP 404), which kept those pages out of search results.
//
// It also writes build/sitemap.xml from the same route table, and a noindex
// build/404.html shell for dynamic routes (/waitlist/<sponsor>, /team/<id>,
// /activate/<token>) and unknown URLs, which still render client-side.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "build");
const ssrDir = path.join(root, "build-ssr");

// The SSR bundle is never deployed; it only needs to exist while this runs.
// Vite names it .js in an ESM package ("type": "module") and .mjs otherwise.
const ssrEntry = ["entry-server.js", "entry-server.mjs"]
  .map((f) => path.join(ssrDir, f))
  .find((f) => fs.existsSync(f));
if (!ssrEntry) throw new Error("prerender: build-ssr/entry-server.{js,mjs} not found; run the SSR build first");
const { render, structuredData, headTags, outputFileFor, PRERENDERED_PAGES, sitemapXml } =
  await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error("prerender: index.html is missing the seo block or the empty #root div");
}

function page(head, body, routePath) {
  const html = template.replace(SEO_BLOCK, head);
  return routePath === null
    ? html
    : html.replace(ROOT_DIV, `<div id="root" data-prerendered="${routePath}">${body}</div>`);
}

for (const p of PRERENDERED_PAGES) {
  const body = await render(p.path);
  // A route that renders nothing (or only redirects) would ship an empty page.
  if (!body.includes("<main")) throw new Error(`prerender: ${p.path} rendered no <main>`);
  const ld = structuredData(p);
  const head = headTags(p) + (ld ? `\n    ${ld}` : "");
  const file = path.join(outDir, outputFileFor(p));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(head, body, p.path));
  console.log(`prerendered ${p.path.padEnd(10)} -> ${path.relative(root, file)} (${(body.length / 1024).toFixed(1)} kB)`);
}

// 404 shell: no prerendered markup (the client renders whatever route it is),
// never indexed.
const notFoundHead = [
  "<title>UnleakTrade</title>",
  '<meta data-seo name="robots" content="noindex,follow" />',
].join("\n    ");
fs.writeFileSync(path.join(outDir, "404.html"), page(notFoundHead, "", null));
console.log("wrote 404.html (client-rendered shell, noindex)");

const lastmod = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapXml(PRERENDERED_PAGES, lastmod));
console.log("wrote sitemap.xml");

fs.rmSync(ssrDir, { recursive: true, force: true });
