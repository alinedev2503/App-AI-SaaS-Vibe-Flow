import { 
  Calendar, 
  Download, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Mic, 
  Shield, 
  CheckCircle, 
  DollarSign, 
  Headphones, 
  Globe, 
  Cloud, 
  Database, 
  RefreshCw, 
  Gavel, 
  Brain, 
  Cpu,
  Check,
  X
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Operations & Observability Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time system health and agent orchestration monitoring.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-primary/20 bg-white dark:bg-card-dark text-sm font-semibold flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <Calendar className="size-4" />
            Last 24 Hours
          </button>
          <button className="px-4 py-2 rounded-lg border border-primary/20 bg-white dark:bg-card-dark text-sm font-semibold flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <Download className="size-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Zap className="size-6" />
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
              +12.5% <TrendingUp className="size-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Agent Tasks (24h)</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">12,842</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-accent-cyan/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-accent-cyan/20 text-accent-cyan">
              <Mic className="size-6" />
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
              -15% <TrendingDown className="size-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Voice Latency</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">420ms</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-orange-500/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
              <Shield className="size-6" />
            </div>
            <span className="text-orange-500 text-xs font-bold">3-Layer Active</span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Security Blocks</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">142</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
              <CheckCircle className="size-6" />
            </div>
            <span className="text-emerald-500 text-xs font-bold">+0.1%</span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Success Rate</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">99.8%</h3>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status Matrix */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Agent Status Matrix</h3>
            <div className="flex gap-4 text-xs font-medium uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Processing</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Idle</span>
            </div>
          </div>
          <div className="flex-1 p-6 space-y-6">
            {/* Sales Agent */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <DollarSign className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Sales Agent</p>
                    <p className="text-xs text-slate-500">Handling 4 concurrent threads</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">Active</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="flex gap-2"><span className="text-primary opacity-60">12:45:01</span> [THREAD-04] Processing outbound inquiry for SKU-882...</div>
                <div className="flex gap-2"><span className="text-primary opacity-60">12:45:08</span> [THREAD-02] CRM sync complete for Lead #9921...</div>
              </div>
            </div>

            {/* Support Agent */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Headphones className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Support Agent</p>
                    <p className="text-xs text-slate-500">Resolving ticket #1042-X</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">Processing</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="flex gap-2"><span className="text-primary opacity-60">12:44:55</span> [MCP] Fetching historical logs from Internal DB...</div>
                <div className="flex gap-2"><span className="text-primary opacity-60">12:45:10</span> [LLM] Generating resolution response via Semantic Layer...</div>
              </div>
            </div>

            {/* Research Agent */}
            <div className="space-y-3">
              <div className="flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                    <Globe className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Research Agent</p>
                    <p className="text-xs text-slate-500">Last run 2h ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold uppercase">Idle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MCP Integration Hub */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/10">
            <h3 className="font-bold text-lg text-white">MCP Integration Hub</h3>
          </div>
          <div className="flex-1 p-6 relative flex flex-col justify-center items-center">
            {/* Visual Data Flow Map */}
            <div className="relative py-8 w-full">
              <div className="flex flex-col items-center gap-12">
                {/* Source nodes */}
                <div className="grid grid-cols-3 gap-4 w-full px-2">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                      <Cloud className="text-primary size-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Salesforce</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                      <Database className="text-primary size-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Internal DB</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                      <RefreshCw className="text-primary size-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Hubspot</span>
                  </div>
                </div>

                {/* Hub Center */}
                <div className="relative">
                  <div className="absolute -inset-8 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white z-10 relative shadow-[0_0_20px_rgba(140,43,238,0.5)]">
                    <RefreshCw className="size-8 animate-spin-slow" />
                  </div>
                </div>

                {/* Target */}
                <div className="flex flex-col items-center gap-2">
                  <div className="px-6 py-2 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan font-bold text-xs">
                    AETHER CORE AGENTS
                  </div>
                </div>
              </div>
              
              {/* Decorative lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full -z-0 pointer-events-none opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
                <path d="M70,80 Q70,160 200,160" fill="none" stroke="#8c2bee" strokeWidth="2" />
                <path d="M200,80 Q200,160 200,160" fill="none" stroke="#8c2bee" strokeWidth="2" />
                <path d="M330,80 Q330,160 200,160" fill="none" stroke="#8c2bee" strokeWidth="2" />
                <path d="M200,160 L200,240" fill="none" stroke="#8c2bee" strokeWidth="2" />
              </svg>
            </div>

            <div className="mt-6 space-y-2 w-full">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Flow Rate</span>
                <span className="text-white font-bold">1.2 GB/sec</span>
              </div>
              <div className="w-full bg-primary/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Queue */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2 text-white">
              Approval Queue 
              <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">12 Pending</span>
            </h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-primary/10 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Approve Refund over $500</p>
                  <p className="text-xs text-slate-500">Requested by Customer Support Agent • 2m ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">
                  <Check className="size-4" />
                </button>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30">
                  <X className="size-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-primary/10 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                  <RefreshCw className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Update CRM Lead Status</p>
                  <p className="text-xs text-slate-500">Requested by Sales Agent • 14m ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">
                  <Check className="size-4" />
                </button>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Insights */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/10">
            <h3 className="font-bold text-lg text-white">3-Layer Defense Visualization</h3>
          </div>
          <div className="p-6 space-y-6 flex-1 flex flex-col justify-center">
            <div className="relative space-y-4">
              {/* Layer 1 */}
              <div className="relative overflow-hidden p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 group cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gavel className="text-emerald-500 size-5" />
                    <div>
                      <p className="font-bold text-sm text-white">Layer 1: Deterministic Rules</p>
                      <p className="text-[11px] text-slate-500">Fixed constraints & policy enforcement</p>
                    </div>
                  </div>
                  <span className="text-emerald-500 text-xs font-black">94 BLOCKED</span>
                </div>
                <div className="mt-3 w-full bg-emerald-500/10 h-1 rounded-full">
                  <div className="bg-emerald-500 h-full w-full rounded-full"></div>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="relative overflow-hidden p-4 rounded-xl border border-primary/30 bg-primary/5 group cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="text-primary size-5" />
                    <div>
                      <p className="font-bold text-sm text-white">Layer 2: ML Anomaly Detection</p>
                      <p className="text-[11px] text-slate-500">Pattern recognition & behavioral analysis</p>
                    </div>
                  </div>
                  <span className="text-primary text-xs font-black">38 BLOCKED</span>
                </div>
                <div className="mt-3 w-full bg-primary/10 h-1 rounded-full">
                  <div className="bg-primary h-full w-[40%] rounded-full"></div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="relative overflow-hidden p-4 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 group cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-accent-cyan size-5" />
                    <div>
                      <p className="font-bold text-sm text-white">Layer 3: Semantic Firewall</p>
                      <p className="text-[11px] text-slate-500">LLM intent analysis & prompt injection guard</p>
                    </div>
                  </div>
                  <span className="text-accent-cyan text-xs font-black">10 BLOCKED</span>
                </div>
                <div className="mt-3 w-full bg-accent-cyan/10 h-1 rounded-full">
                  <div className="bg-accent-cyan h-full w-[15%] rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 italic mt-4">Security layers auto-scale based on threat vector intensity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
