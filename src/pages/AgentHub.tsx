import { 
  Search, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  LayoutGrid, 
  List, 
  DollarSign, 
  FileText, 
  Eye, 
  Mic, 
  Headphones, 
  Globe, 
  MoreVertical, 
  Edit, 
  Brain, 
  Activity, 
  Cloud, 
  Database, 
  CheckCircle,
  Pause,
  Play,
  Filter,
  Plus,
  X,
  Trash2,
  Copy
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import Seo from "@/components/Seo";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "Online" | "Learning" | "Idle" | "Paused";
  icon: any;
  iconColor: string;
  iconBg: string;
  memoryUsage: string;
  memoryTotal: string;
  memoryPercent: number;
  capabilities: any[];
}

const initialAgents: Agent[] = [
  {
    id: "1",
    name: "Especialista em Vendas",
    role: "Prospecção Direta e CRM",
    status: "Online",
    icon: DollarSign,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    memoryUsage: "6.4k",
    memoryTotal: "128k",
    memoryPercent: 15,
    capabilities: [FileText, Eye, Mic]
  },
  {
    id: "2",
    name: "Especialista em Suporte",
    role: "Agente de Sucesso do Cliente",
    status: "Learning",
    icon: Headphones,
    iconColor: "text-slate-400",
    iconBg: "bg-[#362348]",
    memoryUsage: "42k",
    memoryTotal: "128k",
    memoryPercent: 33,
    capabilities: [FileText, Eye]
  },
  {
    id: "3",
    name: "Analista de Pesquisa",
    role: "Motor de Mercado e Tendências",
    status: "Idle",
    icon: Globe,
    iconColor: "text-slate-400",
    iconBg: "bg-[#362348]",
    memoryUsage: "0",
    memoryTotal: "256k",
    memoryPercent: 0,
    capabilities: [FileText, Globe]
  },
  {
    id: "4",
    name: "Analista de Dados",
    role: "Processamento e Visualização",
    status: "Online",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    memoryUsage: "85k",
    memoryTotal: "256k",
    memoryPercent: 33,
    capabilities: [FileText, Database]
  },
  {
    id: "5",
    name: "Especialista em Marketing",
    role: "Criação de Conteúdo e SEO",
    status: "Paused",
    icon: LayoutGrid,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    memoryUsage: "12k",
    memoryTotal: "128k",
    memoryPercent: 9,
    capabilities: [FileText, Eye, Globe]
  },
  {
    id: "6",
    name: "Coordenador de Projetos",
    role: "Gestão de Tarefas e Equipe",
    status: "Online",
    icon: Users,
    iconColor: "text-accent-cyan",
    iconBg: "bg-accent-cyan/10",
    memoryUsage: "24k",
    memoryTotal: "128k",
    memoryPercent: 18,
    capabilities: [FileText, Mic]
  }
];

const allCapabilities = [
  { icon: FileText, label: 'Texto' },
  { icon: Eye, label: 'Visão' },
  { icon: Mic, label: 'Voz' },
  { icon: Globe, label: 'Web' },
  { icon: Database, label: 'Dados' },
];

