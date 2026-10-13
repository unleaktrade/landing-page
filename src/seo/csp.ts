// Production Content-Security-Policy for unleak.trade, injected as a <meta> by
// the `inject-csp` plugin in vite.config.ts on `vite build` only (the dev
// server needs inline scripts for HMR). scripts/prerender.mjs uses the built
// index.html as its template, so every prerendered route and the 404.html
// shell carry it too.
//
// GitHub Pages cannot set response headers, so the meta is the only lever.
// Header-only directives (frame-ancestors, report-uri / report-to, sandbox)
// are therefore out of reach.
//
// Kept free of React imports: vite.config.ts loads it at config time.
//
// Rationale per directive:
//   script-src  'self' + Google tag: no inline script at all. The gtag
//               bootstrap lives in public/gtag-init.js for that reason. The
//               JSON-LD blocks are data, not script, so they are not affected.
//   style-src   'unsafe-inline': motion animates through inline style
//               attributes, and the prerendered markup ships them (opacity:0).
//   img-src     YouTube posters (i.ytimg.com), data: / blob: for the QR code
//               download, Google tag beacons.
//   frame-src   the privacy-enhanced YouTube player used by the Shorts section.
//   connect-src the waitlist API and Google Analytics collection endpoints.
import { API_BASE_URL } from '../components/utils/links';

const GOOGLE_TAG = 'https://*.googletagmanager.com';
const GOOGLE_ANALYTICS = ['https://*.google-analytics.com', 'https://*.analytics.google.com'];

export function buildCsp(): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    `script-src 'self' ${GOOGLE_TAG}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://i.ytimg.com ${GOOGLE_TAG} ${GOOGLE_ANALYTICS[0]}`,
    "font-src 'self'",
    'frame-src https://www.youtube-nocookie.com',
    `connect-src 'self' ${new URL(API_BASE_URL).origin} ${GOOGLE_TAG} ${GOOGLE_ANALYTICS.join(' ')}`,
    'upgrade-insecure-requests',
  ].join('; ');
}
