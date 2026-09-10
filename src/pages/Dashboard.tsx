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
  X,
  Sparkles,
  Code2,
  MessageCircle,
  ArrowRight,
  Bot,
  Palette,
  Network,
  CheckSquare,
  FileText,
  Layers,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Seo from "@/components/Seo";
import { CodePurchaseModal } from "@/components/CodePurchaseModal";
import { AiApiKeyConfig } from "@/components/AiApiKeyConfig";
import { NotificationPermissionModal } from "@/components/NotificationPermissionModal";
import { getNotificationPermissionStatus, isPushSupported } from "@/lib/pushNotifications";
import { secureStorage } from "@/lib/secureStorage";

export default function Dashboard() {
  const { t } = useLanguage();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  useEffect(() => {
    // Check if notification prompt should be displayed on first dashboard visit
    const dismissed = secureStorage.getItem<string>("vibeflow_notif_prompt_dismissed");
    if (!dismissed && isPushSupported()) {
      const currentPerm = getNotificationPermissionStatus();
      if (currentPerm !== "granted") {
        const timer = setTimeout(() => {
          setShowNotifModal(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <>
      <Seo title={t('dashboard.title')} description="Visão geral dos KPIs, agentes e saúde da plataforma VibeFlow." />
      <div className="space-y-8">
        {/* Arquiteto MVP Promotion Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-fuchsia-900/30 to-[#1e1030] border border-primary/40 p-6 sm:p-7 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 border border-primary/40 text-primary-light text-xs font-black uppercase tracking-wider">
                <Sparkles className="size-3.5 text-amber-300" />
                <span>Produto Aline DEV • Diagnóstico de Viabilidade</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Arquiteto MVP (Diagnóstico de Viabilidade)
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Descreva sua ideia de aplicativo e gere instantaneamente um diagnóstico completo com <strong>Conceito, Funcionalidades, Escopo do MVP, Modelagem de Banco de Dados e Fluxo de Usuário</strong>. Resultado exportável em PDF e salvo no seu perfil por apenas <strong className="text-emerald-400 font-black">R$ 52,00</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://pay.hotmart.com/D102306576L"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/90 hover:to-fuchsia-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary/30 transition-all hover:scale-105 border border-primary/50"
              >
                <Sparkles className="size-4" />
                <span>Garantir Arquiteto MVP (R$ 52,00)</span>
                <ArrowRight className="size-4" />
              </a>

              <a
                href="https://affiliate.hotmart.com/affiliate-recruiting/view/3248I102306597"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <ExternalLink className="size-4" />
                <span>Programa de Afiliados</span>
              </a>
            </div>
          </div>

          {/* Flow & features chips */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Recursos & Fluxo:</span>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5">
              <FileText className="size-3 text-primary" />
              <span>Blueprint & Diagnóstico de Negócio</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Database className="size-3 text-cyan-400" />
              <span>Modelagem de Banco de Dados</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Layers className="size-3 text-amber-400" />
              <span>Escopo do MVP & Fluxo de Usuário</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Download className="size-3 text-emerald-400" />
              <span>Download em PDF & Salvo no Perfil</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Shield className="size-3 text-fuchsia-400" />
              <span>Limite: 1 geração a cada 48h</span>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-primary/20 bg-white dark:bg-card-dark text-sm font-semibold flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <Calendar className="size-4" />
            {t('dashboard.last24Hours')}
          </button>
          <button className="px-4 py-2 rounded-lg border border-primary/20 bg-white dark:bg-card-dark text-sm font-semibold flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <Download className="size-4" />
            {t('dashboard.exportData')}
          </button>
        </div>
      </div>

      {/* AI Key Configuration Widget for BYOK Marketplaces */}
      <AiApiKeyConfig />

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
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('dashboard.activeAgents')}</p>
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
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('dashboard.avgResponseTime')}</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">420ms</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-orange-500/50 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
              <Shield className="size-6" />
            </div>
            <span className="text-orange-500 text-xs font-bold">{t('dashboard.activeLayers')}</span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('dashboard.systemHealth')}</p>
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
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('dashboard.tasksCompleted')}</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">99.8%</h3>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status Matrix */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('dashboard.agentStatusMatrix')}</h3>
            <div className="flex gap-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t('dashboard.active')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> {t('dashboard.processing')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span> {t('dashboard.idle')}</span>
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
                    <p className="font-bold text-slate-900 dark:text-white">{t('dashboard.salesAgent')}</p>
                    <p className="text-xs text-slate-500">{t('dashboard.salesAgentDesc')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">{t('dashboard.active')}</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex gap-2"><span className="text-primary opacity-60">12:45:01</span> [THREAD-04] Processando consulta de saída para SKU-882...</div>
                <div className="flex gap-2"><span className="text-primary opacity-60">12:45:08</span> [THREAD-02] Sincronização de CRM concluída para Lead #9921...</div>
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
                    <p className="font-bold text-slate-900 dark:text-white">{t('dashboard.supportAgent')}</p>
                    <p className="text-xs text-slate-500">{t('dashboard.supportAgentDesc')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">{t('dashboard.processing')}</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex gap-2"><span className="text-primary opacity-60">12:44:55</span> [MCP] Buscando logs históricos do DB Interno...</div>
                <div className="flex gap-2"><span className="text-primary opacity-60">12:45:10</span> [LLM] Gerando resposta de resolução via Camada Semântica...</div>
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
                    <p className="font-bold text-slate-900 dark:text-white">{t('dashboard.researchAgent')}</p>
                    <p className="text-xs text-slate-500">{t('dashboard.researchAgentDesc')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold uppercase">{t('dashboard.idle')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MCP Integration Hub */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/10">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('dashboard.mcpIntegrationHub')}</h3>
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
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t('dashboard.internalDb')}</span>
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
                    {t('dashboard.mainAgents')}
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
                <span className="text-slate-500">{t('dashboard.flowRate')}</span>
                <span className="text-slate-900 dark:text-white font-bold">1.2 GB/sec</span>
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
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              {t('dashboard.approvalQueue')} 
              <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">12 {t('dashboard.pending')}</span>
            </h3>
            <button className="text-primary text-sm font-bold hover:underline">{t('dashboard.viewAll')}</button>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-primary/10 flex items-center justify-between hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{t('dashboard.approveRefund')}</p>
                  <p className="text-xs text-slate-500">{t('dashboard.refundRequestedBy')}</p>
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
            
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-primary/10 flex items-center justify-between hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                  <RefreshCw className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{t('dashboard.updateLeadStatus')}</p>
                  <p className="text-xs text-slate-500">{t('dashboard.leadRequestedBy')}</p>
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
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('dashboard.securityInsights')}</h3>
          </div>
          <div className="p-6 space-y-6 flex-1 flex flex-col justify-center">
            <div className="relative space-y-4">
              {/* Layer 1 */}
              <div className="relative overflow-hidden p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 group cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gavel className="text-emerald-500 size-5" />
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{t('dashboard.layer1')}</p>
                      <p className="text-[11px] text-slate-500">{t('dashboard.layer1Desc')}</p>
                    </div>
                  </div>
                  <span className="text-emerald-500 text-xs font-black">94 {t('dashboard.blocked')}</span>
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
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{t('dashboard.layer2')}</p>
                      <p className="text-[11px] text-slate-500">{t('dashboard.layer2Desc')}</p>
                    </div>
                  </div>
                  <span className="text-primary text-xs font-black">38 {t('dashboard.blocked')}</span>
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
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{t('dashboard.layer3')}</p>
                      <p className="text-[11px] text-slate-500">{t('dashboard.layer3Desc')}</p>
                    </div>
                  </div>
                  <span className="text-accent-cyan text-xs font-black">10 {t('dashboard.blocked')}</span>
                </div>
                <div className="mt-3 w-full bg-accent-cyan/10 h-1 rounded-full">
                  <div className="bg-accent-cyan h-full w-[15%] rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 italic mt-4">{t('dashboard.securityFooter')}</p>
          </div>
        </div>
      </div>
    </div>

    <CodePurchaseModal
      isOpen={showPurchaseModal}
      onClose={() => setShowPurchaseModal(false)}
    />

    <NotificationPermissionModal
      isOpen={showNotifModal}
      onClose={() => setShowNotifModal(false)}
    />
    </>
  );
}
