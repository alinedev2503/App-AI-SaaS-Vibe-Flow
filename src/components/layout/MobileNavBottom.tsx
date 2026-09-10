import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Zap, Bot, CheckSquare, Menu } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface MobileNavBottomProps {
  onOpenMenu: () => void;
  pendingApprovalsCount?: number;
}

export function MobileNavBottom({ onOpenMenu, pendingApprovalsCount = 12 }: MobileNavBottomProps) {
  const location = useLocation();
  const { t } = useLanguage();

  const mainTabs = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Zap, label: "Command", path: "/command" },
    { icon: Bot, label: "Agentes", path: "/agents" },
    { icon: CheckSquare, label: "Aprovações", path: "/approvals", badge: pendingApprovalsCount },
  ];

  return (
    <nav 
      aria-label="Navegação mobile rápida"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-border-muted px-2 py-1 safe-area-pb shadow-2xl"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {mainTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative min-w-[64px] min-h-[48px]",
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-primary active:scale-95"
              )}
            >
              <div className="relative">
                <Icon className={cn("size-5 transition-transform", isActive && "text-primary")} />
                {tab.badge ? (
                  <span className="absolute -top-1 -right-2.5 bg-primary text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm shadow-primary/40 animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none font-medium">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-4 h-0.5 bg-primary rounded-full shadow-sm shadow-primary" />
              )}
            </Link>
          );
        })}

        {/* Menu More / Drawer Trigger */}
        <button
          onClick={onOpenMenu}
          aria-label="Abrir menu completo"
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary active:scale-95 transition-all min-w-[64px] min-h-[48px]"
        >
          <div className="size-5 rounded-md border border-slate-400 dark:border-slate-500 flex items-center justify-center">
            <Menu className="size-3.5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight leading-none font-medium">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
