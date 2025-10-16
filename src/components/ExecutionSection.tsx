import { motion } from "motion/react";

export function ExecutionSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl mb-6 max-w-4xl">
            Fair execution, proven mathematically
          </h2>
          <p className="text-white/40 text-lg max-w-2xl">
            No price manipulation. No front-running. Just transparent, verifiable execution backed by cryptographic guarantees.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                Time-Weighted Average Price
              </div>
              <h3 className="text-2xl mb-3">TWAP Execution</h3>
              <p className="text-white/50 leading-relaxed">
                Large orders are automatically split and executed over time to minimize market impact and achieve better average prices.
              </p>
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                Anti-Manipulation
              </div>
              <h3 className="text-2xl mb-3">MEV Protection</h3>
              <p className="text-white/50 leading-relaxed">
                Smart order routing and threshold encryption prevent sandwich attacks and other forms of extractable value.
              </p>
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                Verifiable Fairness
              </div>
              <h3 className="text-2xl mb-3">Cryptographic Audit Trail</h3>
              <p className="text-white/50 leading-relaxed">
                Every execution is verifiable on-chain with proof of fair pricing and correct order matching.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02]"
          >
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/50 text-sm">Slippage Tolerance</span>
                  <span className="text-white">0.5%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[20%] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/50 text-sm">Execution Window</span>
                  <span className="text-white">4 hours</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/50 text-sm">Split Strategy</span>
                  <span className="text-white">12 orders</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="text-white/50 text-sm mb-2">Expected Execution</div>
                <div className="text-3xl mb-1">$42,847.23</div>
                <div className="text-white/50 text-sm">±0.3% market variance</div>
              </div>

              <div className="pt-4">
                <div className="text-white/50 text-sm mb-4">Price Impact Analysis</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Direct execution</span>
                    <span className="text-red-400">-2.4%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">UnleakTrade execution</span>
                    <span className="text-green-400">-0.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
