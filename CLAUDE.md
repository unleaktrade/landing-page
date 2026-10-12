# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Marketing landing page for UnleakTrade, a private OTC/RFQ auction protocol on Solana.
React + TypeScript + Vite, Tailwind, `motion/react` for animation, React Router.

```bash
npm run dev        # dev server on :3000
npm run test       # vitest
npm run coverage   # vitest with 80% thresholds (CI runs this)
npm run build      # what CI builds
```

CI (`.github/workflows/ci.yml`) runs `npm run build` and `npm run coverage`. There is no
ESLint or Prettier config, so nothing auto-formats. Match surrounding style by hand.

**`npm run build` prerenders every public route** (client build, then an SSR build of
`src/entry-server.tsx`, then `scripts/prerender.mjs` writes `build/<route>.html`, the
sitemap and a `noindex` `404.html` shell). Consequences:

- Per-route title / description / canonical / robots live in `src/seo/routes.ts`; a new
  public page needs an entry there (and in `PRERENDERED_PAGES`) or it ships with no
  metadata and keeps the old HTTP 404.
- Nothing may touch `window`, `document` or `localStorage` during render (use effects or
  `useSyncExternalStore` with a server snapshot, like `Shorts.tsx`). The prerender test
  renders every page without a DOM and will fail.
- Do not copy `index.html` to `404.html` in a workflow; the build writes that file.

**`src/index.css` is a precompiled Tailwind v4 build, not a build step.** Tailwind is not a
dependency and nothing scans the JSX. A utility class only works if it is already in that
file; anything else (arbitrary values like `aspect-[9/16]`, fractions like `basis-1/4`,
most responsive variants) silently produces no CSS. Check with
`grep -c '\.your-class' src/index.css` before using a class you have not seen elsewhere in
the repo, and put genuinely new styles in a small scoped block at the end of `index.css`
(see the `.shorts-*` rules). The shadcn `ui/carousel.tsx` layout classes are among the
missing ones, so pass your own classes for slide sizing.

## Writing style

**Never use em dashes (U+2014), en dashes (U+2013), horizontal bars (U+2015), or figure
dashes (U+2012) anywhere in this repo.** Not in site copy, not in headings, not in code
comments, not in the README, not in workflow files, not in commit messages. Only the
plain ASCII hyphen is allowed.

This file deliberately names those characters by code point rather than printing them,
so that the check below can cover the whole repo with no exceptions to remember.

Instead of a dash, use a comma, a colon, a semicolon, parentheses, or a full stop. Pick
whichever actually fits the clause rather than swapping in a hyphen everywhere:

```
bad:   The escrow is the verifier <dash> every trade self-verifies.
good:  The escrow is the verifier: every trade self-verifies.

bad:   ...a real market <dash> makers and takers with volume <dash> on proven security.
good:  ...a real market (makers and takers with volume) on proven security.

bad:   No <dash> we work on different layers.
good:  No. We work on different layers.
```

The repo is currently at zero occurrences. Check before committing:

```bash
grep -rnP '[\x{2012}-\x{2015}]' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=build   # must return nothing
```

Two non-prose cases already have a settled answer, so do not relitigate them: the footer
separator between the copyright and the byline is a middle dot (`·`), and numeric ranges
spell out `to` (`$10k to <$500k`).

Other copy conventions, observed across the site:

- Expand acronyms on first use, inside the bolded term:
  `**OTC (Over-The-Counter)**`, `**PDA = Program Derived Address**`, `**TTL = Time To Live**`
- Backticks for on-chain identifiers and states: `` `taker_fee_bps` ``, `` `commit_ttl` ``, `` `Draft` ``
- Always qualify uUSDC as a devnet-only test token that mimics USDC, not real USDC, with
  no real-world value
- Compare to *categories* (AMM, DEX, public order book), not named competitors. The one
  deliberate exception is the Zama FAQ entry, which exists because people ask by name.
- Do not make claims about third parties' product status, roadmaps, or benchmarks. That
  information goes stale on a static page and cannot be maintained.

## Background performance

`WarpField.tsx` is a fixed WebGL canvas that repaints about 30 times a second behind every
page. Never put `backdrop-blur` / `backdrop-filter` on anything that sits over it (each
such panel re-blurs on every frame and during scroll; that was the old background lag).
Use the `glass-card` class for frosted panels and `nav-bar` for the navbar fill. Animate
only `transform` and `opacity`.

## Positioning

The Devnet beta at `app.unleak.trade` is **public**. Never describe it as gated behind
Request Access or the waitlist. Only the 1,000 uUSDC airdrop requires activating a
waitlist spot.

The FAQ is deliberately more careful than the marketing sections: it says liquidity is
verified with ed25519 attestations *today* and that zero-knowledge is the destination.
Hero, HowItWorks, and SettlementProcess use a more ZK-forward register. Keep the FAQ
honest about current state and about limitations.

## FAQ

All FAQ content is the `faqData` array in `src/components/FAQ.tsx`. Single file, single
locale, no i18n, no CMS. To add an entry, append an object with `id`, `category`,
`question`, `answer`.

Things that will bite you:

- **The renderer only parses `**bold**` and `` `code` ``** (`renderText`, same file).
  There is **no link support**. Single asterisks render as literal asterisks. Cross-
  reference other entries by naming them in bold, not by linking.
- `\n\n` is a paragraph break, `\n` a line break, bullets are a literal `"• "` prefix.
- `id` is the DOM id and the `/faq#<id>` deep-link anchor (the answer panel is
  `<id>-answer`). Nothing validates ids, so a duplicate or typo fails silently. Add a
  deep-link test for any new entry.
- Closed answers stay in the DOM with the `hidden` attribute so the prerendered page
  carries every answer, and `faqData` also feeds the FAQPage JSON-LD. Keep both.
- Categories are derived from the `category` strings via `new Set(...)`. A typo silently
  creates a new filter pill. Reuse an existing string verbatim.
- Entries render in array order. There is no sort and no grouping by category.

## YouTube Shorts section

`src/components/Shorts.tsx` renders the "Learn UnleakTrade in 60 seconds" carousel on the
home page. The list is static, deliberately: it is the `shortsData` array in
`src/components/utils/shorts.ts`. To add a Short, append `{ id, title, published }` with the
id from `youtube.com/shorts/<id>`; the poster image is fetched from YouTube by id.

- The intro Short is pinned first via `PINNED_SHORT_ID`; the other three slots are the most
  recent entries by `published`, whatever their order in the array.
- A ` | ` in a title splits it into a headline and a series badge (`VS The Market #3`).
- Phones play inline in the card; from the `lg` breakpoint the card opens a lightbox.

## Git

- Branch off `main`; do not commit directly to it.
- Commits are GPG-signed (`commit.gpgsign=true`).
- Use the GitHub issue or tracker ticket title as the commit subject when one exists
  (e.g. `[UNLK-35] Surface uUSDC airdrop status, signup copy, FAQ anchors`). Otherwise
  write a descriptive subject, optionally with a `docs(faq):`-style prefix.
- **Never add a `Co-Authored-By: Claude` trailer.**

## Figma

When updating the Figma design, duplicate the page into a new versioned page rather than
editing the existing one in place.
