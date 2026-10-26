import { Link } from "react-router";
import { ArrowUpRight, Download, Lock } from "lucide-react";
import { TIKTOK_URL, WICKMASTERS_DEMO_URL, YOUTUBE_URL } from "./utils/links";

// Wick Masters is neutral education content: no call to use the UnleakTrade
// app inside this page's Wick Masters blocks, no promise of gains, no
// performance figures (issue #49).

const levels = [
  { label: "Start Here", topic: "How the guide works" },
  { label: "Level 0", topic: "Candlestick basics" },
  { label: "Level 1", topic: "The seven single-candle patterns" },
  { label: "Levels 2 to 10", topic: "Chart patterns, supply and demand, volume, timeframes, setups and risk" },
  { label: "Boss Level", topic: "Putting it all together" },
];

export const RISK_NOTICE =
  "Educational only. Not financial advice. Crypto-assets are volatile and you can lose all the money you put in. Wick Masters does not recommend any asset, exchange or trading venue.";

export function AcademyPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.06] via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* CSS entrance, not motion: it plays from the prerendered HTML. */}
          <div className="enter-up">
            <p className="text-white/40 mb-4">Free trading education</p>
            <h1 className="mb-6">
              <span className="text-white">UnleakTrade</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Academy</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Learn to read crypto charts, one pattern at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Wick Masters */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row gap-8">
              {/* Cover placeholder until the guide cover PNG is uploaded. */}
              <div className="academy-cover" aria-hidden="true">
                <span className="text-white/60 text-xs tracking-wide">THE ARCADE GUIDE</span>
                <span className="academy-cover-title bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  WICK MASTERS
                </span>
                <span className="text-white/40 text-xs tracking-wide">LEVELS 0 TO 10 + BOSS</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/40 mb-3">UnleakTrade Academy presents</p>
                <h2 className="text-white mb-4">Wick Masters</h2>
                <p className="text-white/60 leading-relaxed">
                  The arcade guide to reading crypto charts. 11 levels and a Boss Level: candles, chart patterns,
                  supply and demand, volume, timeframes, setups and risk.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link
                    to={WICKMASTERS_DEMO_URL}
                    className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Download the free demo
                    </span>
                  </Link>

                  <button
                    type="button"
                    disabled
                    className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/60 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Full guide + 10 cheat sheets, 25 EUR</span>{" "}
                    <span className="px-2 py-1 rounded-full border border-white/20 text-white/60 text-xs tracking-wide">
                      Coming soon
                    </span>
                  </button>
                </div>
                <p className="text-white/40 text-sm mt-4">
                  The demo: Start Here, Level 0, Level 1 and the first cheat sheet. No email, no form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white mb-6">What's inside</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {levels.map((level, i) => (
              <li key={level.label} className="glass-card border border-white/10 rounded-xl p-6">
                <p className={`text-sm mb-1 ${i % 2 ? "text-cyan-400" : "text-purple-400"}`}>{level.label}</p>
                <p className="text-white/80">{level.topic}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Watch the shorts */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white mb-4">Watch the shorts</h2>
          <p className="text-white/60 leading-relaxed">
            New Wick Masters shorts every Monday, Wednesday and Friday on{" "}
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
            >
              TikTok
              <ArrowUpRight className="w-3 h-3" />
            </a>{" "}
            and{" "}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-400 inline-flex items-center gap-1 transition-colors"
            >
              YouTube
              <ArrowUpRight className="w-3 h-3" />
            </a>
            .
          </p>
        </div>
      </section>

      {/* Risk notice: required on the page, not only in the footer. */}
      <section className="relative py-12 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <aside aria-label="Risk notice" className="glass-card border border-white/20 rounded-xl p-6">
            <p className="text-white/90 text-sm mb-2">Risk notice</p>
            <p className="text-white/60 text-sm leading-relaxed">{RISK_NOTICE}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
