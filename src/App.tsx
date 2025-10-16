import { useEffect, useState } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { ValueProps } from "./components/ValueProps";
import { HowItWorks } from "./components/HowItWorks";
import { SettlementProcess } from "./components/SettlementProcess";
import { Economics } from "./components/Economics";
import { TeamSection } from "./components/TeamSection";
import { TeamPage } from "./components/TeamPage";
import { Roadmap } from "./components/Roadmap";
import { DiscordCTA } from "./components/DiscordCTA";
import { Footer } from "./components/Footer";
import { WorkInProgress } from "./components/WorkInProgress";
import faviconImage from "figma:asset/77164cc6a58e276f88505209efc62dfe8b57b786.png";

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    // Set document title
    document.title = "UnleakTrade - Confidential OTC Trading on Solana";
    
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

    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      // Valid routes
      const validHashes = ['', '#roadmap', '#team', '#app', '#faq'];
      
      // If hash is not recognized and not empty, redirect to home
      // Allow team member specific hashes like #team-julien-sie
      if (hash && !validHashes.includes(hash) && !hash.startsWith('#team-')) {
        window.location.hash = '';
        return;
      }
      
      setCurrentHash(hash);
      
      // Scroll to top when changing routes
      window.scrollTo(0, 0);
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show roadmap page
  if (currentHash === '#roadmap') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Roadmap />
        <Footer />
      </div>
    );
  }

  // Show work in progress page for app and faq sections
  if (currentHash === '#app' || currentHash === '#faq') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <WorkInProgress />
      </div>
    );
  }

  // Show team page (including specific team member links like #team-julien-sie)
  if (currentHash === '#team' || currentHash.startsWith('#team-')) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <TeamPage />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <SettlementProcess />
      <Economics />
      <TeamSection />
      <DiscordCTA />
      <Footer />
    </div>
  );
}