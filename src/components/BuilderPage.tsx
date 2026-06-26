import { motion } from "motion/react";
import { Linkedin, Twitter, Github, ArrowUpRight, Send } from "lucide-react";
import julienImage from "../assets/524423e86081819620c9996fd40046b079ec4ba8.png";

const julienData = {
  name: "Julien SIE",
  role: "CTO / Founder",
  location: "France",
  tagline: "Engineering trust at scale.",
  summary: "Visionary tech entrepreneur with deep expertise in blockchain and token engineering, leading high-performing teams to design scalable architectures and transform complex systems into secure, value-driven solutions.",
  biography: "As Founder and CTO of UnleakTrade, Julien drives the strategic and technical vision behind a next-generation crypto trading platform that blends transparency, scalability, and intelligent automation. His leadership focuses on building a secure, high-performance ecosystem for digital asset trading, leveraging cutting-edge blockchain, AI, and token engineering principles. With deep expertise in decentralized finance, scalable architectures, and smart contract design, he oversees the full lifecycle of product innovation — from infrastructure and data systems to user experience and market strategy. His work ensures reliability, efficiency, and long-term value creation across all aspects of the platform. His pragmatic, innovation-driven approach continues to propel UnleakTrade's mission to redefine the future of crypto trading through engineering excellence and strategic vision.",
  expertise: ["Blockchain", "TokenEngineering", "DevOps", "DeFi", "ScalableArchitecture", "SmartContracts", "Fundraising", "Investment", "Leadership", "ProductStrategy"],
  handle: "@_whyvrafvr",
  links: {
    linkedin: "https://www.linkedin.com/in/julien-sie-jsie/",
    twitter: "https://x.com/_whyvrafvr",
    github: "https://github.com/whyvrafvr",
    telegram: "https://t.me/whyvrafvr"
  },
  image: julienImage
};

