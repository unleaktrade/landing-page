# 🛡️ UnleakTrade Landing Page

The official **UnleakTrade** landing page: a fast, modern web experience introducing the UnleakTrade ecosystem: confidential OTC trading, RFQs, and trustless settlement on Solana. It also hosts the **UnleakTrade Academy** and its first guide, **Wick Masters** (the arcade guide to reading crypto charts): a free demo download and the paid full guide.

---

## 🚀 Overview

React application whose public routes are prerendered to static HTML at build time, then hydrated in the browser (React Router). Dynamic routes render client-side. Static marketing pages, the Academy page (Wick Masters free demo and full guide), plus a waitlist registration + activation flow backed by a small external API (the `waitlist` service).

| Route | Page |
|-------|------|
| `/` | Home: hero, value props, how it works, Shorts, settlement process, economics, team, community |
| `/roadmap` | Roadmap |
| `/team`, `/team/:memberId` | Team |
| `/faq` | FAQ |
| `/builder` | Builder page |
| `/academy` | UnleakTrade Academy: Wick Masters free demo by email, buy button for the full guide, level overview, Shorts links, risk notice |
| `/academy/thanks` | Thank-you page after buying the full guide (`noindex`) |
| `/waitlist`, `/waitlist/:sponsor`, `/app` | Waitlist registration (optionally prefilled with a sponsor address) |
| `/activate/:token` | Waitlist activation and uUSDC airdrop status |

Any other URL redirects to `/`.

---

