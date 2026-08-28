import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Bot, 
  Network, 
  CheckSquare, 
  FileText, 
  Settings, 
  Plus, 
  Sparkles,
  Palette,
  Users,
  CreditCard,
  Home,
  ArrowLeft,
  Code2
} from "lucide-react";
import { getStoredUser } from "../../lib/api/auth";
import { cn } from "@/lib/utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { CodePurchaseModal } from "../CodePurchaseModal";

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const user = getStoredUser();

  const navItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: "/dashboard" },
    { icon: Sparkles, label: t('sidebar.commandCenter'), path: "/command" },
    { icon: Bot, label: t('sidebar.agentHub'), path: "/agents" },
    { icon: Network, label: t('sidebar.mcpGateway'), path: "/mcp" },
    { icon: CheckSquare, label: t('sidebar.approvalQueue'), path: "/approvals", badge: 12 },
    { icon: FileText, label: t('sidebar.auditLogs'), path: "/audit" },
    { icon: Palette, label: t('sidebar.branding'), path: "/branding" },
    { icon: Users, label: "Administração", path: "/admin" },
    { icon: CreditCard, label: "Planos & Código", path: "/checkout" },
    { icon: Settings, label: t('sidebar.settings'), path: "/settings" },
  ];

  const visibleItems = user?.role === "admin" ? navItems : navItems.filter(i => i.path !== "/admin");

  return (
    <>
      <aside className="w-64 border-r border-border-muted bg-background-light dark:bg-background-dark hidden md:flex flex-col h-screen fixed left-0 top-0 z-20">
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-8 bg-gradient-to-br from-primary to-fuchsia-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-all">
              <Sparkles className="size-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Vibe<span className="text-primary">flow</span></h1>
          </Link>
        </div>

        {/* Back to Showcase Link */}
        <div className="px-4 mb-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 text-xs font-bold text-slate-400 hover:text-primary transition-all group"
          >
            <div className="flex items-center gap-2">
              <Home className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Página Inicial / Showcase</span>
            </div>
            <ArrowLeft className="size-3 opacity-60" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group text-sm",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 hover:border-primary/60 text-primary hover:text-primary-light transition-all text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                <span>Adquirir Código</span>
              </div>
              <span className="px-1.5 py-0.5 bg-primary text-white text-[9px] font-black rounded uppercase">
                SaaS
              </span>
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-border-muted">
          <Link to="/agents" className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            {t('agentHub.newAgent')}
          </Link>
        </div>
      </aside>

      <CodePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </>
  );
}
