import { Rocket } from "lucide-react";
import logoImage from "../assets/logo-256.webp";

interface HeroProps {
  onOpenWaitlist?: () => void;
}

export function Hero({ onOpenWaitlist }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      {/* Subtle gradient orbs - positioned lower to avoid logo overlap */}
      <div className="absolute top-[400px] left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute top-[450px] right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-5xl mx-auto">
        {/* The entrance is CSS (index.css), not motion: the hero is the LCP
            element, and a JS-driven fade kept the prerendered headline at
            opacity 0 until the bundle had downloaded and run. */}
        <div className="hero-enter text-center space-y-12">
          {/* Logo and tagline */}
          <div className="space-y-6">
            <img src={logoImage} alt="UnleakTrade" width={128} height={128} fetchPriority="high" className="h-32 w-32 mx-auto" />
            <h1 className="text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto leading-tight">
              Guaranteed Settlement.<br />
              Confidential OTC Trading & Auctions.<br />
              Competitive Price Discovery.<br />
              <span className="text-white/60">Now on Solana.</span>
            </h1>
          </div>

          {/* Main value prop */}
          <div className="space-y-6 pt-8">
            <h2 className="text-2xl lg:text-3xl tracking-tight max-w-3xl mx-auto">
              Trade any SPL token (listed or unlisted) through private over-the-counter auctions with ZK-verified liquidity and trustless settlement
            </h2>
            
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
              Despite exceeding $2T in volume, the crypto OTC market still relies on informal, off-chain, trust-based deals. 
              UnleakTrade transforms this landscape with Zero-Knowledge technology and Solana's high-performance network, 
              bringing confidentiality, fairness, and automation to OTC trading.
            </p>
          </div>

          {/* CTA */}
          <div className="hero-enter-cta space-y-4">
            <button
              onClick={onOpenWaitlist}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Rocket className="w-4 h-4" />
              Request Access
            </button>
            <p className="text-white/40 text-sm">
              Live in beta on Solana Devnet, no real funds or tokens involved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
