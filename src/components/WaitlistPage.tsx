import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form@7.55.0";
import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { CheckCircle2, Lock } from "lucide-react";
import {
  isOnCurveAddress,
  isValidEmail,
} from "./utils/validation";

interface FormData {
  address: string;
  email: string;
  sponsor: string;
}

export function WaitlistPage() {
  const { sponsor: sponsorParam } = useParams<{ sponsor?: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if sponsor param is valid
  const isValidSponsor = sponsorParam ? isOnCurveAddress(sponsorParam) : false;
  const lockedSponsor = isValidSponsor ? sponsorParam : "";

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      address: "",
      email: "",
      sponsor: lockedSponsor || "",
    },
  });

  useEffect(() => {
    // If sponsor param exists but is invalid, show error and redirect
    if (sponsorParam && !isValidSponsor) {
      toast.error("Invalid sponsor address", {
        description: "The sponsor address in the URL is invalid. Redirecting to home.",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [sponsorParam, isValidSponsor, navigate]);

  const resetForm = () => {
    reset({
      address: "",
      email: "",
      sponsor: lockedSponsor || "",
    });
    setProgress(0);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch(
        "https://unleaktrade-waitlist-028080d4039f.herokuapp.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Address: data.address,
            Email: data.email,
            Sponsor: data.sponsor,
          }),
        },
      );

      clearInterval(progressInterval);

      if (response.status === 202) {
        const responseData = await response.json();

        // Store the hash in localStorage
        if (responseData.hash) {
          localStorage.setItem(
            "waitlist_registration_hash",
            responseData.hash,
          );
        }

        setProgress(100);
        setIsSuccess(true);

        toast.success("Verification email sent!", {
          description:
            "Please check your inbox and confirm your email address to complete your waitlist registration.",
          duration: 6000,
        });
      } else {
        setProgress(0);
        const errorData = await response
          .json()
          .catch(() => ({}));
        toast.error("Registration failed", {
          description:
            errorData.message ||
            "Please check your information and try again.",
        });
      }
    } catch (error) {
      setProgress(0);
      toast.error("Network error", {
        description:
          "Unable to connect to the server. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle2 className="w-20 h-20 text-cyan-400" />
          </motion.div>

          <h1 className="text-3xl text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Check Your Email
          </h1>

          <div className="space-y-4 mb-8">
            <p className="text-white/60 text-center">
              We've sent a verification link to your email address. Please
              check your inbox and click the link to complete your waitlist
              registration.
            </p>
            <p className="text-white/40 text-center text-sm">
              Don't forget to check your spam or junk folder if you don't see
              the email within a few minutes.
            </p>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-400 text-white hover:opacity-90"
          >
            Go Home
          </Button>
        </motion.div>
      </div>
    );
  }

  // Don't render form if sponsor is invalid
  if (sponsorParam && !isValidSponsor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-4 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Join the Waitlist
          </h1>
          <div className="space-y-3 text-left">
            <p className="text-white/60 leading-relaxed">
              Gain exclusive early access to UnleakTrade's preview platform
              and compete for rewards in our referral program.
            </p>
            <p className="text-white/60 leading-relaxed">
              Waitlist members enjoy privileged access to exclusive market
              intelligence, our private competition dashboard, and
              performance-based rewards for sponsoring select participants.
            </p>
            <p className="text-white/80 leading-relaxed">
              This invitation-only program is reserved for discerning
              traders seeking a strategic edge in confidential OTC markets
              on Solana.
            </p>
          </div>

          {lockedSponsor && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 border border-purple-500/20 rounded-lg text-center"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-cyan-400 mb-1">
                <Lock className="w-4 h-4" />
                <span>Fast Pass Active</span>
              </div>
              <p className="text-white/40 text-xs">
                Your sponsor has been pre-filled and locked
              </p>
            </motion.div>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="space-y-5">
            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white/80">
                Your Solana Wallet Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="F5hcjs...MJdQqoG"
                {...register("address", {
                  required: "Wallet address is required",
                  validate: {
                    onCurve: (value) =>
                      isOnCurveAddress(value) ||
                      "Invalid Solana address or address is not on curve",
                  },
                })}
                className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 h-12 ${
                  touchedFields.address && errors.address
                    ? "border-red-500/50"
                    : ""
                }`}
                disabled={isSubmitting}
              />
              {touchedFields.address && errors.address && (
                <p className="text-red-400">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email Address
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    validEmail: (value) =>
                      isValidEmail(value) ||
                      "Please enter a valid email address",
                  },
                })}
                className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 h-12 ${
                  touchedFields.email && errors.email
                    ? "border-red-500/50"
                    : ""
                }`}
                disabled={isSubmitting}
              />
              {touchedFields.email && errors.email && (
                <p className="text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Sponsor Field */}
            <div className="space-y-2">
              <Label htmlFor="sponsor" className="text-white/80 flex items-center gap-2">
                Sponsor Wallet Address
                {lockedSponsor && (
                  <Lock className="w-3 h-3 text-cyan-400" />
                )}
              </Label>
              <Input
                id="sponsor"
                type="text"
                placeholder="GhTppH...3dHtFyc"
                {...register("sponsor", {
                  required: "Sponsor address is required",
                  validate: {
                    onCurve: (value) =>
                      isOnCurveAddress(value) ||
                      "Invalid Solana address or address is not on curve",
                  },
                })}
                className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 h-12 ${
                  touchedFields.sponsor && errors.sponsor
                    ? "border-red-500/50"
                    : ""
                } ${lockedSponsor ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting || !!lockedSponsor}
                readOnly={!!lockedSponsor}
              />
              {touchedFields.sponsor && errors.sponsor && (
                <p className="text-red-400">
                  {errors.sponsor.message}
                </p>
              )}
              {lockedSponsor && (
                <p className="text-cyan-400/60 text-xs">
                  This field has been locked by your referral link
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-400 text-white hover:opacity-90 transition-opacity disabled:opacity-50 h-12"
          >
            {isSubmitting ? "Submitting..." : "Join Waitlist"}
          </Button>

          {/* Back to Home Link */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full text-white/40 hover:text-white/60 transition-colors text-sm"
          >
            Back to Home
          </button>
        </form>
      </motion.div>
    </div>
  );
}
