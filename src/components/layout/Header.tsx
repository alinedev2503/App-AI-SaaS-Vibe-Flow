import { Search, Bell, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-primary/10 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 ml-64 w-[calc(100%-16rem)]">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-primary/5 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500" 
            placeholder="Search agents, tasks, or logs..." 
          />
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">MCP Connected</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-primary/10 rounded-lg relative transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
        </button>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-primary/10 rounded-lg transition-colors">
          <ShieldCheck className="size-5" />
        </button>
        
        <div className="h-8 w-[1px] bg-primary/10 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">Alex Rivera</p>
            <p className="text-[11px] text-slate-500 font-medium">Platform Admin</p>
          </div>
          <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-accent-cyan p-[2px]">
            <div className="w-full h-full rounded-full bg-background-dark flex items-center justify-center overflow-hidden">
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
