import { useState } from "react";
import { 
  Sparkles, 
  Check, 
  Code, 
  Terminal, 
  Database, 
  Bot, 
  ShieldCheck, 
  Layers, 
  Zap, 
  X, 
  ExternalLink, 
  Copy, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Mail,
  FileCode2,
  Server,
  Palette,
  Briefcase
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface CodePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: "core" | "whitelabel" | "enterprise";
}

interface PlanDetails {
  id: string;
  name: string;
  tag: string;
  price: string;
  originalPrice: string;
  billing: string;
  popular?: boolean;
  badge?: string;
  checkoutUrl: string;
  maintenanceUrl?: string;
  affiliateUrl?: string;
  features: string[];
}

export function CodePurchaseModal({ isOpen, onClose, defaultPlan = "whitelabel" }: CodePurchaseModalProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"core" | "whitelabel" | "enterprise">(defaultPlan);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "contact">("pix");
  const [copiedPix, setCopiedPix] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  if (!isOpen) return null;

  const plans: Record<"core" | "whitelabel" | "enterprise", PlanDetails> = {
    core: {
      id: "core",
      name: "Arquiteto MVP (Diagnóstico de Viabilidade)",
      tag: "Diagnóstico de Ideias com IA",
      price: "R$ 52,00",
      originalPrice: "R$ 197,00",
      billing: "Pagamento Único • Exportação em PDF",
      popular: false,
      badge: "Adquira o Diagnóstico",
      checkoutUrl: "https://pay.hotmart.com/D102306576L",
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
    whitelabel: {
      id: "whitelabel",
      name: "Licença White-Label SaaS Comercial",
      tag: "Mais Vendido • Pronto para Revenda",
      price: "R$ 4.210,00",
      originalPrice: "R$ 8.500,00",
      billing: "Pagamento Único • Clientes Ilimitados",
      popular: true,
      checkoutUrl: "https://pay.hotmart.com/H102919805E",
      features: [
        "Tudo do Pacote Dev + Licença Comercial Irrestrita",
        "Direito de revender para seus próprios clientes (100% do lucro seu)",
        "Sistema de Customização White-Label (Logo, Cores, Domínio)",
        "Painel Admin RBAC para gestão de assinantes",
        "Fila de Aprovação Human-in-the-Loop integrada",
        "Scripts de Seed e Migração instantânea",
        "Acesso vitalício ao repositório + 1 ano de atualizações",
        "Suporte para implantação em Cloud Run, Vercel ou VPS"
      ]
    },
    enterprise: {
      id: "enterprise",
      name: "Agência de Automação (Agentes e Apps)",
      tag: "Desenvolvimento Sob Medida",
      price: "R$ 7.100,00",
      originalPrice: "+ R$ 520,00/mês",
      billing: "Setup R$ 7.100,00 + R$ 520,00/mês manutenção",
      popular: true,
      badge: "Tenha seu Agente de IA",
      checkoutUrl: "https://pay.hotmart.com/U103223194X?off=dhbrd35z",
      maintenanceUrl: "https://pay.hotmart.com/U103223194X?off=jtjnh0hw",
      affiliateUrl: "https://affiliate.hotmart.com/affiliate-recruiting/view/2675E103223215",
      features: [
        "Desenvolvimento completo de Agentes IA e Aplicativos sob medida",
        "Você traz sua ideia de negócio e implementamos a solução ponta a ponta",
        "Prazo de implementação ágil de 7 a 45 dias",
        "Integração Hotmart via Webhooks para liberação e notificações automáticas",
        "Plano de Manutenção e evolução contínua (R$ 520,00/mês)",
        "Comprometimento mútuo de projeto com valor não reembolsável",
        "Treinamento operacional e documentação técnica completa",
        "Disponível para afiliação na Hotmart (comissões atrativas)"
      ]
    }
  };

  const currentPlan = plans[selectedPlan];

  const pixKey = "contatoalinedev@gmail.com";
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse em adquirir o código-fonte do VibeFlow AI SaaS (${currentPlan.name} - ${currentPlan.price}). Como posso proceder?`
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    toast("Chave PIX copiada com sucesso!", "success");
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleSimulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPurchaseComplete(true);
      toast("Pagamento confirmado! Acesso ao repositório liberado.", "success");
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#130b1c] border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {!purchaseComplete ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 text-primary-light border border-primary/30 text-xs font-black uppercase tracking-wider">
                <Sparkles className="size-3.5 text-primary" />
                Adquira o Código-Fonte Completo do VibeFlow
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Lance Seu Próprio SaaS de Agentes de IA
              </h2>
              <p className="text-slate-400 text-sm">
                Tenha 100% da propriedade intelectual. Sem taxas mensais de royalties, pronto para deploy e monetização imediata.
              </p>
            </div>

            {/* Plan Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
                const p = plans[key];
                const isSelected = selectedPlan === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlan(key)}
                    className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-[0_0_25px_rgba(140,43,238,0.25)] ring-1 ring-primary"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {p.badge && (
                      <span className={`absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        p.id === "core"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-400/30"
                          : p.id === "enterprise"
                          ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30"
                          : "bg-primary text-white shadow-md shadow-primary/30"
                      }`}>
                        {p.badge}
                      </span>
                    )}
                    {p.popular && !p.badge && (
                      <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider">
                        Recomendado
                      </span>
                    )}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {p.tag}
                      </span>
                      <h4 className="font-black text-white text-base leading-snug">{p.name}</h4>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xl font-black text-white">{p.price}</span>
                          <span className="text-[11px] text-slate-500 line-through ml-2">{p.originalPrice}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">único</span>
                      </div>
                      <a
                        href={p.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/30"
                            : "bg-white/10 hover:bg-white/20 text-slate-200"
                        }`}
                      >
                        <span>Comprar {p.name.split(" ")[0]} ({p.price})</span>
                        <ArrowRight className="size-3" />
                      </a>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Plan Details & Tech Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#1a0f26] border border-primary/20 rounded-2xl p-5 sm:p-6">
              {/* Features List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    O que está incluso no {currentPlan.name}:
                  </h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {currentPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Badges */}
                <div className="pt-3 border-t border-white/10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Stack Tecnológica Entregue:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">React 19</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">TypeScript</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">Vite</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">Tailwind CSS 4</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">Node Express</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">Google Gemini 3</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">MCP Gateway</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">SQLite / Supabase / Firebase</span>
                  </div>
                </div>
              </div>

              {/* Checkout / Contact Options */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#231433] border border-[#3d2454] rounded-xl p-4 sm:p-5">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total do Investimento</span>
                    <span className="text-2xl font-black text-white">{currentPlan.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mb-4">
                    {currentPlan.billing}. Pagamento seguro via Hotmart com liberação imediata.
                  </p>

                  {/* Primary Action Buttons */}
                  <div className="space-y-2">
                    <a
                      href={currentPlan.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-gradient-to-r from-primary to-fuchsia-600 hover:opacity-95 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-sm text-center"
                    >
                      <span>
                        {selectedPlan === "enterprise"
                          ? "Contratar Implementação (R$ 7.100,00)"
                          : `Adquirir ${currentPlan.name.split(" ")[0]} (${currentPlan.price})`}
                      </span>
                      <ArrowRight className="size-4" />
                    </a>

                    {currentPlan.maintenanceUrl && (
                      <a
                        href={currentPlan.maintenanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Layers className="size-3.5" />
                        <span>Contratar Plano de Manutenção (R$ 520,00/mês)</span>
                        <ExternalLink className="size-3 opacity-70" />
                      </a>
                    )}

                    {currentPlan.affiliateUrl && (
                      <a
                        href={currentPlan.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
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
                </div>

                {/* Contact CTA Box */}
                <div className="p-3.5 bg-[#130b1c] rounded-xl border border-primary/20 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light shrink-0">
                      <Mail className="size-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white leading-tight">Dúvidas ou Projetos Sob Medida?</h5>
                      <p className="text-[11px] text-slate-400">Fale diretamente com a Aline DEV</p>
                    </div>
                  </div>
                  <a
                    href="mailto:contatoalinedev@gmail.com"
                    className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-primary-light border border-white/10 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Mail className="size-3.5 text-primary" />
                    <span>contatoalinedev@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Trust Notes */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-emerald-400" /> 100% Seguro & Testado</span>
                <span className="flex items-center gap-1"><FileCode2 className="size-3.5 text-primary" /> Código Limpo & Modular</span>
                <span className="flex items-center gap-1"><Server className="size-3.5 text-cyan-400" /> Deploy em 1 Clique</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Contato:</span>
                <a href="mailto:contatoalinedev@gmail.com" className="text-primary hover:underline font-mono">
                  contatoalinedev@gmail.com
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Purchase Confirmation Screen */
          <div className="py-8 text-center max-w-lg mx-auto space-y-5">
            <div className="size-16 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Parabéns! Pedido Registrado</h3>
              <p className="text-slate-300 text-sm">
                Você escolheu o <span className="text-primary-light font-bold">{currentPlan.name}</span>.
              </p>
            </div>

            <div className="bg-[#1a0f26] border border-primary/20 rounded-2xl p-5 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">Pronto para Entrega</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Repositório:</span>
                <span className="text-white">github.com/alinedev2503/App-AI-SaaS-Vibe-Flow</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Suporte:</span>
                <span className="text-primary-light font-bold">contatoalinedev@gmail.com</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="size-4" />
                <span>Confirmar Recebimento no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                Continuar Navegando no App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
