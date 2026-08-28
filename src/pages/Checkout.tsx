import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  CreditCard, 
  Shield, 
  Zap, 
  Headphones, 
  Code2, 
  QrCode, 
  MessageCircle, 
  Copy, 
  CheckCircle2, 
  Lock, 
  Server, 
  Cpu, 
  Layers, 
  FileCode2,
  ExternalLink,
  Briefcase,
  Mail
} from "lucide-react";
import Seo from "@/components/Seo";
import { useToast } from "@/contexts/ToastContext";

const saasPlans = [
  { id: "starter", name: "Starter", price: "Grátis", period: "", popular: false, features: ["Até 2 agentes", "Command Center básico", "Dashboard", "Tema dark/light"] },
  { id: "pro", name: "Pro", price: "R$ 97", period: "/mês", popular: true, features: ["Agentes ilimitados", "MCP Gateway completo", "Approval Queue", "Audit Logs", "White-label", "API Keys", "Suporte prioritário"] },
  { id: "enterprise", name: "Enterprise", price: "R$ 297", period: "/mês", popular: false, features: ["Tudo do Pro", "Multi-tenant", "SAML/SSO", "On-premise", "SLA 99.9%", "Gerente dedicado", "Treinamento"] },
];

const sourceCodePlans = [
  {
    id: "dev-code",
    name: "Arquiteto MVP (Diagnóstico de Viabilidade)",
    price: "R$ 52,00",
    originalPrice: "R$ 197,00",
    badge: "Adquira o Diagnóstico",
    popular: true,
    checkoutUrl: "https://pay.hotmart.com/D102306576L",
    description: "Diagnóstico completo de viabilidade técnica e escopo do MVP.",
    features: [
      "Diagnóstico completo de viabilidade técnica e de negócios",
      "Conceito, Funcionalidades essenciais e Escopo do MVP",
      "Modelagem estruturada de Banco de Dados",
      "Fluxo e jornada ideal do usuário mapeados",
      "Exportação completa do blueprint em formato PDF",
      "Salvo permanentemente no perfil do usuário",
      "IA especializada de diagnóstico ágil",
      "Proteção de qualidade: 1 geração a cada 48h"
    ]
  },
  {
    id: "whitelabel-code",
    name: "Licença White-Label Comercial",
    price: "R$ 4.210,00",
    originalPrice: "R$ 8.500,00",
    badge: "Mais Vendido • Revenda Ilimitada",
    popular: true,
    checkoutUrl: "https://pay.hotmart.com/H102919805E",
    description: "Lance seu próprio SaaS de agentes com sua marca e cobre seus clientes.",
    features: [
      "Tudo da Licença Dev + Direito de Revenda Comercial Irrestrito",
      "100% dos lucros são seus — Zero royalties recorrentes",
      "Sistema de Customização de Marca (Logo, Cores, Domínio)",
      "Painel Admin RBAC para gestão de clientes",
      "Fila de Supervisão Humana (Human-in-the-Loop) nativa",
      "Scripts de Inicialização e Seeds prontos para produção",
      "1 ano de atualizações e correções do repositório",
      "Suporte na implantação em Cloud Run, Vercel ou VPS"
    ]
  },
  {
    id: "enterprise-code",
    name: "Agência de Automação (Agentes e Apps)",
    price: "R$ 7.100,00",
    originalPrice: "+ R$ 520,00/mês",
    badge: "Tenha seu Agente de IA",
    popular: true,
    checkoutUrl: "https://pay.hotmart.com/U103223194X?off=dhbrd35z",
    maintenanceUrl: "https://pay.hotmart.com/U103223194X?off=jtjnh0hw",
    affiliateUrl: "https://affiliate.hotmart.com/affiliate-recruiting/view/2675E103223215",
    description: "Desenvolvimento completo de automações, agentes IA e apps sob medida para seu negócio.",
    features: [
      "Você traz a ideia de automação e implementamos a solução completa",
      "Prazo de entrega ágil de 7 a 45 dias úteis",
      "Integração Hotmart via webhooks para liberação e avisos automáticos",
      "Contrato com valor não reembolsável garantindo compromisso mútuo",
      "Manutenção e sustentação contínua (R$ 520,00 / mês)",
      "Treinamento operacional e entrega de documentação completa",
      "Programa de Afiliados disponível com comissões na Hotmart"
    ]
  }
];

