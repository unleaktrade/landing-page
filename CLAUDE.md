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

## Writing style

**Never use em dashes (`—`) or en dashes (`–`) in site copy.** Not in FAQ answers, not in
roadmap text, not in headings, not anywhere a visitor can read. Use a comma, a colon, a
semicolon, parentheses, or just split the sentence. Pick whichever actually fits the
clause rather than swapping in a hyphen everywhere.

```
bad:   The escrow is the verifier — every trade self-verifies.
good:  The escrow is the verifier: every trade self-verifies.

bad:   ...bootstrap a real market — makers and takers with volume — on proven security.
good:  ...bootstrap a real market (makers and takers with volume) on proven security.

bad:   No — we work on different layers.
good:  No. We work on different layers.
```

Check before committing copy changes:

```bash
grep -rn "—\|–" src/
```

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
