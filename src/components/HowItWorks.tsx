import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Submit your order privately",
    description: "Define your trade parameters—amount, price range, and timing—all kept confidential through zero-knowledge proofs."
  },
  {
    number: "02",
    title: "Automated matching",
    description: "Our protocol finds the optimal counterparty and execution path without revealing your position to the market."
  },
  {
    number: "03",
    title: "Fair execution guaranteed",
    description: "Time-weighted pricing ensures you get institutional-quality fills, with cryptographic proof of fair execution."
  },
  {
    number: "04",
    title: "Instant settlement",
    description: "Smart contracts on Solana handle settlement automatically—no trust required, no delays."
  }
];

export function HowItWorks() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-3xl lg:text-4xl tracking-tight">
            Built for serious traders
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            Four steps to confidential, fair, and automated execution
          </p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start gap-8 p-8 rounded-2xl border border-white/5 bg-black hover:bg-white/[0.02] transition-all">
                <div className="text-6xl font-light text-white/10 group-hover:text-white/20 transition-colors">
                  {step.number}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
