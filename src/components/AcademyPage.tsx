import { Link } from "react-router";
import { Download, Lock, Music2 } from "lucide-react";
import { Youtube } from "./BrandIcons";
import { TIKTOK_URL, WICKMASTERS_DEMO_URL, YOUTUBE_URL } from "./utils/links";

// Wick Masters is neutral education content: no call to use the UnleakTrade
// app inside this page's Wick Masters blocks, no promise of gains, no
// performance figures (issue #49).
//
// Text that sits directly over the WarpField carries `academy-scrim` (dark
// backing) and `academy-legible` (text shadow), the same legibility rules as
// the home page Shorts header. Everything else sits on a glass-card.

const levels = [
  { label: "Start Here", topic: "How the guide works" },
  { label: "Level 0", topic: "Candlestick basics" },
  { label: "Level 1", topic: "The seven single-candle patterns" },
  { label: "Levels 2 to 10", topic: "Chart patterns, supply and demand, volume, timeframes, setups and risk" },
  { label: "Boss Level", topic: "Putting it all together" },
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
          <div className="relative glass-card border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
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

                {/* What's inside: a plain reading list, deliberately not boxed
                    rows, so nothing in it looks tappable. */}
                <h3 className="text-white/70 text-sm tracking-wide mt-8 mb-3">What's inside</h3>
                <ol className="academy-levels">
                  {levels.map((level, i) => (
                    <li key={level.label} className="academy-level">
                      <span className={i % 2 ? "text-cyan-400" : "text-purple-400"}>{level.label}</span>
                      <span className="text-white/90">{level.topic}</span>
                    </li>
                  ))}
                </ol>

                <div className="academy-cta mt-8">
                  <Link
                    to={WICKMASTERS_DEMO_URL}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download the free demo</span>
                  </Link>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg border border-white/20 bg-white/5 text-white/70 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Full guide + 10 cheat sheets, 25 EUR</span>{" "}
                    <span className="px-2 py-1 rounded-full border border-white/20 text-white/80 text-xs tracking-wide">
                      Coming soon
                    </span>
                  </button>
                </div>
                <p className="text-white/60 text-sm mt-4">
                  The demo: Start Here, Level 0, Level 1 and the first cheat sheet. No email, no form.
                </p>
              </div>
            </div>
          </div>
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
          <aside aria-label="Risk notice" className="glass-card border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-white mb-3">Risk notice</p>
            <p className="text-white/80 leading-relaxed">{RISK_NOTICE}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
