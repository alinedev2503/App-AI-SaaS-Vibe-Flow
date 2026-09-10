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
  Code2,
  X,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { CodePurchaseModal } from "../CodePurchaseModal";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const { user } = useAuth();

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

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 flex items-center justify-between border-b border-border-muted/50">
        <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2.5 group">
          <div className="size-8 bg-gradient-to-br from-primary to-fuchsia-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-all">
            <Sparkles className="size-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Vibe<span className="text-primary">flow</span>
          </h1>
        </Link>

        {/* Mobile/Tablet Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Back to Showcase / Home Link */}
      <div className="px-4 my-3">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-all group"
        >
          <div className="flex items-center gap-2">
            <Home className="size-4 text-primary group-hover:-translate-x-0.5 transition-transform" />
            <span>Página Inicial / Showcase</span>
          </div>
          <ArrowLeft className="size-3 text-primary opacity-70" />
        </Link>
      </div>
      
      {/* Navigation List */}
      <nav className="flex-1 px-3 sm:px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-sm font-medium min-h-[44px]",
                isActive 
                  ? "bg-primary/15 text-primary font-bold shadow-sm shadow-primary/10" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("size-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-slate-500")} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-primary/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Buy Code CTA inside menu */}
        <div className="pt-3 pb-1">
          <button
            onClick={() => {
              if (onClose) onClose();
              setShowPurchaseModal(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-fuchsia-500/15 border border-primary/30 hover:border-primary/60 text-primary hover:text-primary-light transition-all text-xs font-bold shadow-sm min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-primary" />
              <span>Adquirir Código-Fonte</span>
            </div>
            <span className="px-1.5 py-0.5 bg-primary text-white text-[9px] font-black rounded uppercase">
              SaaS
            </span>
          </button>
        </div>
      </nav>
      
      {/* Footer / Quick Action */}
      <div className="p-4 border-t border-border-muted/50 space-y-2">
        <Link 
          to="/agents" 
          onClick={handleLinkClick}
          className="w-full py-2.5 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 text-xs min-h-[44px]"
        >
          <Plus className="size-4" />
          {t('agentHub.newAgent')}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Permanent Sidebar (lg: screens) ── */}
      <aside className="w-64 border-r border-border-muted hidden lg:flex flex-col h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* ── Mobile & Tablet Drawer (when isOpen is true on < lg screens) ── */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Sliding Drawer Container */}
          <aside 
            role="dialog"
            aria-modal="true"
            aria-label="Menu de Navegação Mobile"
            className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl border-r border-border-muted z-10 animate-in slide-in-from-left duration-300 flex flex-col"
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      <CodePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </>
  );
}
