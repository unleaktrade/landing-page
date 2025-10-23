import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

export function WorkInProgress() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            {/* Outer pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                filter: "blur(20px)",
              }}
            />
            
            {/* Icon container */}
            <div className="relative w-20 h-20 rounded-full border border-white/10 bg-black flex items-center justify-center">
              <Clock className="w-9 h-9 text-white/60" />
            </div>
          </div>
        </motion.div>

        {/* Main heading with gradient shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 flex justify-center overflow-hidden"
        >
          <h1 className="text-4xl md:text-5xl mb-2 relative inline-block py-2">
            <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Work in Progress
            </span>
            <motion.div
              animate={{
                x: ["-150%", "150%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
            />
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/40 mb-8 max-w-md mx-auto"
        >
          We're building something exceptional. This section will be available soon with comprehensive documentation and resources.
        </motion.p>

        {/* Animated loading bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="h-1 w-64 mx-auto bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-cyan-400"
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors group cursor-pointer"
          >
            <span>Return to home</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </button>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
