import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { normalizePath, shouldHydrate } from "./hydration";
import "./index.css";

// GitHub Pages also serves the prerendered files at /faq.html; show the clean
// URL so the router matches it and the address bar matches the canonical.
const clean = normalizePath(window.location.pathname);
if (window.location.pathname.endsWith(".html")) {
  window.history.replaceState(null, "", clean + window.location.search + window.location.hash);
}

const root = document.getElementById("root")!;
if (shouldHydrate(root, clean)) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