export function BuilderPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Hero section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/40 mb-4">Meet the founder</p>
            <h1 className="text-white mb-6">Building the future of private OTC trading.</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              UnleakTrade is an independent project combining deep protocol expertise with strategic vision to bring institutional-grade privacy to crypto markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About the Project section */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            
            <div className="relative space-y-8">
              {/* Section header */}
              <div>
                <p className="text-white/40 mb-3">About the project</p>
                <h2 className="text-white mb-4">Why UnleakTrade exists</h2>
              </div>

              {/* The Problem */}
              <div className="space-y-4">
                <h3 className="text-white/90">The OTC market is broken</h3>
                <p className="text-white/60 leading-relaxed">
                  Despite exceeding <span className="text-white">$2 trillion in annual volume</span>, the crypto OTC market still relies on informal, off-chain, trust-based deals. 
                  Large trades leak information to the market, causing adverse price movements. Institutional players and whales are forced to choose between public DEXs with high slippage or 
                  opaque OTC desks that require blind trust in counterparties and intermediaries.
                </p>
                <p className="text-white/60 leading-relaxed">
                  The cost isn't just the fee — it's the leaked intent, front-running, and being gamed by market makers who see your size before execution. 
                  For serious participants, this is unacceptable.
                </p>
              </div>

              {/* The Vision */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-white/90">A new primitive for private markets</h3>
                <p className="text-white/60 leading-relaxed">
                  UnleakTrade transforms this landscape by encoding the entire <span className="text-white">RFQ (Request For Quote)</span> lifecycle into a verifiable on-chain state machine. 
                  Using <span className="text-white">Zero-Knowledge proofs</span> and <span className="text-white">Solana's high-performance network</span>, we enable private, fair, 
                  and trustless OTC auctions where confidentiality meets competitive price discovery.
                </p>
                <p className="text-white/60 leading-relaxed">
                  No information leakage. No custody risk. No trusted intermediaries. Just cryptographic guarantees, economic bonds, and atomic settlement — 
                  bringing institutional-grade privacy and fairness to everyone.
                </p>
              </div>

              {/* What's Being Built */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-white/90">What we're building</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="text-purple-400 flex-shrink-0 leading-relaxed">•</span>
                    <p className="text-white/60 leading-relaxed">
                      <span className="text-white">Private auction infrastructure</span> — A commit/reveal auction system that prevents bid copying and information leakage during price discovery
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400 flex-shrink-0 leading-relaxed">•</span>
                    <p className="text-white/60 leading-relaxed">
                      <span className="text-white">ZK-verified liquidity</span> — Participants prove solvency without revealing wallet balances or trading strategies
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-purple-400 flex-shrink-0 leading-relaxed">•</span>
                    <p className="text-white/60 leading-relaxed">
                      <span className="text-white">Trustless settlement engine</span> — Bonding mechanisms and automatic slashing make griefing expensive and force timely completion
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400 flex-shrink-0 leading-relaxed">•</span>
                    <p className="text-white/60 leading-relaxed">
                      <span className="text-white">Universal asset support</span> — Trade any SPL token (listed or unlisted), with future support for NFTs, derivatives, and real-world assets
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Now */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-white/90">Why now, why Solana</h3>
                <p className="text-white/60 leading-relaxed">
                  Solana has emerged as the clear leader in on-chain liquidity, real-world adoption, and institutional traction. With consistent leadership in daily transactions, 
                  integrations with major partners (Visa, Circle, Western Union), and pioneering <span className="text-white">native ZK compression technology</span>, 
                  it's the only blockchain that can deliver the performance, privacy primitives, and capital flows needed for serious OTC markets.
                </p>
                <p className="text-white/60 leading-relaxed">
                  UnleakTrade isn't just another DEX — it's a new market primitive. From zero-knowledge proofs to programmable composability, 
                  we're building Solana's invisible backbone for private, institutional-grade trading.
                </p>
              </div>

              {/* Journey */}
              <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 rounded-xl p-6 mt-6">
                <p className="text-white/70 leading-relaxed italic">
                  "This is a solo journey driven by conviction: that crypto markets deserve the same privacy guarantees that institutions take for granted, 
                  and that Zero-Knowledge technology can finally make this a reality. UnleakTrade started as a technical challenge and evolved into a mission — 
                  to eliminate information asymmetry and bring fairness to OTC trading through cryptographic guarantees."
                </p>
                <p className="text-white/50 text-sm mt-4">— Julien SIE, Founder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Builder profile */}
      <section className="relative py-12 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            {/* Card */}
            <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 hover:border-white/20 transition-all duration-500">
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 mx-auto md:mx-0">
                      {/* Gradient border */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-purple-400 to-cyan-400 opacity-80" />
                      {/* Avatar */}
                      <div className="relative m-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center overflow-hidden">
                        <img src={julienData.image} alt={julienData.name} className="w-full h-full object-cover grayscale" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                        <h2 className="text-white">{julienData.name}</h2>
                        <div className="flex items-center gap-3">
                          <span className="text-white/40 text-sm">{julienData.location}</span>
                        </div>
                      </div>
                      <p className="text-white/50 mb-2">{julienData.role}</p>
                      <a 
                        href={julienData.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1 transition-colors"
                      >
                        {julienData.handle}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Tagline */}
                    <p className="text-white/90 italic mb-4 text-lg">"{julienData.tagline}"</p>

                    {/* Summary */}
                    <p className="text-white/70 mb-6 leading-relaxed">{julienData.summary}</p>

                    {/* Biography */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <p className="text-white/40 text-sm mb-3">Background</p>
                      <p className="text-white/60 leading-relaxed">{julienData.biography}</p>
                    </div>

                    {/* Expertise tags */}
                    <div className="mb-6">
                      <p className="text-white/40 text-sm mb-3">Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {julienData.expertise.map((tag, i) => (
                          <span 
                            key={i} 
                            className="relative group/tag px-3 py-1.5 text-sm rounded-full bg-white/[0.03] border border-white/10 text-white/70 hover:text-white/90 transition-colors"
                          >
                            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                            <span className="relative">#{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                      <span className="text-white/30 text-sm">Connect</span>
                      <div className="flex items-center gap-3">
                        <a
                          href={julienData.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white/80 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                          href={julienData.links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white/80 transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a
                          href={julienData.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white/80 transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                        <a
                          href={julienData.links.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white/80 transition-colors"
                          aria-label="Telegram"
                        >
                          <Send className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-12 text-center overflow-hidden mt-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="relative">
              <p className="text-white/40 mb-3">Get involved</p>
              <h2 className="text-white mb-4">Want to contribute or collaborate?</h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                Whether you're interested in contributing to the protocol, partnering, or just want to learn more — feel free to reach out.
              </p>
              <a
                href="https://discord.gg/h9Qb9S7Qjx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Join Discord
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
