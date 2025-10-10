import { motion } from "motion/react";
import { Shield, Eye, Scale } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trustless execution",
    description: "No intermediaries. No counterparty risk. Smart contracts guarantee settlement on your terms."
  },
  {
    icon: Eye,
    title: "Complete privacy",
    description: "Zero-knowledge proofs keep your positions, strategies, and counterparties completely confidential."
  },
  {
    icon: Scale,
    title: "Institutional fairness",
    description: "Time-weighted average pricing and cryptographic proofs ensure you get institutional-grade execution."
  }
];

export function ValueProps() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-3xl lg:text-4xl tracking-tight">
            Trading the way it should be
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            Bringing the standards of traditional finance to decentralized markets
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-400/20 flex items-center justify-center mb-6 group-hover:from-purple-600/30 group-hover:to-cyan-400/30 transition-colors">
                <value.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl mb-3 tracking-tight">{value.title}</h3>
              <p className="text-white/50 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
