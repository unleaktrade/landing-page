import { useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { ValueProps } from "./components/ValueProps";
import { HowItWorks } from "./components/HowItWorks";
import { DiscordCTA } from "./components/DiscordCTA";
import { Footer } from "./components/Footer";
import faviconImage from "figma:asset/77164cc6a58e276f88505209efc62dfe8b57b786.png";

export default function App() {
  useEffect(() => {
    // Set document title
    document.title = "UmbraTrade - Confidential OTC Trading on Solana";
    
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImage;
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(link);
    }
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Make crypto OTC private, fair, and trustless using Zero-Knowledge Proofs on Solana. Institutional-grade fairness for everyone.');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <DiscordCTA />
      <Footer />
    </div>
  );
}