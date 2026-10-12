# 🛡️ UnleakTrade Landing Page

The official **UnleakTrade** landing page: a fast, modern web experience introducing the UnleakTrade ecosystem: confidential OTC trading, RFQs, and trustless settlement on Solana.

---

## 🚀 Overview

Single-page React application rendered client-side with React Router. Static marketing pages plus a waitlist registration + activation flow backed by a small external API.

---

## 🧰 Tech Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| Build tool  | [Vite 8](https://vitejs.dev/) + [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react) |
| UI          | [React 19](https://react.dev/) + TypeScript                             |
| Routing     | [react-router-dom 7](https://reactrouter.com/)                          |
| Styling     | Tailwind CSS + [Radix UI](https://www.radix-ui.com/) primitives (shadcn/ui) |
| Animation   | [Motion](https://motion.dev/)                                           |
| Forms       | [react-hook-form](https://react-hook-form.com/)                         |
| Notifications | [sonner](https://sonner.emilkowal.ski/)                               |
| Icons       | [lucide-react](https://lucide.dev/)                                     |
| Web3 (validation) | [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)  |
| Testing     | [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + jsdom + v8 coverage |
| CI / Deploy | GitHub Actions → GitHub Pages                                           |

**Node:** 22.x LTS (Vite 8 requires `>=20.19` or `>=22.12`).

---

## 🧭 Local Development

```bash
git clone https://github.com/unleaktrade/landing-page.git
cd landing-page

npm install
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command             | Purpose                                                          |
|---------------------|------------------------------------------------------------------|
| `npm run dev`       | Vite dev server with HMR                                         |
| `npm run build`     | Production build + prerender of every public route (→ `build/`)  |
| `npm test`          | Run the full test suite once                                     |
| `npm run test:watch`| Watch mode for local TDD                                         |
| `npm run coverage`  | Run tests with v8 coverage and enforce the 80% threshold         |

---

## 🧪 Testing

Vitest runs in a jsdom environment with Testing Library and a shared setup file (`src/test/setup.ts`) that shims `matchMedia`, `scrollTo`, `IntersectionObserver`, and `ResizeObserver`.

Coverage thresholds are enforced at **80%** (lines / branches / functions / statements). The following paths are excluded as vendored or non-business code:

- `src/components/ui/**`: shadcn/ui primitives
- `src/assets/**`, `src/styles/**`, `src/guidelines/**`
- `src/main.tsx`

Coverage HTML report is written to `coverage/` after `npm run coverage`.

---

## 🗺️ Project structure

```
src/
├── App.tsx                    # Router + top-level layout
├── main.tsx                   # Entrypoint
├── components/
│   ├── <page sections>.tsx    # Hero, FAQ, Roadmap, Team, Waitlist…
│   ├── ui/                    # shadcn/ui primitives (vendored)
│   └── utils/validation.ts    # Email / Solana-address / SHA3 validators
└── test/
    ├── setup.ts               # jsdom shims + RTL cleanup
    ├── routes.test.tsx        # Route-level mounts and navigation
    ├── interactions.test.tsx  # Form submission, dialogs, accordions
    ├── dead-components.test.tsx
    └── smoke.test.tsx
```

---

## ⚙️ CI / CD

Two GitHub Actions workflows:

- **`ci.yml`**: on push (non-main) and pull requests: installs deps, builds, runs tests with coverage. Coverage dropping below 80% fails the run.
- **`deploy.yml`**: on push to `main`: builds and publishes to GitHub Pages (`unleak.trade`).

No manual deployment; merging to `main` is the release.

---

## 🔎 SEO and prerendering

`npm run build` runs three steps: the client build, an SSR build of `src/entry-server.tsx`, and `scripts/prerender.mjs`, which renders every public route to its own static file (`build/faq.html`, `build/roadmap.html`, ...). GitHub Pages serves `/faq` from `faq.html` with a 200, so crawlers get the real content, title and canonical for each page. The browser then hydrates that markup (`src/main.tsx`, `src/hydration.ts`).

- **Per-page metadata** (title, description, canonical, robots, Open Graph / Twitter) lives in one table: `src/seo/routes.ts`. It drives the prerendered `<head>`, `build/sitemap.xml` and the client-side head updates on navigation (`src/seo/Seo.tsx`). Add a route there when you add a page.
- **Structured data**: `src/seo/jsonld.ts` (Organization + WebSite on home, FAQPage on `/faq`, built from `faqData` in `FAQ.tsx`).
- **Dynamic routes** (`/waitlist/<sponsor>`, `/team/<id>`, `/activate/<token>`) and unknown URLs fall back to `build/404.html`, a client-rendered `noindex` shell.
- Code that runs during render must not touch `window` / `document` (do that in effects); `src/test/prerender.test.tsx` renders every page in a DOM-less Node environment to catch it.
- Social share image: `public/og-image.png` (1200x630). Icons: `public/favicon.png`, `public/icon-192.png`, `public/apple-touch-icon.png`.

---

## 🖼️ Branding

The favicon is `public/favicon.png` (plus `icon-192.png` and `apple-touch-icon.png`), linked from `index.html`. Page titles and descriptions are per route in `src/seo/routes.ts`; the defaults inside the `seo:start` / `seo:end` block of `index.html` are only used by the dev server.

## ⚡ Background performance

The animated mesh (`WarpField.tsx`) is a fixed WebGL canvas behind every page. Keep it cheap:

- Never put `backdrop-blur` / `backdrop-filter` on elements that sit over it: a backdrop blur over a canvas that repaints ~30 times a second re-blurs every frame and during scroll. Use the `glass-card` class (near-opaque fill, defined at the end of `index.css`) for panels instead.
- Animate only `transform` and `opacity`. Animating `background`, `filter` or layout properties repaints on the main thread.

---

## 🤝 Contributing

Pull requests are welcome. Please:

1. Open an issue before large changes.
2. Keep `npm test` and `npm run build` green in your branch.
3. Follow the existing commit style (subject mirrors the related GitHub issue title).

---

## 📜 License

MIT. See the `LICENSE` file.

---

© UnleakTrade. All rights reserved.
