import { motion } from "motion/react";
import { Shield, Lock, Eye } from "lucide-react";

export function TrustSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl mb-6 max-w-4xl">
            Trust shouldn't come at the cost of privacy
          </h2>
          <p className="text-white/40 text-lg max-w-2xl">
            Traditional OTC desks require full transparency, exposing your strategy and position sizes. We're building something different.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl mb-4">Zero-Knowledge Proofs</h3>
            <p className="text-white/50 leading-relaxed">
              Verify trade authenticity without revealing position sizes, counterparties, or trading strategies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl mb-4">Encrypted Order Book</h3>
            <p className="text-white/50 leading-relaxed">
              Orders remain encrypted on-chain until matched, ensuring complete pre-trade confidentiality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl mb-4">Selective Disclosure</h3>
            <p className="text-white/50 leading-relaxed">
              Share only what's necessary for compliance while keeping strategic information private.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