const IS_DEMO = !import.meta.env.VITE_STRIPE_KEY;

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"code" | "saas">("code");
  const [selectedSaasPlan, setSelectedSaasPlan] = useState("pro");
  const [selectedCodePlan, setSelectedCodePlan] = useState("whitelabel-code");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [copiedPix, setCopiedPix] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [completed, setCompleted] = useState(false);

  const saasPlan = saasPlans.find(p => p.id === selectedSaasPlan)!;
  const codePlan = sourceCodePlans.find(p => p.id === selectedCodePlan)!;

  const pixKey = "contatoalinedev@gmail.com";
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse em adquirir o código-fonte do VibeFlow AI SaaS (${codePlan.name} - ${codePlan.price}). Como podemos fechar?`
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    toast("Chave PIX copiada com sucesso!", "success");
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmPurchase = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      toast("Pedido processado com sucesso! Acesso ao repositório liberado.", "success");
    }, 1500);
  };

  return (
    <>
      <Seo 
        title="Planos & Aquisição de Código-Fonte — VibeFlow" 
        description="Adquira a licença comercial do código-fonte do VibeFlow AI SaaS ou assine nossos planos na nuvem." 
      />
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="size-3.5 text-primary" />
            Adquira o Código ou Assine na Nuvem
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Escolha o Modelo Ideal Para Você
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Seja dono da tecnologia com a <strong>Licença do Código-Fonte Completo</strong> ou utilize nossa infraestrutura pronta na nuvem.
          </p>

          {/* Model Switcher Tabs */}
          <div className="inline-flex p-1.5 bg-slate-200 dark:bg-[#1a0f26] border border-border-muted dark:border-primary/30 rounded-2xl shadow-inner mt-4">
            <button
              type="button"
              onClick={() => { setActiveTab("code"); setShowCheckoutForm(false); setCompleted(false); }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                activeTab === "code"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Code2 className="size-4" />
              <span>📦 Adquirir Código-Fonte (Vitalício)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("saas"); setShowCheckoutForm(false); setCompleted(false); }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                activeTab === "saas"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Server className="size-4" />
              <span>💳 Assinatura SaaS Mensal</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SOURCE CODE PURCHASE (HIGHLIGHT) */}
        {activeTab === "code" && (
          <div className="space-y-8 animate-fade-in">
            {/* Why buy code banner */}
            <div className="bg-gradient-to-r from-primary/10 via-fuchsia-600/10 to-accent-cyan/10 border border-primary/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary">Direito Comercial Irrestrito</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Tenha seu próprio SaaS de IA no ar em menos de 10 minutos
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                  Código limpo, modular e 100% tipado. Conecte sua chave do Google Gemini e comece a faturar vendendo para seus próprios clientes sem pagar royalties para ninguém.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all"
              >
                <MessageCircle className="size-4" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>

            {/* Code Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sourceCodePlans.map((p) => {
                const isSelected = selectedCodePlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => { setSelectedCodePlan(p.id); setCompleted(false); }}
                    className={`relative rounded-3xl p-6 border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/[0.07] dark:bg-primary/10 shadow-[0_0_35px_rgba(140,43,238,0.2)] ring-2 ring-primary"
                        : "border-border-muted dark:border-[#362348] bg-white dark:bg-[#1a0f26]/80 hover:border-primary/50"
                    }`}
                  >
                    {p.popular && (
                      <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-wider shadow-md ${
                        p.id === "dev-code"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/25 border border-emerald-400/30"
                          : p.id === "enterprise-code"
                          ? "bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-indigo-500/25 border border-indigo-400/30"
                          : "bg-gradient-to-r from-primary to-fuchsia-600 shadow-primary/30"
                      }`}>
                        {p.badge}
                      </div>
                    )}
                    <div>
                      {!p.popular && (
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {p.badge}
                        </span>
                      )}
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{p.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[32px]">{p.description}</p>

                      <div className="mt-4 pb-4 border-b border-border-muted dark:border-white/10 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{p.price}</span>
                        <span className="text-xs text-slate-400 line-through">{p.originalPrice}</span>
                        <span className="text-xs text-slate-500 ml-auto font-medium">pagamento único</span>
                      </div>

                      <ul className="mt-4 space-y-2.5">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <Check className="size-4 text-primary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setSelectedCodePlan(p.id); setShowCheckoutForm(true); setCompleted(false); }}
                      className={`mt-6 w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                          : "bg-slate-100 dark:bg-white/5 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-300 border border-border-muted dark:border-white/10"
                      }`}
                    >
                      <span>Selecionar {p.name}</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Direct Code Checkout / Payment Box */}
            <div className="bg-white dark:bg-[#1a0f26] border border-border-muted dark:border-primary/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              {!completed ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500">
                      <Shield className="size-4" />
                      Garantia de Satisfação e Suporte Técnico Direto
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Você está adquirindo: <span className="text-primary">{codePlan.name}</span>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Após o pagamento, você recebe imediatamente o link do repositório no GitHub com todos os arquivos, documentação completa de implantação e chave de acesso.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border-muted dark:border-white/10">
                        <span className="text-[11px] font-bold text-slate-400 block">Formato de Entrega</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">GitHub Repo + ZIP + Docs</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border-muted dark:border-white/10">
                        <span className="text-[11px] font-bold text-slate-400 block">Licença</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">Comercial & White-Label</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-50 dark:bg-[#241535] border border-border-muted dark:border-primary/20 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex justify-between items-baseline border-b border-border-muted dark:border-white/10 pb-3">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total do Investimento</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{codePlan.price}</span>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={codePlan.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-gradient-to-r from-primary to-fuchsia-600 hover:opacity-95 text-white font-black rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
                      >
                        <span>
                          {codePlan.id === "enterprise-code"
                            ? "Contratar Implementação (R$ 7.100,00)"
                            : `Adquirir ${codePlan.name.split(" ")[0]} (${codePlan.price})`}
                        </span>
                        <ArrowRight className="size-4" />
                      </a>

                      {"maintenanceUrl" in codePlan && codePlan.maintenanceUrl && (
                        <a
                          href={codePlan.maintenanceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Layers className="size-3.5" />
                          <span>Contratar Plano de Manutenção (R$ 520,00/mês)</span>
                          <ExternalLink className="size-3 opacity-70" />
                        </a>
                      )}

                      {"affiliateUrl" in codePlan && codePlan.affiliateUrl && (
                        <a
                          href={codePlan.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Sparkles className="size-3.5" />
                          <span>Inscrição de Afiliados (Hotmart)</span>
                          <ExternalLink className="size-3 opacity-70" />
                        </a>
                      )}

                      <a
                        href="https://studio-9411389430-61164.web.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-light border border-primary/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Briefcase className="size-3.5" />
                        <span>Ver Portfólio do Desenvolvedor</span>
                        <ExternalLink className="size-3 opacity-70" />
                      </a>
                    </div>

                    {/* Contact Call to Action */}
                    <div className="p-4 bg-white dark:bg-[#130b1c] rounded-xl border border-border-muted dark:border-primary/20 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light shrink-0">
                          <Mail className="size-3.5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Dúvidas ou Projetos Sob Medida?</h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Fale diretamente com a Aline DEV</p>
                        </div>
                      </div>
                      <a
                        href="mailto:contatoalinedev@gmail.com"
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-primary dark:text-primary-light border border-border-muted dark:border-white/10 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Mail className="size-3.5 text-primary" />
                        <span>contatoalinedev@gmail.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Post-purchase Success Screen */
                <div className="py-8 text-center max-w-lg mx-auto space-y-4">
                  <div className="size-16 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-lg">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Acesso Confirmado com Sucesso!</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Você adquiriu o pacote <strong className="text-primary">{codePlan.name}</strong>.
                  </p>
                  <div className="bg-slate-50 dark:bg-[#241535] p-4 rounded-2xl border border-border-muted dark:border-white/10 text-xs font-mono text-left space-y-2">
                    <div><strong>Repositório:</strong> github.com/alinedev2503/App-AI-SaaS-Vibe-Flow</div>
                    <div><strong>Suporte Técnico:</strong> contatoalinedev@gmail.com</div>
                    <div><strong>Status:</strong> Licença Comercial Vitalícia Ativa</div>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all hover:bg-emerald-500"
                  >
                    <MessageCircle className="size-4" />
                    <span>Confirmar Recebimento no WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SAAS SUBSCRIPTION */}
        {activeTab === "saas" && (
          <div className="space-y-8 animate-fade-in">
            {IS_DEMO && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 text-sm text-amber-500 text-center">
                ⚡ Modo demonstração — configure <code className="font-mono text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">VITE_STRIPE_KEY</code> no .env para ativar pagamentos reais.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {saasPlans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedSaasPlan(p.id); setShowCheckoutForm(false); }}
                  className={`relative rounded-3xl p-6 border text-left transition-all duration-200 flex flex-col justify-between ${
                    selectedSaasPlan === p.id
                      ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(140,43,238,0.15)] ring-1 ring-primary"
                      : "border-border-muted dark:border-[#362348] bg-white dark:bg-[#1c1126]/60 hover:border-primary/40"
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white shadow">
                      Mais Popular
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{p.price}</span>
                      {p.period && <span className="text-sm text-slate-500">{p.period}</span>}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Check className="size-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-muted dark:border-white/5">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      Selecionar Plano <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {showCheckoutForm && saasPlan.id !== "starter" && (
              <div className="bg-white dark:bg-[#1c1126] border border-border-muted dark:border-[#362348] rounded-3xl p-8 animate-fade-in max-w-xl mx-auto shadow-2xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                  Finalizar Assinatura — {saasPlan.name}
                </h3>
                <form onSubmit={(e) => handleConfirmPurchase(e)} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome como está no cartão"
                      className="w-full bg-slate-50 dark:bg-[#0f0720] border border-border-muted dark:border-primary/20 rounded-xl py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full bg-slate-50 dark:bg-[#0f0720] border border-border-muted dark:border-primary/20 rounded-xl py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Validade</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full bg-slate-50 dark:bg-[#0f0720] border border-border-muted dark:border-primary/20 rounded-xl py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">CVV</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-slate-50 dark:bg-[#0f0720] border border-border-muted dark:border-primary/20 rounded-xl py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Shield className="size-4 text-emerald-400" />
                    Pagamento processado com segurança. Cancele quando quiser.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? "Processando..." : <>Assinar {saasPlan.name} — {saasPlan.price}{saasPlan.period} <ArrowRight className="size-4" /></>}
                  </button>
                </form>
              </div>
            )}

            {!showCheckoutForm && (
              <div className="text-center">
                <button
                  onClick={() => {
                    if (saasPlan.id === "starter") {
                      toast("Plano Starter ativado! Bem-vindo.", "success");
                      navigate("/dashboard");
                    } else {
                      setShowCheckoutForm(true);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-base rounded-2xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(140,43,238,0.4)]"
                >
                  {saasPlan.id === "starter" ? "Começar Grátis Agora" : "Assinar " + saasPlan.name}
                  <ArrowRight className="size-5" />
                </button>
                <p className="text-xs text-slate-500 mt-3">Cancele quando quiser. Sem multa contratual.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
