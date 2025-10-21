import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { Copy, Check, Share2, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImage from "figma:asset/77164cc6a58e276f88505209efc62dfe8b57b786.png";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDialog({ open, onOpenChange }: QRCodeDialogProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get wallet address from localStorage
    const address = localStorage.getItem("waitlist_wallet_address");
    setWalletAddress(address);
  }, [open]);

  if (!walletAddress) {
    return null;
  }

  // Create the referral link
  const referralLink = `${window.location.origin}/waitlist/${walletAddress}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!", {
        description: "Share it with others to earn priority access",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join UmbraTrade Waitlist",
          text: "Get exclusive early access to UmbraTrade - Confidential OTC Trading on Solana",
          url: referralLink,
        });
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const svg = document.getElementById("qr-code-svg") as unknown as SVGSVGElement;
    
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return;

      // Background with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 100, 200, 1000, 1000);

      // Add text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to Join UmbraTrade", canvas.width / 2, 100);

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "umbratrade-referral-qr.png";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("QR code downloaded!");
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Shortened address for display
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10 text-white max-w-lg p-0 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-400/5 pointer-events-none" />
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Share Your Referral
            </DialogTitle>
            <p className="text-white/60 text-center text-sm mt-2">
              Sponsor others to climb the waitlist and earn priority access
            </p>
          </DialogHeader>

          {/* QR Code Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="relative mx-auto w-fit p-6 bg-white rounded-2xl">
              {/* Gradient border effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-purple-400 to-cyan-400 rounded-2xl blur opacity-75" />
              
              {/* QR Code */}
              <div className="relative bg-white p-4 rounded-xl">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={referralLink}
                  size={280}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: logoImage,
                    height: 60,
                    width: 60,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-purple-400 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-purple-400 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
          </motion.div>

          {/* Wallet Address Display */}
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-xs text-white/40 mb-1">Your Sponsor Address</div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm text-white/80 font-mono">{shortAddress}</code>
              <span className="text-xs text-white/30">({walletAddress.length} chars)</span>
            </div>
          </div>

          {/* Referral Link */}
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-xs text-white/40 mb-2">Referral Link</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent border-none text-sm text-white/60 outline-none truncate"
              />
              <Button
                onClick={handleCopy}
                size="sm"
                variant="ghost"
                className="h-8 px-3 hover:bg-white/10"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4 text-white/60" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-purple-600 to-cyan-400 hover:opacity-90 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Download className="w-4 h-4 mr-2" />
              Save QR
            </Button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 border border-purple-500/20 rounded-lg">
            <p className="text-xs text-white/60 text-center">
              Share this QR code or link with others. When they join using your referral,
              you'll both move up the waitlist and earn priority access to UmbraTrade.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
