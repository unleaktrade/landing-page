import { ExternalLink, Rocket } from "lucide-react";
import { BETA_APP_URL, DISCORD_URL } from "./utils/links";

// Small hint rendered under the wallet address input in signup forms:
// explains why we ask for the wallet and what it will receive.
export function WalletFieldHint() {
  return (
    <p className="text-white/40 text-xs leading-relaxed">
      Connect the Solana wallet you plan to use for the UnleakTrade beta.
      After your waitlist spot is verified, we'll send this wallet custom
      devnet USDC required to test the app. This is a test token with no
      real-world monetary value. Use this same wallet in the beta.
    </p>
  );
}

// Compact banner for pre-submit views: the beta is live and the registered
// wallet receives the devnet USDC test token after activation.
export function BetaLiveCallout() {
  return (
    <div className="p-3 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 border border-purple-500/20 rounded-lg text-left">
      <div className="flex items-center gap-2 text-sm text-cyan-400 mb-1">
        <Rocket className="w-4 h-4" />
        <span>Beta live on Solana Devnet</span>
      </div>
      <p className="text-white/60 text-xs leading-relaxed mb-2">
        UnleakTrade is already up and running on Solana Devnet. Your wallet
        identifies you as a beta participant: once your waitlist spot is
        activated, we airdrop it 1,000 custom devnet USDC — the test token
        required to try the beta flows. Devnet-only, no real-world value.
      </p>
      <a
        href={BETA_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:opacity-90 transition-opacity"
      >
        Launch the Beta
        <ExternalLink className="w-3 h-3" />
      </a>
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
        funds or tokens are involved. After you activate your spot, the wallet
        you registered receives 1,000 custom devnet USDC — you'll need it (and
        that same wallet) to test the beta.
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
