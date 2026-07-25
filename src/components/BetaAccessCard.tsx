import { Rocket } from "lucide-react";
import { BETA_APP_URL, DISCORD_URL } from "./utils/links";

// Compact banner for pre-submit views: tells visitors the beta is already
// live and testable before they fill the Request Access form.
export function BetaLiveCallout() {
  return (
    <div className="p-3 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 border border-purple-500/20 rounded-lg text-left">
      <div className="flex items-center gap-2 text-sm text-cyan-400 mb-1">
        <Rocket className="w-4 h-4" />
        <span>Beta live on Solana Devnet</span>
      </div>
      <p className="text-white/60 text-xs leading-relaxed">
        UnleakTrade is already up and running. You can explore the app and
        test the experience today — no real funds or tokens involved.
        Request access to get started.
      </p>
    </div>
  );
}

export function BetaAccessCard() {
  return (
    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 border border-purple-500/20 rounded-lg space-y-3 text-left">
      <h3 className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        You're early. Start exploring UnleakTrade.
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        UnleakTrade is currently live in beta on{" "}
        <span className="text-white/80">Solana Devnet</span>. You can already
        explore the app, test the experience, and see how it works — no real
        funds or tokens are involved.
      </p>
      <a
        href={BETA_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity h-11"
      >
        <Rocket className="w-4 h-4" />
        Launch the Beta
      </a>
      <p className="text-white/50 text-xs leading-relaxed">
        Found something we could improve? Have an idea for a feature? We'd love
        to hear from you on{" "}
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:opacity-90 transition-opacity"
        >
          Discord
        </a>
        .
      </p>
    </div>
  );
}
