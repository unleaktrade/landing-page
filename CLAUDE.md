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
- `id` is the DOM id and the `/faq#<id>` deep-link anchor. Nothing validates ids, so a
  duplicate or typo fails silently. Add a deep-link test for any new entry.
- Categories are derived from the `category` strings via `new Set(...)`. A typo silently
  creates a new filter pill. Reuse an existing string verbatim.
- Entries render in array order. There is no sort and no grouping by category.

## YouTube Shorts section

`src/components/Shorts.tsx` renders the "Learn UnleakTrade in 60 seconds" carousel on the
home page. The video list is **not** hand-maintained: `scripts/fetch-shorts.mjs` reads the
channel's public Atom feed, keeps only Shorts, and writes `src/data/shorts.json`. It runs as
`prebuild` (so every CI, Pages and Vercel build refreshes it) and the Pages deploy also runs
on a daily cron. Refresh locally with `npm run shorts:sync` and commit the JSON.

- The intro Short is pinned first via `PINNED_SHORT_ID` in `src/components/utils/shorts.ts`;
  the other three slots are the most recent uploads.
- The sync script never fails a build: on any error it keeps the committed JSON and warns.
- Titles are copied from YouTube, with U+2012 to U+2015 flattened to `-` so the dash check
  above stays green. Do not hand-edit `shorts.json`; fix the title on YouTube and re-sync.

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
