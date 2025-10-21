import { useState } from "react";
import { useForm } from "react-hook-form@7.55.0";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import {
  isOnCurveAddress,
  isValidEmail,
} from "./utils/validation";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  address: string;
  email: string;
  sponsor: string;
}

export function WaitlistDialog({
  open,
  onOpenChange,
}: WaitlistDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

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
      sponsor: "",
    },
  });

  const resetForm = () => {
    reset();
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

        toast.success("Verification email sent!", {
          description:
            "Please check your inbox and confirm your email address to complete your waitlist registration.",
          duration: 6000,
        });

        // Reset form and close dialog after a short delay
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 2000);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Join the Waitlist
          </DialogTitle>
          <div className="space-y-2 sm:space-y-3 pt-2">
            <DialogDescription className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Gain exclusive early access to UnleakTrade's
              preview platform and compete for rewards in our
              referral program.
            </DialogDescription>
            <DialogDescription className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Waitlist members enjoy privileged access to
              exclusive market intelligence, our private
              competition dashboard, and performance-based
              rewards for sponsoring select participants. This
              invitation-only program is reserved for discerning
              traders seeking a strategic edge in confidential
              OTC markets on Solana.{" "}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="address"
                  className="text-white/80 text-sm"
                >
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
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 text-sm h-10 ${
                    touchedFields.address && errors.address
                      ? "border-red-500/50"
                      : ""
                  }`}
                  disabled={isSubmitting}
                />
                {touchedFields.address && errors.address && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white/80 text-sm"
                >
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
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 text-sm h-10 ${
                    touchedFields.email && errors.email
                      ? "border-red-500/50"
                      : ""
                  }`}
                  disabled={isSubmitting}
                />
                {touchedFields.email && errors.email && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="sponsor"
                  className="text-white/80 text-sm"
                >
                  Sponsor Wallet Address
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
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 text-sm h-10 ${
                    touchedFields.sponsor && errors.sponsor
                      ? "border-red-500/50"
                      : ""
                  }`}
                  disabled={isSubmitting}
                />
                {touchedFields.sponsor && errors.sponsor && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {errors.sponsor.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-2">
              {progress > 0 && (
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-400 text-white hover:opacity-90 transition-opacity disabled:opacity-50 h-10 text-sm sm:text-base"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Join Waitlist"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}