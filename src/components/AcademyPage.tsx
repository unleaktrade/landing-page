import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, ChartCandlestick, ChartLine, Download, Music2, Shapes, ShoppingCart, TriangleAlert, Trophy } from "lucide-react";
import { Youtube } from "./BrandIcons";
import { TIKTOK_URL, WICKMASTERS_CHECKOUT_URL, WICKMASTERS_DEMO_URL, YOUTUBE_URL } from "./utils/links";

// Wick Masters is neutral education content: no call to use the UnleakTrade
// app inside this page's Wick Masters blocks, no promise of gains, no
// performance figures (issue #49).
//
// Text that sits directly over the WarpField carries `academy-scrim` (dark
// backing) and `academy-legible` (text shadow), the same legibility rules as
// the home page Shorts header. Everything else sits on a glass-card.

// `demo: true` marks the parts that come with the free demo download.
// Descriptions stay factual about what each part teaches: no promise of gains.
const levels: { label: string; icon: LucideIcon; topic: string; description: string; demo?: boolean }[] = [
  {
    label: "Start Here",
    icon: BookOpen,
    topic: "How the guide works",
    description:
      "How Wick Masters is organised, how each level is laid out and how to use the cheat sheets. Read it first: it sets up the vocabulary the rest of the guide builds on.",
    demo: true,
  },
  {
    label: "Level 0",
    icon: ChartCandlestick,
    topic: "Candlestick basics",
    description:
      "What a single candle tells you: the open, close, high and low of a period, the body and the wicks, and why the colour alone says very little. By the end you can read any candle on any chart.",
    demo: true,
  },
  {
    label: "Level 1",
    icon: Shapes,
    topic: "The seven single-candle patterns",
    description:
      "The seven one-candle shapes beginners meet first, what each one suggests about the balance between buyers and sellers, and why none of them is a signal on its own.",
    demo: true,
  },
  {
    label: "Levels 2 to 10",
    icon: ChartLine,
    topic: "Chart patterns, supply and demand, volume, timeframes, setups and risk",
    description:
      "One topic per level, each building on the one before: patterns made of several candles, the zones where price tends to react, what volume adds, reading more than one timeframe, putting a setup together and sizing risk before anything else.",
  },
  {
    label: "Boss Level",
    icon: Trophy,
    topic: "Putting it all together",
    description:
      "A full chart read from scratch, step by step, using every skill from the earlier levels. It is practice in reading a chart, not a trading strategy.",
  },
];

export const RISK_NOTICE =
  "Educational only. Not financial advice. Crypto-assets are volatile and you can lose all the money you put in. Wick Masters does not recommend any asset, exchange or trading venue.";

function SectionHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="academy-scrim text-center space-y-4 mb-12">
      <h2 className="academy-legible text-3xl lg:text-4xl tracking-tight">{title}</h2>
      {intro && (
        <p className="academy-legible text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">{intro}</p>
      )}
    </div>
  );
}

export function AcademyPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto">
          {/* CSS entrance, not motion: it plays from the prerendered HTML. */}
          <div className="enter-up academy-scrim text-center space-y-6">
            <p className="academy-legible text-white/70">Free trading education</p>
            {/* No text shadow on the gradient word: with transparent text the
                shadow shows through and darkens it. */}
            <h1 className="text-4xl lg:text-5xl tracking-tight leading-tight">
              <span className="academy-legible text-white">UnleakTrade</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Academy</span>
            </h1>
            <p className="academy-legible text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
              Learn to read crypto charts, one pattern at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Wick Masters */}
      <section className="relative pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative glass-card border border-white/10 rounded-3xl p-6 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="academy-card relative">
              {/* Cover placeholder until the guide cover PNG is uploaded. */}
              <div className="academy-cover" aria-hidden="true">
                <span className="text-white/80 text-xs tracking-wide">THE ARCADE GUIDE</span>
                <span className="academy-cover-title bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  WICK MASTERS
                </span>
                <span className="text-white/70 text-xs tracking-wide">LEVELS 0 TO 10 + BOSS</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/70 mb-3">UnleakTrade Academy presents</p>
                <h2 className="text-white text-3xl lg:text-4xl tracking-tight mb-4">Wick Masters</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  The arcade guide to reading crypto charts. 11 levels and a Boss Level: candles, chart patterns,
                  supply and demand, volume, timeframes, setups and risk.
                </p>

                {/* The paid guide is the primary action: brand gradient, glow and
                    first in reading order. The free demo is the secondary,
                    outlined action next to it. */}
                <div className="academy-cta mt-8">
                  {/* Same tab: checkout, then back to /academy/thanks.
                      No price here: it lives on the checkout only. */}
                  <a
                    href={WICKMASTERS_CHECKOUT_URL}
                    className="academy-buy text-white rounded-lg"
                  >
                    <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                    <span>Get the full guide + 10 cheat sheets</span>
                    <ArrowRight className="academy-buy-arrow w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  </a>

                  {/* Cross-origin PDF: a plain anchor in a new tab. The CDN sends
                      Content-Disposition: attachment, so no `download` attribute
                      (browsers ignore it cross-origin anyway). */}
                  <a
                    href={WICKMASTERS_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="academy-demo rounded-lg border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span>Download the free demo</span>
                  </a>
                </div>
                <p className="text-white/70 text-sm mt-4">
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Full guide:</span>{" "}
                  all 11 levels, the Boss Level and 10 cheat sheets. One-time purchase through Stripe, download
                  links by email a minute later.
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Not sure yet? The free demo covers the first levels and the first cheat sheet. No email, no form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside: the home page "Built for serious traders" step cards,
          with the ValueProps icon tile. Hierarchy per card: Free demo badge,
          then the level as an eyebrow, then the title, then the paragraph.
          No hover state, so nothing reads as clickable. */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="What's inside the guide"
            intro="The levels in reading order and what each one teaches. The first three come with the free demo."
          />
          <ol className="space-y-6">
            {levels.map((level, i) => (
              <li key={level.label} className="flex flex-col sm:flex-row items-start gap-6 p-8 rounded-2xl border border-white/10 glass-card">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-400/20 flex items-center justify-center">
                  <level.icon className={`w-6 h-6 ${i % 2 ? "text-cyan-400" : "text-purple-400"}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  {level.demo && (
                    <span className="inline-flex items-center px-3 py-1 mb-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 text-xs">
                      <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Free demo</span>
                    </span>
                  )}
                  <p className={`text-sm uppercase tracking-wide mb-2 ${i % 2 ? "text-cyan-400" : "text-purple-400"}`}>{level.label}</p>
                  <h3 className="text-xl mb-3 tracking-tight">{level.topic}</h3>
                  <p className="text-white/70 leading-relaxed">{level.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Watch the shorts */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Watch the shorts"
            intro="New Wick Masters shorts every Monday, Wednesday and Friday."
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 glass-card text-purple-300 hover:border-white/20 transition-colors"
            >
              <Music2 className="w-5 h-5" />
              TikTok
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 glass-card text-purple-300 hover:border-white/20 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Risk notice: required on the page, not only in the footer. */}
      <section className="relative py-20 px-6 lg:px-8 pb-32">
        <div className="max-w-3xl mx-auto">
          <aside aria-label="Risk notice" className="glass-card border border-white/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-400/20 flex items-center justify-center">
                <TriangleAlert className="w-6 h-6 text-purple-400" aria-hidden="true" />
              </div>
              <h2 className="text-2xl tracking-tight">Risk notice</h2>
            </div>
            <p className="text-white/80 leading-relaxed">{RISK_NOTICE}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
