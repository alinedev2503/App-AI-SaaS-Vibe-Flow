import { 
  CheckSquare, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  DollarSign, 
  FileText, 
  User, 
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function ApprovalQueue() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Approval Queue</h2>
          <p className="text-slate-400 mt-1">Human-in-the-loop oversight for critical agent actions.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-[#261933] px-4 py-2 rounded-lg border border-[#362348]">
            <span className="text-slate-400 text-sm font-bold">Pending:</span>
            <span className="text-primary font-bold text-lg">12</span>
          </div>
          <div className="flex items-center gap-2 bg-[#261933] px-4 py-2 rounded-lg border border-[#362348]">
            <span className="text-slate-400 text-sm font-bold">Avg. Time:</span>
            <span className="text-emerald-400 font-bold text-lg">4m 32s</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input 
            type="text" 
            className="w-full bg-[#261933] border border-[#362348] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none" 
            placeholder="Search by ID, Agent, or Action..." 
          />
        </div>
        <button className="px-4 py-3 rounded-xl bg-[#261933] border border-[#362348] text-slate-400 hover:text-white hover:border-primary/50 transition-all flex items-center gap-2">
          <Filter className="size-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-[#261933] border border-[#362348] rounded-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] bg-background-dark/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Agent</div>
          <div className="col-span-3">Action Type</div>
          <div className="col-span-2">Risk Level</div>
          <div className="col-span-2">Time in Queue</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] hover:bg-white/5 transition-colors items-center group cursor-pointer">
            <div className="col-span-1 font-mono text-xs text-slate-500">#REQ-8821</div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="size-6 rounded bg-primary/20 flex items-center justify-center text-primary">
                <DollarSign className="size-3" />
              </div>
              <span className="text-sm font-bold text-white">Sales Agent</span>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-white font-medium">Approve Refund {'>'} $500</p>
              <p className="text-xs text-slate-500">Customer: Acme Corp</p>
            </div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase border border-orange-500/20 flex items-center gap-1 w-fit">
                <AlertTriangle className="size-3" /> High Risk
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="size-3" />
              <span>2m 14s</span>
            </div>
            <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/20">
                <CheckCircle className="size-4" />
              </button>
              <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/20">
                <XCircle className="size-4" />
              </button>
              <button className="p-2 rounded-lg bg-background-dark text-slate-400 hover:text-white border border-[#362348]">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] hover:bg-white/5 transition-colors items-center group cursor-pointer">
            <div className="col-span-1 font-mono text-xs text-slate-500">#REQ-8820</div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="size-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-500">
                <MessageSquare className="size-3" />
              </div>
              <span className="text-sm font-bold text-white">Support Agent</span>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-white font-medium">Escalate Ticket #992</p>
              <p className="text-xs text-slate-500">Reason: Sentiment Negative</p>
            </div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase border border-yellow-500/20 flex items-center gap-1 w-fit">
                <AlertTriangle className="size-3" /> Medium Risk
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="size-3" />
              <span>5m 42s</span>
            </div>
            <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/20">
                <CheckCircle className="size-4" />
              </button>
              <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/20">
                <XCircle className="size-4" />
              </button>
              <button className="p-2 rounded-lg bg-background-dark text-slate-400 hover:text-white border border-[#362348]">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] hover:bg-white/5 transition-colors items-center group cursor-pointer">
            <div className="col-span-1 font-mono text-xs text-slate-500">#REQ-8819</div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="size-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-500">
                <FileText className="size-3" />
              </div>
              <span className="text-sm font-bold text-white">Legal Agent</span>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-white font-medium">Publish Contract Draft</p>
              <p className="text-xs text-slate-500">Client: TechStart Inc.</p>
            </div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase border border-red-500/20 flex items-center gap-1 w-fit">
                <AlertTriangle className="size-3" /> Critical Risk
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="size-3" />
              <span>12m 05s</span>
            </div>
            <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/20">
                <CheckCircle className="size-4" />
              </button>
              <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/20">
                <XCircle className="size-4" />
              </button>
              <button className="p-2 rounded-lg bg-background-dark text-slate-400 hover:text-white border border-[#362348]">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#362348] flex items-center justify-between bg-background-dark/30">
          <span className="text-xs text-slate-500">Showing 1-3 of 12 requests</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-[#362348] text-slate-400 text-xs hover:bg-white/5 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 rounded-lg border border-[#362348] text-slate-400 text-xs hover:bg-white/5">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
