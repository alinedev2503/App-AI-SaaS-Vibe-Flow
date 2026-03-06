import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Terminal
} from "lucide-react";

export default function AuditLogs() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Logs de Auditoria</h2>
          <p className="text-slate-400 mt-1">Registros abrangentes de atividade e segurança do sistema.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-[#362348] bg-[#261933] text-slate-400 text-sm font-bold hover:bg-white/5 hover:text-white transition-all flex items-center gap-2">
            <Download className="size-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input 
            type="text" 
            className="w-full bg-[#261933] border border-[#362348] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none" 
            placeholder="Buscar logs por ID de Evento, Usuário ou Ação..." 
          />
        </div>
        <button className="px-4 py-3 rounded-xl bg-[#261933] border border-[#362348] text-slate-400 hover:text-white hover:border-primary/50 transition-all flex items-center gap-2">
          <Filter className="size-4" />
          <span>Filtros</span>
        </button>
        <button className="px-4 py-3 rounded-xl bg-[#261933] border border-[#362348] text-slate-400 hover:text-white hover:border-primary/50 transition-all flex items-center gap-2">
          <Clock className="size-4" />
          <span>Intervalo de Tempo</span>
        </button>
      </div>

      <div className="flex-1 bg-[#261933] border border-[#362348] rounded-2xl overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] bg-background-dark/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Carimbo de Data/Hora</div>
          <div className="col-span-2">ID do Evento</div>
          <div className="col-span-2">Ator</div>
          <div className="col-span-3">Ação</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Detalhes</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] hover:bg-white/5 transition-colors items-center group">
            <div className="col-span-2 text-xs text-slate-400 font-mono">2023-10-24 14:32:01</div>
            <div className="col-span-2 text-xs text-slate-500 font-mono">EVT-99281</div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">AR</div>
              <span className="text-sm font-medium text-white">Alex Rivera</span>
            </div>
            <div className="col-span-3 text-sm text-slate-300">Configuração do Agente "Especialista em Vendas" atualizada</div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20 flex items-center gap-1 w-fit">
                <CheckCircle className="size-3" /> Sucesso
              </span>
            </div>
            <div className="col-span-1 text-right">
              <button className="text-primary hover:text-white transition-colors"><Terminal className="size-4 ml-auto" /></button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] hover:bg-white/5 transition-colors items-center group">
            <div className="col-span-2 text-xs text-slate-400 font-mono">2023-10-24 14:30:45</div>
            <div className="col-span-2 text-xs text-slate-500 font-mono">EVT-99280</div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="size-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-[10px] font-bold">SYS</div>
              <span className="text-sm font-medium text-white">Sistema (Auto)</span>
            </div>
            <div className="col-span-3 text-sm text-slate-300">Chaves de API rotacionadas para Integração Salesforce</div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20 flex items-center gap-1 w-fit">
                <CheckCircle className="size-3" /> Sucesso
              </span>
            </div>
            <div className="col-span-1 text-right">
              <button className="text-primary hover:text-white transition-colors"><Terminal className="size-4 ml-auto" /></button>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#362348] hover:bg-white/5 transition-colors items-center group">
            <div className="col-span-2 text-xs text-slate-400 font-mono">2023-10-24 14:15:22</div>
            <div className="col-span-2 text-xs text-slate-500 font-mono">EVT-99279</div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-[10px] font-bold">EXT</div>
              <span className="text-sm font-medium text-white">IP Externo</span>
            </div>
            <div className="col-span-3 text-sm text-slate-300">Tentativa de login falha (3x)</div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase border border-red-500/20 flex items-center gap-1 w-fit">
                <AlertCircle className="size-3" /> Bloqueado
              </span>
            </div>
            <div className="col-span-1 text-right">
              <button className="text-primary hover:text-white transition-colors"><Terminal className="size-4 ml-auto" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
