import { motion } from "motion/react";
import { Shield, Eye, EyeOff, CheckCircle, Lock } from "lucide-react";

export function SettlementProcess() {
  return (
    <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-white/40 mb-4">Bringing trust and privacy back to block trades</p>
          <h2 className="text-white mb-6">
            Powered by Zero-Knowledge Proofs
          </h2>
          <p className="text-white/60 max-w-3xl mx-auto leading-relaxed">
            UmbraTrade is a <span className="text-purple-400">zk-powered OTC/RFQ platform</span> built on <span className="text-cyan-400">Solana</span>. 
            Our commit–reveal mechanism with Zero-Knowledge proofs ensures confidentiality for takers while providing verified, fair RFQs to makers.
          </p>
        </motion.div>

        {/* Key benefits grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Transparent for makers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-white">Transparent for makers</h3>
                </div>
                <p className="text-white/60 leading-relaxed mb-4">
                  Makers receive verified, fair RFQs with confidence. All committed quotes are validated through zero-knowledge proofs before the reveal phase.
                </p>
                <div className="flex items-start gap-2 text-white/50 text-sm">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Verified liquidity & quote validity upfront</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Confidential for takers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white">Confidential for takers</h3>
                </div>
                <p className="text-white/60 leading-relaxed mb-4">
                  Takers prove liquidity & quote validity without revealing information upfront. Your trading intentions remain private until you choose to reveal.
                </p>
                <div className="flex items-start gap-2 text-white/50 text-sm">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Privacy-preserving commitments via zk-proofs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Process flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 lg:p-12"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white">Commit-Reveal Settlement Flow</h3>
                <p className="text-white/40 text-sm">How trades execute with zero counterparty risk</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Phase 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">1</div>
                  <span className="text-white/90">RFQ Published</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Maker publishes request with bond deposit. Takers generate zk-proofs via API and submit hashed commitments with bonds.
                </p>
              </div>

              {/* Phase 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">2</div>
                  <span className="text-white/90">Verification & Reveal</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Escrow verifies all zk-proofs. Valid commits move to reveal phase. Maker selects best quote and TTL countdown begins.
                </p>
              </div>

              {/* Phase 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs">3</div>
                  <span className="text-white/90">Settlement & Swap</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Both parties deposit assets. Escrow executes atomic swap, transfers fee to treasury, and returns bonds.
                </p>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3">
              <Lock className="w-4 h-4 text-white/40 mt-1 flex-shrink-0" />
              <p className="text-white/40 text-sm leading-relaxed">
                <span className="text-white/60">Confidentiality and fairness are essential in every trade.</span> Our architecture transforms Solana's liquidity depth into institutional-grade OTC rails.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
