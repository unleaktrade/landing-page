import { motion } from "motion/react";
import { DollarSign, Shield, Clock } from "lucide-react";

export function Economics() {
  return (
    <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-white/40 mb-4">Accessible to all serious traders</p>
          <h2 className="text-white mb-6">
            Skin in the game ensures fair execution
          </h2>
          <p className="text-white/60 max-w-3xl mx-auto leading-relaxed">
            Our bond-based system aligns incentives and protects all participants. Whether you're a wealthy individual or a whale, defaulters lose their bonds—creating natural enforcement without intermediaries.
          </p>
        </motion.div>

        {/* Detailed breakdown grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Minimum trade size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
          >
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white mb-2">Minimum trade size</h3>
                <div className="text-white/90 mb-1">≥ $10,000 notional</div>
                <p className="text-white/40 text-sm">
                  Accessible to serious crypto traders with meaningful volume
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-white mb-2">Trading fee</h3>
                <div className="space-y-1 text-sm mb-2">
                  <div className="text-white/90">5 bps (0.05%)</div>
                  <div className="text-white/60">Min $5 • Taker pays</div>
                </div>
                <p className="text-white/40 text-sm">
                  Fee paid on top of notional. Maker receives net amount.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bonds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
          >
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white mb-2">Bonds (both sides)</h3>
                <div className="space-y-1 text-sm mb-2">
                  <div className="text-white/60">$10k – &lt;$500k → 100 bps</div>
                  <div className="text-white/60">$500k – &lt;$5M → 50 bps</div>
                  <div className="text-white/60">$5M+ → 25 bps</div>
                </div>
                <p className="text-white/40 text-sm">
                  Deposited in USDC. Returned after successful settlement.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Timers & slashing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-white mb-2">Timers & slashing</h3>
                <div className="space-y-1 text-sm mb-2">
                  <div className="text-white/60">Quote validity: flexible</div>
                  <div className="text-white/60">Settlement: flexible</div>
                  <div className="text-white/90">Default → bond slashed</div>
                </div>
                <p className="text-white/40 text-sm">
                  Defaults: 15 min quote / 60 min settlement<br/>
                  80% to counterparty / 20% to protocol
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Examples */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Example 1: $20k */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 rounded-2xl p-8"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-white mb-1">Example: $20k trade</h4>
                <p className="text-white/40 text-sm">Entry-level trade</p>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/40">Bond per side:</span>
                  <div className="text-white/90 mt-1">$200 (100 bps)</div>
                  <div className="text-white/50 text-xs mt-0.5">$10k–&lt;$500k tier</div>
                </div>
                <div>
                  <span className="text-white/40">Taker fee:</span>
                  <div className="text-white/90 mt-1">$10 (5 bps)</div>
                  <div className="text-white/50 text-xs mt-0.5">0.05% of notional</div>
                </div>
                <div>
                  <span className="text-white/40">If party defaults:</span>
                  <div className="text-white/90 mt-1">$160 to counterparty</div>
                  <div className="text-white/90 mt-0.5">$40 to protocol</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Example 2: $5M */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 rounded-2xl p-8"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-white mb-1">Example: $5M trade</h4>
                <p className="text-white/40 text-sm">Large trade</p>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/40">Bond per side:</span>
                  <div className="text-white/90 mt-1">$12,500 (25 bps)</div>
                  <div className="text-white/50 text-xs mt-0.5">≥$5M tier</div>
                </div>
                <div>
                  <span className="text-white/40">Taker fee:</span>
                  <div className="text-white/90 mt-1">$2,500 (5 bps)</div>
                  <div className="text-white/50 text-xs mt-0.5">0.05% of notional</div>
                </div>
                <div>
                  <span className="text-white/40">If party defaults:</span>
                  <div className="text-white/90 mt-1">$10k to counterparty</div>
                  <div className="text-white/90 mt-0.5">$2.5k to protocol</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
