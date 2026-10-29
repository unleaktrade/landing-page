import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

// Home page pointer to the Academy: under the hero CTA and in the closing
// CommunityCTA. Same rules as the Academy page's Wick Masters blocks (issue
// #49): neutral education, no promise of gains, no price.
export function AcademyPromo() {
  return (
    <Link
      to="/academy"
      className="academy-promo glass-card border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
    >
      <span className="academy-promo-cover" aria-hidden="true">
        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          WICK
          <br />
          MASTERS
        </span>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-white/70 text-sm">UnleakTrade Academy</span>
        <span className="block text-white">Wick Masters</span>
        <span className="block text-white/70 text-sm">Learn to read crypto charts. Free demo.</span>
      </span>
      <ArrowRight className="academy-promo-arrow w-4 h-4 flex-shrink-0 text-white/70" aria-hidden="true" />
    </Link>
  );
}
