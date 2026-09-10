import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavBottom } from "./MobileNavBottom";
import { OnboardingModal, useOnboarding } from "../Onboarding";

export function Layout() {
  const { show, close } = useOnboarding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sidebar with Desktop permanent rail and Mobile/Tablet sliding drawer */}
      <Sidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Responsive Header with Hamburger Menu Toggle */}
      <Header 
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} 
      />

      {/* Main Content Area: Zero margin on mobile/tablet, ml-64 on desktop (lg:) */}
      <main className="w-full lg:ml-64 lg:w-[calc(100%-16rem)] p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-h-[calc(100vh-4rem)] transition-all flex-1">
        <Outlet />
      </main>

      {/* Smartphone Bottom Quick Navigation Bar (< lg:) */}
      <MobileNavBottom 
        onOpenMenu={() => setMobileMenuOpen(true)} 
      />

      {show && <OnboardingModal onClose={close} />}
    </div>
  );
}
