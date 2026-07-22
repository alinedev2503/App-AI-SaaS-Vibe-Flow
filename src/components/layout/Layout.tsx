import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { OnboardingModal, useOnboarding } from "../Onboarding";

export function Layout() {
  const { show, close } = useOnboarding();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-8 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      {show && <OnboardingModal onClose={close} />}
    </div>
  );
}
