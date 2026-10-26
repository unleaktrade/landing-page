export const BETA_APP_URL = "https://app.unleak.trade";
export const TELEGRAM_URL = "https://t.me/+dwi3eXR9Q1Q4NjE0";
export const YOUTUBE_URL = "https://www.youtube.com/@whyvrafvr-unleaktrade";
export const TIKTOK_URL = "https://www.tiktok.com/@unleaktrade";
// The Wick Masters demo PDF is not uploaded yet, so the demo button points to
// the home page. Once the file is in public/academy/ (or on the CDN), set this
// to its versioned path and render the button as an <a download>.
export const WICKMASTERS_DEMO_URL = "/";
export const WAITLIST_INFO_URL =
  "https://x.com/unleaktrade/status/1981010618070307290";
export const API_BASE_URL =
  "https://unleaktrade-waitlist-028080d4039f.herokuapp.com";
export const explorerTxUrl = (signature: string, cluster = "devnet") =>
  `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
