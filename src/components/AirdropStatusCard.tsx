import {
  Coins,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { TELEGRAM_URL, explorerTxUrl } from "./utils/links";

export type AirdropStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "already_distributed"
  | "failed_retryable"
  | "failed_terminal";

export interface AirdropInfo {
  cluster: string;
  status: AirdropStatus;
  mint: string;
  amount: string | number;
  rawAmount: string | number;
  signature?: string;
  retryable: boolean;
  /** Token symbol sent by the backend (e.g. "uUSDC"). Optional for older payloads. */
  symbol?: string;
}

const DEFAULT_SYMBOL = "uUSDC";

const DISCLAIMER =
  "uUSDC is a devnet-only test token: not real USDC, no real-world monetary value.";

function formatAmount(amount: string | number | undefined): string {
  if (amount === undefined || amount === null) return "1,000";
  const numeric = typeof amount === "number" ? amount : Number(amount);
  if (Number.isFinite(numeric)) {
    return numeric.toLocaleString("en-US");
  }
  return "1,000";
}

function ExplorerLink({
  signature,
  cluster,
}: {
  signature: string;
  cluster?: string;
}) {
  return (
    <a
      href={explorerTxUrl(signature, cluster || "devnet")}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:opacity-90 transition-opacity"
    >
      View transaction on Solana Explorer
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

export function AirdropStatusCard({
  airdrop,
}: {
  airdrop?: AirdropInfo | null;
}) {
  if (!airdrop || typeof airdrop !== "object" || !airdrop.status) {
    return null;
  }

  const amountLabel = formatAmount(airdrop.amount);
  const symbol =
    typeof airdrop.symbol === "string" && airdrop.symbol.trim()
      ? airdrop.symbol.trim()
      : DEFAULT_SYMBOL;
  const status = airdrop.status;

  let icon: React.ReactNode;
  let title: string;
  let body: React.ReactNode;

  switch (status) {
    case "confirmed":
      icon = <CheckCircle2 className="w-5 h-5 text-white" />;
      title = "Unleak USDC delivered";
      body = (
        <>
          <p className="text-white/60 mb-4">
            {amountLabel} {symbol} delivered to your wallet.
          </p>
          {airdrop.signature && (
            <div className="mb-4">
              <ExplorerLink
                signature={airdrop.signature}
                cluster={airdrop.cluster}
              />
            </div>
          )}
        </>
      );
      break;
    case "already_distributed":
      icon = <CheckCircle2 className="w-5 h-5 text-white" />;
      title = "Airdrop already received";
      body = (
        <>
          <p className="text-white/60 mb-4">
            This wallet has already received its {symbol} airdrop.
          </p>
          {airdrop.signature && (
            <div className="mb-4">
              <ExplorerLink
                signature={airdrop.signature}
                cluster={airdrop.cluster}
              />
            </div>
          )}
        </>
      );
      break;
    case "failed_retryable":
      icon = <AlertCircle className="w-5 h-5 text-white" />;
      title = "Airdrop delayed";
      body = (
        <p className="text-amber-200/80 mb-4">
          The airdrop hit a temporary snag. Your spot is safe, distribution
          will be retried automatically. No action needed.
        </p>
      );
      break;
    case "failed_terminal":
      icon = <AlertCircle className="w-5 h-5 text-white" />;
      title = "Airdrop failed";
      body = (
        <p className="text-red-200/80 mb-4">
          We couldn't complete the airdrop for this wallet. Your activation is
          still valid. Reach out on{" "}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:opacity-90 transition-opacity"
          >
            Telegram
          </a>{" "}
          and we'll sort it out.
        </p>
      );
      break;
    case "pending":
    case "processing":
      icon = <Loader2 className="w-5 h-5 text-white animate-spin" />;
      title = `Your ${symbol} airdrop is on the way`;
      body = (
        <p className="text-white/60 mb-4">
          We're sending {amountLabel} {symbol} (Unleak USDC) to your registered
          wallet so you can test the beta. This usually completes within a few
          minutes. No action needed.
        </p>
      );
      break;
    default:
      // Unknown status strings degrade to the neutral in-progress variant.
      icon = <Coins className="w-5 h-5 text-white" />;
      title = `Your ${symbol} airdrop is on the way`;
      body = (
        <p className="text-white/60 mb-4">
          We're sending {amountLabel} {symbol} (Unleak USDC) to your registered
          wallet so you can test the beta. This usually completes within a few
          minutes. No action needed.
        </p>
      );
      break;
  }

  return (
    <div className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl">{title}</h3>
        </div>

        {body}

        <p className="text-white/40 text-xs leading-relaxed">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
