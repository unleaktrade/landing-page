import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { MotionConfig } from "motion/react";
import { Navigation } from "./components/Navigation";
import { WarpField } from "./components/WarpField";
import { Hero } from "./components/Hero";
import { ValueProps } from "./components/ValueProps";
import { HowItWorks } from "./components/HowItWorks";
import { Shorts } from "./components/Shorts";
import { SettlementProcess } from "./components/SettlementProcess";
import { Economics } from "./components/Economics";
import { TeamSection } from "./components/TeamSection";
import { TeamPage } from "./components/TeamPage";
import { BuilderPage } from "./components/BuilderPage";
import { Roadmap } from "./components/Roadmap";
import { FAQ } from "./components/FAQ";
import { CommunityCTA } from "./components/CommunityCTA";
import { Footer } from "./components/Footer";
import { WorkInProgress } from "./components/WorkInProgress";
import { WaitlistPage } from "./components/WaitlistPage";
import { ActivateWaitlist } from "./components/ActivateWaitlist";
import { LazyWaitlistDialog } from "./components/LazyDialogs";
import { Toaster } from "sonner";
import { Seo } from "./seo/Seo";

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
    <div className="min-h-screen text-white">
      <Navigation />
      <main>
        <Hero onOpenWaitlist={onOpenWaitlist} />
        <ValueProps />
        <HowItWorks />
        <Shorts />
        <SettlementProcess />
        <Economics />
        {/* <TeamSection /> */}
        <CommunityCTA />
      </main>
      <Footer />
    </div>
  );
}

function RoadmapPage() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <main>
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}

function TeamPageWrapper() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <main>
        <TeamPage />
      </main>
      <Footer />
    </div>
  );
}

function WorkInProgressPage() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <WorkInProgress />
    </div>
  );
}

function ActivateWaitlistPage() {
  return (
    <main className="min-h-screen text-white">
      <ActivateWaitlist />
    </main>
  );
}

function FAQPage() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <main>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

function BuilderPageWrapper() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <main>
        <BuilderPage />
      </main>
      <Footer />
    </div>
  );
}

function WaitlistRoutePage() {
  return (
    <main>
      <WaitlistPage />
    </main>
  );
}

/**
 * Everything below the router. The browser mounts it in a BrowserRouter
 * (App, below); the build-time prerender mounts it in a StaticRouter
 * (entry-server.tsx).
 */
export function AppRoutes() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    // Every motion/react animation honours prefers-reduced-motion.
    <MotionConfig reducedMotion="user">
      <WarpField />
      <ScrollToTop />
      <Seo />
      <Routes>
        <Route path="/" element={<HomePage onOpenWaitlist={() => setIsWaitlistOpen(true)} />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/team" element={<TeamPageWrapper />} />
        <Route path="/team/:memberId" element={<TeamPageWrapper />} />
        <Route path="/waitlist" element={<WaitlistRoutePage />} />
        <Route path="/waitlist/:sponsor" element={<WaitlistRoutePage />} />
        <Route path="/activate/:token" element={<ActivateWaitlistPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/app" element={<WaitlistRoutePage />} />
        <Route path="/builder" element={<BuilderPageWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LazyWaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
      <Toaster theme="dark" />
    </MotionConfig>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
