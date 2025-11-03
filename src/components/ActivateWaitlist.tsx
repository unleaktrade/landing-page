import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import { isValidSHA3Hash } from "./utils/validation";
import { QRCodeDialog } from "./QRCodeDialog";

type ActivationStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export function ActivateWaitlist() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [hash, setHash] = useState("");
  const [status, setStatus] =
    useState<ActivationStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorHash, setErrorHash] = useState<string | null>(null);
  const [isQROpen, setIsQROpen] = useState(false);

  useEffect(() => {
    // Retrieve hash from localStorage if it exists
    const storedHash = localStorage.getItem("waitlist_registration_hash");
    if (storedHash) {
      setHash(storedHash);
    }

    // Redirect if no token
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    // Animate progress bar
    if (status === "submitting") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else if (status === "success") {
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [status]);

  const validateHash = (value: string): string | null => {
    if (!value.trim()) {
      return "Hash is required";
    }
    if (!isValidSHA3Hash(value.trim())) {
      return "Invalid hash format. Please enter a valid SHA3 hash (64 or 128 hexadecimal characters)";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateHash(hash);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://unleaktrade-waitlist-028080d4039f.herokuapp.com/activate/${token}/${hash.trim()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        // Parse response and store wallet address
        const data = await response.json();
        if (data.address) {
          localStorage.setItem("waitlist_wallet_address", data.address);
        }
        
        setStatus("success");
        toast.success(
          "Activation successful! Check your email for confirmation.",
        );
      } else if (response.status === 401) {
        setStatus("error");
        setErrorHash(hash.trim());
        setErrorMessage(
          "Access denied. Your activation link may have expired or the verification code doesn't match our records. Please request a new activation link.",
        );
        toast.error("Activation failed");
      } else if (response.status === 409) {
        setStatus("error");
        setErrorHash(hash.trim());
        setErrorMessage(
          "This account has already been activated. You're all set! Check your email for next steps.",
        );
        toast.error("Already activated");
      } else if (response.status === 400) {
        setStatus("error");
        setErrorHash(hash.trim());
        setErrorMessage(
          "The referral sponsor could not be found. Please check your invitation link or contact support.",
        );
        toast.error("Invalid sponsor");
      } else if (response.status === 500) {
        const errorData = await response.json();
        setStatus("error");
        setErrorMessage(
          errorData.error ||
            "An unexpected error occurred. Please try again later.",
        );
        toast.error("Server error");
      } else {
        setStatus("error");
        setErrorMessage(
          "An unexpected error occurred. Please try again later.",
        );
        toast.error("Activation failed");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again.",
      );
      toast.error("Network error");
    }
  };

  const handleHashChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHash(e.target.value);
    setErrorMessage("");
    // Reset error state when user modifies the hash
    if (status === "error") {
      setStatus("idle");
    }
  };

  // Check if the hash is valid in real-time
  const isHashValid = hash.trim() && isValidSHA3Hash(hash.trim());
  
  // Button should be enabled only if hash is valid AND (no error OR hash has been modified since error)
  const isButtonEnabled = isHashValid && (errorHash === null || hash.trim() !== errorHash);

  if (status === "success") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 blur-xl"
              />
              <div className="relative w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Welcome to the Waitlist!
              </span>
            </h1>
            <p className="text-white/60 mb-6">
              You'll receive a confirmation email shortly.
              You're now officially on the UnleakTrade waitlist.
            </p>
          </motion.div>

          {/* Sponsor invitation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-400/10" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl">Share the Alpha</h3>
              </div>

              <p className="text-white/60 mb-6">
                Want to move up the waitlist? Share your wallet
                address to sponsor other users and earn priority
                access.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setIsQROpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white border-0"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  My Referral QR
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white border-0"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* QR Code Dialog */}
          <QRCodeDialog open={isQROpen} onOpenChange={setIsQROpen} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-block p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-purple-500/20">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl mb-3"
          >
            <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Activate Your Spot
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 mb-3"
          >
            Enter the verification code from your email to
            confirm your waitlist registration
          </motion.p>
          <motion.a
            href="https://x.com/unleaktrade/status/1981010618070307290"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 hover:bg-clip-text hover:text-transparent transition-all group"
          >
            Learn more about the waitlist
            <ExternalLink className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
          </motion.a>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {status === "submitting" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Progress value={progress} className="h-1" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">
                {errorMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="relative">
            <label
              htmlFor="hash"
              className="block text-sm text-white/80 mb-2"
            >
              Verification Code (SHA3 Hash)
            </label>
            <Input
              id="hash"
              type="text"
              value={hash}
              onChange={handleHashChange}
              placeholder="Enter your 64 or 128 character hash..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20"
              disabled={status === "submitting"}
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-white/40">
              This code was sent to your email address
            </p>
          </div>

          {isButtonEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white border-0 disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Activating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Activate Waitlist Spot
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </motion.form>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate("/")}
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            ← Back to home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}