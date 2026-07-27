import { Search, Bell, ShieldCheck, Home, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="h-16 border-b border-border-muted bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 ml-64 w-[calc(100%-16rem)]">
      <div className="flex items-center gap-4 flex-1">
        {/* Back to Showcase Button */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all shadow-sm shrink-0 group"
          title="Voltar para a Página Inicial / Showcase de Telas"
        >
          <Home className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar ao Showcase</span>
        </Link>

        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-primary/5 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-xs outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500" 
            placeholder={t('header.searchPlaceholder')}
          />
        </div>
        
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider">{t('header.mcpConnected')}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-primary/10 rounded-lg relative transition-colors" title="Notificações">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </button>
        
        <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-primary/10 rounded-lg transition-colors" title="Segurança">
          <ShieldCheck className="size-5" />
        </button>
        
        <div className="h-8 w-[1px] bg-border-muted mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">Alex Rivera</p>
            <p className="text-[11px] text-slate-500 font-medium">{t('header.platformAdmin')}</p>
          </div>
          <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-accent-cyan p-[2px]">
            <div className="w-full h-full rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEDfjRXoeZlHub0rO43nIpQRONGJQ6h2fEPkYsLVlvMNaBey71u8MATZ5jqDxyIIImZE_SnNMgjcxC7OcSurkgcamBOLDmMSDp3xp-Apu2q9f0x6gHxWYv1Il4N-prkBzy1aRcd5UeWpI5EdkpCAsJpzZEA_V8eTHTVZHug4VL9QFfcVYbQp6StmtsBNwASWdWOhPh3n_8tL-aIOChx0-dCNL_pv5m6c_p_7hLgtLubHocGpu558-SPGiXOFDJdhjuh9gY8-rqjYtV" 
                alt="User Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
