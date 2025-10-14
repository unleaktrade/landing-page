import { motion } from "motion/react";
import solanaLogo from "figma:asset/af0a6579392a99988c0ab693570446ed86a64fec.png";

export function DiscordCTA() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-12 lg:p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-400/5 overflow-hidden"
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl tracking-tight">
                Join the future of OTC trading
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
                Connect with institutional traders, market makers, and crypto funds building the next generation of private markets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discord.com/invite/24mZUAqj4z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity text-lg h-[58px]"
              >
                Join the Discord
              </a>
              <a
                href="#faq"
                className="relative inline-flex flex-col items-center justify-center px-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 hover:border-white/20 transition-all group overflow-hidden h-[58px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                  Waitlist
                </span>
                <span className="relative text-[9px] text-white/30 tracking-wide leading-tight">
                  COMING SOON
                </span>
              </a>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-white/40">
              <div className="text-center">
                <div className="text-2xl text-white mb-1">$2T+</div>
                <div>Annual OTC volume</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl text-white mb-1">100%</div>
                <div>Privacy guaranteed</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl text-white mb-1">0</div>
                <div>Counterparty risk</div>
              </div>
            </div>

            {/* Built on Solana */}
            <div className="pt-12 mt-12 border-t border-white/10">
              <div className="flex flex-col items-center gap-4">
                <span className="text-white/40 text-sm tracking-wide uppercase">Built on</span>
                <a 
                  href="https://solana.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-all hover:opacity-80"
                >
                  <img 
                    src={solanaLogo} 
                    alt="Solana" 
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
