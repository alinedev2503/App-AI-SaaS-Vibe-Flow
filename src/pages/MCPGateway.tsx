import { 
  Network, 
  Search, 
  Plus, 
  Database, 
  Cloud, 
  RefreshCw, 
  Server, 
  Shield, 
  Lock, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  Code,
  Terminal
} from "lucide-react";

export default function MCPGateway() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">MCP Gateway</h2>
          <p className="text-slate-400 mt-1">Model Context Protocol Integration Hub</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-[#362348] bg-[#261933] text-white text-sm font-bold hover:bg-white/5 transition-all flex items-center gap-2">
            <Terminal className="size-4" />
            View Logs
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            Add Integration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Left Panel: Active Connections */}
        <div className="col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input 
              type="text" 
              className="w-full bg-[#261933] border border-[#362348] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none" 
              placeholder="Search connections..." 
            />
          </div>

          <div className="space-y-4">
            {/* Connection Card 1 */}
            <div className="bg-[#261933] border border-primary/40 rounded-xl p-5 group hover:bg-[#261933]/80 transition-all cursor-pointer ring-1 ring-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Cloud className="text-blue-500 size-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Salesforce CRM</h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Connected • 24ms latency
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Activity className="size-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono bg-background-dark/50 p-3 rounded-lg border border-[#362348]">
                <div className="flex justify-between">
                  <span>Requests/min</span>
                  <span className="text-white">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate</span>
                  <span className="text-emerald-400">0.01%</span>
                </div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-white/5 mt-1">
                  <span>Last Sync</span>
                  <span className="text-white">Just now</span>
                </div>
              </div>
            </div>

            {/* Connection Card 2 */}
            <div className="bg-[#261933] border border-[#362348] rounded-xl p-5 group hover:border-primary/40 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Database className="text-orange-500 size-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">PostgreSQL DB</h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Connected • 12ms latency
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Activity className="size-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono bg-background-dark/50 p-3 rounded-lg border border-[#362348]">
                <div className="flex justify-between">
                  <span>Queries/min</span>
                  <span className="text-white">8,502</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit</span>
                  <span className="text-emerald-400">94%</span>
                </div>
              </div>
            </div>

            {/* Connection Card 3 */}
            <div className="bg-[#261933] border border-[#362348] rounded-xl p-5 group hover:border-primary/40 transition-all cursor-pointer opacity-70">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <RefreshCw className="text-purple-500 size-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">HubSpot API</h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="size-1.5 rounded-full bg-slate-500"></span>
                      Idle • Last active 2h ago
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Activity className="size-4" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization & Config */}
        <div className="col-span-8 flex flex-col gap-6 h-full overflow-hidden">
          {/* Network Graph Visualization */}
          <div className="bg-[#261933] border border-[#362348] rounded-2xl p-8 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            
            {/* Central Node */}
            <div className="relative z-10">
              <div className="size-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(140,43,238,0.4)] border-4 border-[#261933] relative z-20">
                <Network className="text-white size-10" />
              </div>
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Orbiting Nodes */}
            <div className="absolute w-[300px] h-[300px] border border-primary/20 rounded-full animate-spin-slow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#261933] p-2 rounded-full border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Cloud className="text-blue-500 size-5" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#261933] p-2 rounded-full border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Database className="text-orange-500 size-5" />
              </div>
            </div>

            <div className="absolute w-[500px] h-[500px] border border-dashed border-primary/10 rounded-full animate-reverse-spin-slow">
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-[#261933] p-2 rounded-full border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <RefreshCw className="text-purple-500 size-5" />
              </div>
            </div>

            {/* Data Particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ transform: 'translate(-150px, -150px)' }}></div>
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping delay-75" style={{ transform: 'translate(150px, 150px)' }}></div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="flex-1 bg-[#261933] border border-[#362348] rounded-2xl p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Code className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Integration Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Endpoint URL</label>
                  <div className="flex items-center gap-2 bg-background-dark p-3 rounded-lg border border-[#362348]">
                    <span className="text-emerald-400 font-mono text-xs">https://api.salesforce.com/v54.0/</span>
                    <CheckCircle className="text-emerald-500 size-3 ml-auto" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Authentication</label>
                  <div className="flex items-center gap-2 bg-background-dark p-3 rounded-lg border border-[#362348]">
                    <Lock className="text-slate-500 size-3" />
                    <span className="text-white font-mono text-xs">OAuth 2.0 (Bearer Token)</span>
                    <button className="text-primary text-xs font-bold ml-auto hover:underline">Rotate</button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Rate Limits</label>
                  <div className="bg-background-dark p-3 rounded-lg border border-[#362348] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Usage</span>
                      <span className="text-white font-bold">45%</span>
                    </div>
                    <div className="w-full bg-[#362348] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[45%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-slate-500">Reset in 14h 22m</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Permissions</label>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">Read: Contacts</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">Write: Leads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