## 🧰 Tech Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| Build tool  | [Vite 8](https://vitejs.dev/) + [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) |
| UI          | [React 19](https://react.dev/) + TypeScript                             |
| Routing     | [react-router 8](https://reactrouter.com/)                              |
| Styling     | Precompiled Tailwind v4 stylesheet (`src/index.css`) + a few [Radix UI](https://www.radix-ui.com/) primitives (shadcn/ui) |
| Animation   | [Motion](https://motion.dev/)                                           |
| Forms       | [react-hook-form](https://react-hook-form.com/)                         |
| Notifications | [sonner](https://sonner.emilkowal.ski/)                               |
| Icons       | [lucide-react](https://lucide.dev/)                                     |
| Address validation | In-house base58 + ed25519 on-curve check (`utils/validation.ts`); [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) is a dev dependency used only as a test oracle |
| Testing     | [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + jsdom + v8 coverage |
| CI / Deploy | GitHub Actions → GitHub Pages                                           |

**Node:** 22.x LTS (Vite 8 requires `>=20.19` or `>=22.12`). CI and deploy use Node 22, the Vercel preview workflow uses Node 20, and nothing pins the version locally (no `.nvmrc`, no `engines`).

**Tailwind is not a build step.** There is no `tailwindcss` dependency: `src/index.css` is a precompiled Tailwind v4 build, so only the classes already present in that file work.

**No environment variables.** Nothing reads `import.meta.env`; outbound URLs (waitlist API, app, Telegram, YouTube, TikTok, Wick Masters) are constants in `src/components/utils/links.ts`.

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

Vitest runs in a jsdom environment with Testing Library and a shared setup file (`src/test/setup.ts`) that shims `matchMedia`, `scrollTo`, `scrollIntoView`, `IntersectionObserver`, and `ResizeObserver` (skipped in suites that run in the Node environment).

Coverage thresholds are enforced at **80%** (lines / branches / functions / statements). The following paths are excluded as vendored or non-business code:

- `src/components/ui/**`: shadcn/ui primitives (only the ones the site imports; add a single file and its package when you need one, never the whole catalog)
- `src/assets/**`, `src/styles/**`, `src/guidelines/**`
- `src/test/**`, `src/**/*.d.ts`
- `src/main.tsx`

Coverage HTML report is written to `coverage/` after `npm run coverage`.

---

## 🗺️ Project structure

```
scripts/
└── prerender.mjs              # Renders every public route to build/<route>.html, 404.html, sitemap.xml
src/
├── App.tsx                    # AppRoutes (shared by the browser and the prerender) + top-level layout
├── main.tsx                   # Browser entrypoint (hydrates the prerendered markup)
├── entry-server.tsx           # SSR entry used by the prerender step
├── hydration.ts
├── index.css                  # Precompiled Tailwind v4 stylesheet
├── seo/
│   ├── routes.ts              # Per-route title / description / canonical table
│   ├── Seo.tsx                # Client-side head updates on navigation
│   └── jsonld.ts              # Structured data
├── components/
│   ├── <page sections>.tsx    # Hero, ValueProps, HowItWorks, SettlementProcess, Economics,
│   │                          # Shorts, FAQ, Roadmap, Team, Waitlist, BuilderPage, WarpField…
│   ├── AcademyPage.tsx        # /academy: Wick Masters demo, buy button, levels, risk notice
│   ├── AcademyThanksPage.tsx  # /academy/thanks: thank-you page
│   ├── LazyDialogs.tsx        # Lazily loaded dialogs
│   ├── ui/                    # shadcn/ui primitives (vendored)
│   └── utils/
│       ├── validation.ts      # Email / Solana-address / SHA3 validators
│       ├── links.ts           # Outbound URLs and the waitlist API base URL
│       └── shorts.ts          # Static list of YouTube Shorts
└── test/
    ├── setup.ts               # jsdom shims + RTL cleanup
    ├── routes.test.tsx        # Route-level mounts and navigation
    ├── interactions.test.tsx  # Form submission, dialogs, accordions
    ├── prerender.test.tsx     # Renders every page without a DOM
    ├── seo.test.tsx
    ├── airdrop.test.tsx, shorts.test.tsx, warpfield.test.tsx, moving-squares.test.tsx
    ├── dead-components.test.tsx
    └── smoke.test.tsx
```

Unit tests for `validation.ts` and `shorts.ts` sit next to them in `components/utils/`.

### External services

- **Waitlist API**: the base URL is the `API_BASE_URL` constant in `src/components/utils/links.ts` (the Heroku app of the `waitlist` repo). The site calls `POST /register` and `POST /activate/<token>/<hash>`.
- **YouTube Shorts**: a static list (`shortsData` in `src/components/utils/shorts.ts`), with the intro Short pinned first via `PINNED_SHORT_ID` followed by the three most recent. There is no build-time feed sync: add a Short by editing that file.
- **Analytics**: a Google Analytics tag in `index.html`.

---

## ⚙️ CI / CD

Three GitHub Actions workflows:

- **`ci.yml`**: on push (non-main) and pull requests: installs deps, builds, runs tests with coverage. Coverage dropping below 80% fails the run. It is also a reusable workflow, called by `deploy.yml`.
- **`deploy.yml`**: on push to `main`: runs the CI job, then builds, checks that the prerendered pages exist (`build/faq.html`, `build/404.html`, `build/sitemap.xml`) and publishes to GitHub Pages (`unleak.trade`).
- **`preview.yml`**: on pull requests from branches of this repository: deploys a Vercel preview and comments its URL on the PR (`vercel.json` enables clean URLs so the prerendered pages resolve there too).

No manual deployment; merging to `main` is the release.

---

## 🔎 SEO and prerendering

`npm run build` runs three steps: the client build, an SSR build of `src/entry-server.tsx`, and `scripts/prerender.mjs`, which renders every public route to its own static file (`build/faq.html`, `build/roadmap.html`, ...). GitHub Pages serves `/faq` from `faq.html` with a 200, so crawlers get the real content, title and canonical for each page. The browser then hydrates that markup (`src/main.tsx`, `src/hydration.ts`).

- **Per-page metadata** (title, description, canonical, robots, Open Graph / Twitter) lives in one table: `src/seo/routes.ts`. It drives the prerendered `<head>`, `build/sitemap.xml` and the client-side head updates on navigation (`src/seo/Seo.tsx`). Add a route there when you add a page.
- **Structured data**: `src/seo/jsonld.ts` (Organization + WebSite on home, FAQPage on `/faq`, built from `faqData` in `FAQ.tsx`).
- **Dynamic routes** (`/waitlist/<sponsor>`, `/team/<id>`, `/activate/<token>`), `/academy/thanks` and unknown URLs fall back to `build/404.html`, a client-rendered `noindex` shell. `/academy/thanks` is deliberately not prerendered: an `academy/` folder next to `academy.html` would make GitHub Pages redirect `/academy` to `/academy/`.
- Code that runs during render must not touch `window` / `document` (do that in effects); `src/test/prerender.test.tsx` renders every page in a DOM-less Node environment to catch it.
- Social share image: `public/og-image.png` (1200x630). Icons: `public/favicon.png`, `public/icon-192.png`, `public/apple-touch-icon.png`.

---

## 🎓 UnleakTrade Academy (Wick Masters)

`/academy` presents **Wick Masters**, the arcade guide to reading crypto charts (11 levels and a Boss Level, plus 10 cheat sheets): a free demo to download and the full guide to buy.

- The content is neutral education: no call to use the UnleakTrade app inside the Wick Masters blocks, no promise of gains, no performance figures. The risk notice (`RISK_NOTICE` in `AcademyPage.tsx`) stays on the page.
- No price on this site: it lives only on the checkout (a test checks it).
- The free demo is sent by email so every download is tracked. The form (`AcademyDemoForm.tsx`) POSTs `email`, `website`, `source` and `token` (form-urlencoded) to `WICKMASTERS_DEMO_WEBHOOK_URL` (`links.ts`), the Airtable automation **Free demo request -> deliver demo** in the *Wick Masters Sales* base. It logs a row in `Orders` with status `Free demo`, emails the PDF link through Gmail, then sets the status to `Free demo sent`. The body also carries a Cloudflare Turnstile token (`TURNSTILE_SITE_KEY` in `links.ts`, script loaded on demand by `utils/turnstile.ts`); the automation verifies it with the `TURNSTILE_SECRET` Airtable secret (action `free-demo`, hostname `unleak.trade`) before doing anything else. `website` is a honeypot; the automation also ignores repeat requests from the same address within 24 hours and caps free demo emails at 200 a day.
- The POST is a `no-cors` simple request with a form-urlencoded body (`URLSearchParams`, no custom headers): the Airtable webhook does not answer CORS preflights, so JSON is out, and it rejects `text/plain`. Its origin is allowed in the CSP `connect-src`, and `https://challenges.cloudflare.com` in `script-src` and `frame-src` (`src/seo/csp.ts`).
- The demo PDF URL lives only in the Airtable email template, never on the site. It is a versioned PDF cached for a year: a new version gets a new file name, then update the email template and `DEMO_VERSION` in the automation script.

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

© UnleakTrade. All rights reserved.
