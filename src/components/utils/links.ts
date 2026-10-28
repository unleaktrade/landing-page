export const BETA_APP_URL = "https://app.unleak.trade";
export const TELEGRAM_URL = "https://t.me/+dwi3eXR9Q1Q4NjE0";
export const YOUTUBE_URL = "https://www.youtube.com/@whyvrafvr-unleaktrade";
export const TIKTOK_URL = "https://www.tiktok.com/@unleaktrade";
// Wick Masters free demo request: the Airtable "Free demo request -> deliver
// demo" automation logs the request in the Orders table (status Free demo) and
// emails the PDF link. The PDF URL lives in that email only, never on this site.
export const WICKMASTERS_DEMO_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appcS6Dsaqwq6jYyA/wflgzzCOkbC1MFkEt/wtrUBrkFLVzW4WWgG";
// Cloudflare Turnstile site key for the free demo form (public by design). The
// Airtable automation checks each token with the matching secret
// (TURNSTILE_SECRET) before logging the request or sending the email.
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
// Wick Masters full guide + 10 cheat sheets checkout. The price lives on the
// checkout only, never on this site.
export const WICKMASTERS_CHECKOUT_URL = "https://buy.stripe.com/bJe3cv0SB8bA8TE6oN5AQ03";
export const WAITLIST_INFO_URL =
  "https://x.com/unleaktrade/status/1981010618070307290";
export const API_BASE_URL =
  "https://unleaktrade-waitlist-028080d4039f.herokuapp.com";
export const explorerTxUrl = (signature: string, cluster = "devnet") =>
  `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