export default function AgentHub() {
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapabilities, setSelectedCapabilities] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({
    name: "",
    role: "",
    capabilities: [] as any[]
  });

  const toggleCapability = (icon: any) => {
    setSelectedCapabilities(prev => 
      prev.includes(icon) ? prev.filter(c => c !== icon) : [...prev, icon]
    );
  };

  const handleDeleteAgent = (id: string) => {
    const updatedAgents = agents.filter(a => a.id !== id);
    setAgents(updatedAgents);
    if (selectedAgentId === id) {
      setSelectedAgentId(updatedAgents.length > 0 ? updatedAgents[0].id : "");
    }
  };

  const handleDuplicateAgent = (agent: Agent) => {
    const newAgent: Agent = {
      ...agent,
      id: Date.now().toString(),
      name: `${agent.name} (Copy)`,
      status: "Idle"
    };
    setAgents([...agents, newAgent]);
    setSelectedAgentId(newAgent.id);
  };

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCapabilities = selectedCapabilities.length === 0 || 
                                  selectedCapabilities.every(cap => agent.capabilities.includes(cap));

      return matchesSearch && matchesCapabilities;
    });
  }, [agents, searchQuery, selectedCapabilities]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || filteredAgents[0] || agents[0];

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === "Online" ? "Paused" : "Online";
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "bg-emerald-500/10 text-emerald-400";
      case "Learning": return "bg-blue-500/10 text-blue-400";
      case "Idle": return "bg-slate-500/10 text-slate-400";
      case "Paused": return "bg-yellow-500/10 text-yellow-400";
      default: return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <>
      <Seo title={t('agentHub.title') + " — VibeFlow"} />
      <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-white">{t('agentHub.title')}</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border-none rounded-lg pl-9 py-2 text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary h-9 bg-[#261933]" 
                  placeholder={t('agentHub.searchPlaceholder')} 
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all",
                  showFilters || selectedCapabilities.length > 0
                    ? "bg-primary text-white" 
                    : "bg-[#261933] text-slate-400 hover:text-white"
                )}
              >
                <Filter className="size-4" />
                {t('agentHub.filters')} {selectedCapabilities.length > 0 && `(${selectedCapabilities.length})`}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCreatingAgent(true)} 
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus className="size-4" />
              {t('agentHub.newAgent')}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-[#261933] border border-[#362348] rounded-xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('agentHub.filterByCapabilities')}</span>
            <div className="flex flex-wrap gap-2">
              {allCapabilities.map((cap, idx) => {
                const isSelected = selectedCapabilities.includes(cap.icon);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCapability(cap.icon)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      isSelected 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-background-dark border-[#362348] text-slate-400 hover:border-primary/50 hover:text-white"
                    )}
                  >
                    <cap.icon className="size-3.5" />
                    {cap.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Global Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8 shrink-0">
          <div className="bg-surface border border-border-muted rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group bg-[#261933] border-[#362348]">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Users className="size-10 text-primary" />
            </div>
            <p className="text-slate-400 text-sm font-medium">{t('agentHub.totalActive')}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{agents.filter(a => a.status === "Online").length}</span>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="size-3" />+4%
              </span>
            </div>
          </div>
          
          <div className="bg-surface border border-border-muted rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group bg-[#261933] border-[#362348]">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <CheckCircle className="size-10 text-primary" />
            </div>
            <p className="text-slate-400 text-sm font-medium">{t('agentHub.successRate')}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">99.2%</span>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="size-3" />+0.5%
              </span>
            </div>
          </div>
          
          <div className="bg-surface border border-border-muted rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group bg-[#261933] border-[#362348]">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Activity className="size-10 text-primary" />
            </div>
            <p className="text-slate-400 text-sm font-medium">{t('agentHub.avgLatency')}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">240ms</span>
              <span className="text-orange-400 text-xs font-bold bg-orange-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingDown className="size-3" />-12%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
          {/* Agent Grid */}
          <div className="col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{t('agentHub.activeWorkers')}</h3>
              <div className="flex gap-2">
                <button className="size-8 rounded bg-primary/20 text-primary flex items-center justify-center">
                  <LayoutGrid className="size-4" />
                </button>
                <button className="size-8 rounded bg-[#261933] text-slate-400 flex items-center justify-center">
                  <List className="size-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {filteredAgents.length > 0 ? filteredAgents.map((agent) => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={cn(
                    "bg-[#261933] border rounded-xl p-4 flex flex-col gap-4 cursor-pointer transition-all",
                    selectedAgentId === agent.id 
                      ? "border-primary/60 ring-1 ring-primary/20 bg-[#261933]/80" 
                      : "border-[#362348] hover:border-primary/40"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "size-12 rounded-lg flex items-center justify-center border",
                      agent.iconBg,
                      selectedAgentId === agent.id ? "border-primary/30" : "border-transparent"
                    )}>
                      <agent.icon className={cn("size-6", agent.iconColor)} />
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                      getStatusColor(agent.status)
                    )}>
                      {agent.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{agent.name}</h4>
                    <p className="text-slate-400 text-xs">{agent.role}</p>
                  </div>
                  <div className="flex gap-2">
                    {agent.capabilities.map((Cap, i) => (
                      <span key={i} className="text-primary bg-primary/10 p-1 rounded">
                        <Cap className="size-3" />
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{t('agentHub.memoryUsage')}</span>
                      <span className="text-white">{agent.memoryUsage} / {agent.memoryTotal}</span>
                    </div>
                    <div className="w-full bg-background-dark h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500" 
                        style={{ width: `${agent.memoryPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-slate-400">
                  <Search className="size-8 mb-4 opacity-20" />
                  <p className="text-sm">{t('agentHub.noAgentsFound')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Agent Detail Panel */}
          <div className="col-span-5 bg-[#261933] border border-[#362348] rounded-2xl overflow-hidden flex flex-col h-full">
            {selectedAgent ? (
              <>
                <div className="p-6 border-b border-[#362348] bg-gradient-to-r from-primary/10 to-transparent shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
                        <selectedAgent.icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base leading-none">{selectedAgent.name}</h3>
                        <p className="text-primary text-[10px] font-semibold uppercase tracking-widest mt-1">
                          {t('agentHub.status')}: {selectedAgent.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"><Edit className="size-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"><MoreVertical className="size-4" /></button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {/* Identity & Persona */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Brain className="text-primary size-5" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('agentHub.identityPersona')}</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('agentHub.primaryObjective')}</label>
                        <div className="p-2.5 bg-background-dark rounded border border-[#362348] text-xs text-slate-100">
                          {selectedAgent.role} - Impulsionar a geração de leads qualificados através de prospecção hiper-personalizada.
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('agentHub.interactionTone')}</label>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-full border border-primary bg-primary/20 text-white text-[10px] font-bold">Profissional</button>
                          <button className="px-3 py-1.5 rounded-full border border-[#362348] bg-background-dark text-slate-400 text-[10px] font-bold hover:border-primary transition-all">Empático</button>
                          <button className="px-3 py-1.5 rounded-full border border-[#362348] bg-background-dark text-slate-400 text-[10px] font-bold hover:border-primary transition-all">Persuasivo</button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Cognitive Settings */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Brain className="text-primary size-5" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('agentHub.cognitiveSettings')}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background-dark rounded border border-[#362348]">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{t('agentHub.longTermMemory')}</span>
                          <span className="text-[10px] text-slate-400">{t('agentHub.longTermMemoryDesc')}</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-[#362348] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background-dark rounded border border-[#362348]">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{t('agentHub.contextPersistence')}</span>
                          <span className="text-[10px] text-slate-400">{t('agentHub.contextPersistenceDesc')}</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-[#362348] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Multimodal Controls */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="text-primary size-5" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('agentHub.multimodalControls')}</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">V2 Alpha</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background-dark rounded border border-[#362348]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{t('agentHub.voiceLatency')}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-white">180</span>
                          <span className="text-[10px] text-slate-400">ms</span>
                        </div>
                        <div className="w-full h-1 bg-surface rounded-full mt-2">
                          <div className="bg-primary h-full rounded-full w-[25%]"></div>
                        </div>
                      </div>
                      <div className="p-3 bg-background-dark rounded border border-[#362348]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{t('agentHub.audioSynthesis')}</p>
                        <span className="text-xs font-medium text-white block">Nova-HD Ultra</span>
                        <span className="text-[9px] text-slate-400">Alta fidelidade 48kHz</span>
                      </div>
                    </div>
                  </section>

                  {/* MCP Tool Access */}
                  <section className="space-y-4 pb-4">
                    <div className="flex items-center gap-2">
                      <Database className="text-primary size-5" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('agentHub.mcpAccess')}</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-[#362348] group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-surface flex items-center justify-center border border-[#362348]">
                            <Cloud className="text-blue-400 size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Salesforce</p>
                            <p className="text-[10px] text-slate-400">Acesso de Leitura/Escrita CRM</p>
                          </div>
                        </div>
                        <CheckCircle className="text-emerald-400 size-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-[#362348] group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-surface flex items-center justify-center border border-[#362348] text-orange-400">
                            <Database className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">HubSpot</p>
                            <p className="text-[10px] text-slate-400">Automação de Marketing</p>
                          </div>
                        </div>
                        <CheckCircle className="text-emerald-400 size-4" />
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="p-4 bg-background-dark/80 backdrop-blur border-t border-[#362348] mt-auto shrink-0">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button 
                      onClick={() => toggleAgentStatus(selectedAgent.id)}
                      className="py-2.5 rounded-lg border border-[#362348] text-white text-xs font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      {selectedAgent.status === "Online" ? <Pause className="size-4" /> : <Play className="size-4" />}
                      {selectedAgent.status === "Online" ? t('agentHub.pauseAgent') : t('agentHub.resumeAgent')}
                    </button>
                    <button className="py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                      <Play className="size-4" /> {t('agentHub.deployUpdates')}
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#362348]/50">
                    <button 
                      onClick={() => handleDuplicateAgent(selectedAgent)} 
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="size-3.5"/> {t('agentHub.duplicateAgent')}
                    </button>
                    <button 
                      onClick={() => handleDeleteAgent(selectedAgent.id)} 
                      className="text-xs text-red-500/70 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="size-3.5"/> {t('agentHub.deleteAgent')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <Brain className="size-12 mb-4 opacity-20" />
                <p className="text-sm">{t('agentHub.selectAgent')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Agent Modal */}
      {isCreatingAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#261933] border border-[#362348] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#362348] flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{t('agentHub.createAgentTitle')}</h3>
              <button onClick={() => setIsCreatingAgent(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('agentHub.agentName')}</label>
                <input 
                  type="text" 
                  value={newAgentForm.name}
                  onChange={e => setNewAgentForm({...newAgentForm, name: e.target.value})}
                  className="w-full bg-background-dark border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Ex: Assistente de Marketing"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('agentHub.agentRole')}</label>
                <input 
                  type="text" 
                  value={newAgentForm.role}
                  onChange={e => setNewAgentForm({...newAgentForm, role: e.target.value})}
                  className="w-full bg-background-dark border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Ex: Criar campanhas de email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('agentHub.capabilities')}</label>
                <div className="flex flex-wrap gap-2">
                  {allCapabilities.map((cap, idx) => {
                    const isSelected = newAgentForm.capabilities.includes(cap.icon);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setNewAgentForm(prev => ({
                            ...prev,
                            capabilities: isSelected 
                              ? prev.capabilities.filter(c => c !== cap.icon)
                              : [...prev.capabilities, cap.icon]
                          }))
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                          isSelected 
                            ? "bg-primary/20 border-primary text-primary" 
                            : "bg-background-dark border-[#362348] text-slate-400 hover:border-primary/50 hover:text-white"
                        )}
                      >
                        <cap.icon className="size-3.5" />
                        {cap.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#362348] flex justify-end gap-3 bg-background-dark/50">
              <button 
                onClick={() => setIsCreatingAgent(false)}
                className="px-4 py-2 rounded-lg border border-[#362348] text-white text-sm font-bold hover:bg-white/5 transition-all"
              >
                {t('agentHub.cancel')}
              </button>
              <button 
                onClick={() => {
                  if (!newAgentForm.name || !newAgentForm.role) return;
                  const newAgent: Agent = {
                    id: Date.now().toString(),
                    name: newAgentForm.name,
                    role: newAgentForm.role,
                    status: "Idle",
                    icon: Brain,
                    iconColor: "text-purple-400",
                    iconBg: "bg-purple-500/10",
                    memoryUsage: "0",
                    memoryTotal: "128k",
                    memoryPercent: 0,
                    capabilities: newAgentForm.capabilities.length > 0 ? newAgentForm.capabilities : [FileText]
                  };
                  setAgents([...agents, newAgent]);
                  setSelectedAgentId(newAgent.id);
                  setIsCreatingAgent(false);
                  setNewAgentForm({ name: "", role: "", capabilities: [] });
                }}
                disabled={!newAgentForm.name || !newAgentForm.role}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('agentHub.createAgent')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

