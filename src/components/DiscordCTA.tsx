import { motion } from "motion/react";

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
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                Join the Discord
              </a>
              <a
                href="#learn"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors text-lg"
              >
                Learn more
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
