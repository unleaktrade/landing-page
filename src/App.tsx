import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { WaitlistDialog } from "./components/WaitlistDialog";
import { WaitlistPage } from "./components/WaitlistPage";
import { ActivateWaitlist } from "./components/ActivateWaitlist";
import { Toaster } from "sonner@2.0.3";
import faviconImage from "figma:asset/77164cc6a58e276f88505209efc62dfe8b57b786.png";

// Component to scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    // Only scroll if the path actually changed (not just params)
    const currentBasePath = location.pathname.split('/')[1] || 'home';
    const prevBasePath = prevPath.split('/')[1] || 'home';
    
    if (currentBasePath !== prevBasePath) {
      window.scrollTo(0, 0);
    }
    
    setPrevPath(location.pathname);
  }, [location.pathname]);

  return null;
}

function HomePage({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero onOpenWaitlist={onOpenWaitlist} />
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

function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Roadmap />
      <Footer />
    </div>
  );
}

function TeamPageWrapper() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <TeamPage />
      <Footer />
    </div>
  );
}

function WorkInProgressPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <WorkInProgress />
    </div>
  );
}

function ActivateWaitlistPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ActivateWaitlist />
    </div>
  );
}

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

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
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage onOpenWaitlist={() => setIsWaitlistOpen(true)} />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/team" element={<TeamPageWrapper />} />
        <Route path="/team/:memberId" element={<TeamPageWrapper />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/waitlist/:sponsor" element={<WaitlistPage />} />
        <Route path="/activate/:token" element={<ActivateWaitlistPage />} />
        <Route path="/faq" element={<WorkInProgressPage />} />
        <Route path="/app" element={<WaitlistPage />}  />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
      <Toaster theme="dark" />
    </BrowserRouter>
  );
}