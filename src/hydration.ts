/**
 * Decides whether the page in the browser can hydrate the prerendered markup
 * or must render from scratch.
 *
 * scripts/prerender.mjs stamps `data-prerendered="<route path>"` on #root. We
 * only hydrate when that markup was rendered for the URL being shown: the
 * 404.html shell (dynamic routes like /waitlist/<sponsor>, unknown URLs) ships
 * an empty root, so it renders client-side as before.
 */
export function shouldHydrate(root: HTMLElement, pathname: string): boolean {
  const rendered = root.dataset.prerendered;
  if (!rendered || !root.firstElementChild) return false;
  return normalizePath(pathname) === rendered;
}

/** "/faq/", "/faq.html" and "/faq" are the same page; "/" stays "/". */
export function normalizePath(pathname: string): string {
  return pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
}
