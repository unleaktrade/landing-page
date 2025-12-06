import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Maker creates RFQ",
    description: "Initialize a Request for Quote as a draft, define parameters, then open it to the market with bond deposit—inviting multiple takers to compete."
  },
  {
    number: "02",
    title: "Takers commit quotes",
    description: "Multiple market participants submit blind quotes via commit-reveal. Liquidity Guard validates solvency with ZK proofs and Ed25519 signatures before acceptance."
  },
  {
    number: "03",
    title: "Quotes revealed & selected",
    description: "After reveal phase, maker reviews all valid quotes and selects the best offer. The winning taker is chosen to proceed to settlement."
  },
  {
    number: "04",
    title: "Settlement executes",
    description: "Selected taker deposits quote amount plus fees. Atomic swap occurs, bonds refunded to valid parties, and protocol collects penalties from defaulters."
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