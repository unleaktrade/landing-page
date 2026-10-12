import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { canonicalUrl, DEFAULT_OG_IMAGE, resolveSeo, robotsContent } from "./routes";

type Attr = "name" | "property";

function upsertMeta(attr: Attr, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-seo", "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute("data-seo", "");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Keeps the document head in sync with the current route on client-side
 * navigation. The prerendered HTML already ships the right tags for the first
 * load; this updates them in place (never duplicates) when the route changes.
 */
export function Seo() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    const page = resolveSeo(pathname);
    const url = canonicalUrl(page);
    const image = page.ogImage ?? DEFAULT_OG_IMAGE;

    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertMeta("name", "robots", robotsContent(page));
    upsertCanonical(url);
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", image);

    // Structured data belongs to the page it was prerendered for; drop it once
    // the visitor navigates elsewhere.
    if (!firstRender.current) {
      document.head.querySelectorAll("script[data-seo-jsonld]").forEach((s) => s.remove());
    }
    firstRender.current = false;
  }, [pathname]);

  return null;
}
