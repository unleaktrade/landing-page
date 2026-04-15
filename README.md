# 🛡️ UnleakTrade Landing Page

The official **UnleakTrade** landing page — a fast, modern web experience introducing the UnleakTrade ecosystem: confidential OTC trading, RFQs, and trustless settlement on Solana.

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
| `npm run build`     | Production build (output → `build/`)                             |
| `npm test`          | Run the full test suite once                                     |
| `npm run test:watch`| Watch mode for local TDD                                         |
| `npm run coverage`  | Run tests with v8 coverage and enforce the 80% threshold         |

---

## 🧪 Testing

Vitest runs in a jsdom environment with Testing Library and a shared setup file (`src/test/setup.ts`) that shims `matchMedia`, `scrollTo`, `IntersectionObserver`, and `ResizeObserver`.

Coverage thresholds are enforced at **80%** (lines / branches / functions / statements). The following paths are excluded as vendored or non-business code:

- `src/components/ui/**` — shadcn/ui primitives
- `src/components/figma/**`
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
│   ├── figma/                 # Figma export helpers
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

- **`ci.yml`** — on push (non-main) and pull requests: installs deps, builds, runs tests with coverage. Coverage dropping below 80% fails the run.
- **`deploy.yml`** — on push to `main`: builds and publishes to GitHub Pages (`unleak.trade`).

No manual deployment — merging to `main` is the release.

---

## 🖼️ Branding

The favicon and title are configured in `index.html`:

```html
<title>UnleakTrade | Confidential Solana OTC Trading & RFQs</title>
<link rel="icon" type="image/png" href="/favicon.png" />
```

To change branding, replace `public/favicon.png` and update the `<title>` / meta tags in `index.html`.

---

## 🤝 Contributing

Pull requests are welcome. Please:

1. Open an issue before large changes.
2. Keep `npm test` and `npm run build` green in your branch.
3. Follow the existing commit style (subject mirrors the related GitHub issue title).

---

## 📜 License

MIT — see the `LICENSE` file.

---

© UnleakTrade — All rights reserved.
