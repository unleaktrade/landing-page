import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl mb-8">
            Ready to trade in the shadows?
          </h2>
          <p className="text-white/50 text-xl mb-12 max-w-2xl mx-auto">
            Join our private beta and experience the future of institutional crypto trading.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2">
              <span>Request Beta Access</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
              Read Documentation
            </button>
          </div>

          <div className="mt-16 pt-16 border-t border-white/5">
            <p className="text-white/40 text-sm mb-6">Trusted by institutional partners</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
              <div className="text-white/60">Partner Logo</div>
              <div className="text-white/60">Partner Logo</div>
              <div className="text-white/60">Partner Logo</div>
              <div className="text-white/60">Partner Logo</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ambient background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-cyan-400/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
