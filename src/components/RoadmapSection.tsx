import { motion } from "motion/react";
import { Check, Circle, Lock } from "lucide-react";

export function RoadmapSection() {
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
            Building in phases, launching with confidence
          </h2>
          <p className="text-white/40 text-lg max-w-2xl">
            Our roadmap prioritizes security, usability, and gradual decentralization.
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl">Phase 1: Foundation</h3>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                    Complete
                  </span>
                </div>
                <p className="text-white/50 mb-4 leading-relaxed">
                  Core protocol development, ZK circuit design, and security audits completed. Testnet deployed with initial partners.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Smart Contracts</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">ZK Circuits</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Audit</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="border border-purple-500/30 rounded-2xl p-8 bg-gradient-to-br from-purple-500/5 to-cyan-400/5"
          >
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shrink-0">
                <Circle className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl">Phase 2: Private Beta</h3>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                    Current
                  </span>
                </div>
                <p className="text-white/50 mb-4 leading-relaxed">
                  Limited mainnet launch with whitelisted institutional partners. Focus on gathering feedback and optimizing execution algorithms.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Mainnet Launch</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Institutional Onboarding</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">$10M Volume Target</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Circle className="w-5 h-5 text-white/40" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl">Phase 3: Public Launch</h3>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs border border-white/10">
                    Q2 2025
                  </span>
                </div>
                <p className="text-white/50 mb-4 leading-relaxed">
                  Open access to all verified users. Multi-chain support and advanced order types. Community governance activation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Public Access</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Cross-Chain</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">DAO Launch</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl">Phase 4: Full Decentralization</h3>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs border border-white/10">
                    Q4 2025
                  </span>
                </div>
                <p className="text-white/50 mb-4 leading-relaxed">
                  Complete protocol decentralization with community-run validator network. Enhanced privacy features and institutional custody integration.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Validator Network</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Enhanced Privacy</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">Custody Partners</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
