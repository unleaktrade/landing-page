export const BETA_APP_URL = "https://app.unleak.trade";
export const TELEGRAM_URL = "https://t.me/+dwi3eXR9Q1Q4NjE0";
export const YOUTUBE_URL = "https://www.youtube.com/@whyvrafvr-unleaktrade";
export const TIKTOK_URL = "https://www.tiktok.com/@unleaktrade";
// Wick Masters free demo, served from the CloudFront CDN (private S3 bucket).
// The file name is versioned and cached for a year: a new version needs a new name.
export const WICKMASTERS_DEMO_URL =
  "https://d1wv92rybd6p8k.cloudfront.net/academy/WickMasters-FreeDemo-Levels0-1_v2026-10-27.pdf";
// Wick Masters full guide + 10 cheat sheets checkout. The price lives on the
// checkout only, never on this site.
export const WICKMASTERS_CHECKOUT_URL = "https://buy.stripe.com/bJe3cv0SB8bA8TE6oN5AQ03";
export const WAITLIST_INFO_URL =
  "https://x.com/unleaktrade/status/1981010618070307290";
export const API_BASE_URL =
  "https://unleaktrade-waitlist-028080d4039f.herokuapp.com";
export const explorerTxUrl = (signature: string, cluster = "devnet") =>
  `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
