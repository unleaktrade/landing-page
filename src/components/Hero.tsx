import { motion } from "motion/react";
import logoImage from "figma:asset/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      {/* Subtle gradient orbs - positioned lower to avoid logo overlap */}
      <div className="absolute top-[400px] left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute top-[450px] right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          {/* Logo and tagline */}
          <div className="space-y-6">
            <img src={logoImage} alt="UmbraTrade" className="h-32 w-32 mx-auto" />
            <h1 className="text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto leading-tight">
              Confidential trading.<br />
              Institutional-grade fairness.<br />
              <span className="text-white/60">Now for you.</span>
            </h1>
          </div>

          {/* Main value prop */}
          <div className="space-y-6 pt-8">
            <h2 className="text-2xl lg:text-3xl tracking-tight max-w-3xl mx-auto">
              Make crypto OTC private, fair, and trustless using Zero-Knowledge Proofs on Solana
            </h2>
            
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
              Despite exceeding $2T in volume, the crypto OTC market still relies on informal, off-chain, trust-based deals. 
              UmbraTrade transforms this landscape with Zero-Knowledge technology and Solana's high-performance network, 
              bringing confidentiality, fairness, and automation to OTC trading.
            </p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <a
              href="https://discord.gg/umbratrade"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Join the Discord
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
