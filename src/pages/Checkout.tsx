import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Check, ArrowRight, CreditCard, Shield, Zap, Headphones } from "lucide-react";
import Seo from "@/components/Seo";
import { useToast } from "@/contexts/ToastContext";

const plans = [
  { id: "starter", name: "Starter", price: "Grátis", period: "", popular: false, features: ["Até 2 agentes", "Command Center básico", "Dashboard", "Tema dark/light"] },
  { id: "pro", name: "Pro", price: "R$ 97", period: "/mês", popular: true, features: ["Agentes ilimitados", "MCP Gateway completo", "Approval Queue", "Audit Logs", "White-label", "API Keys", "Suporte prioritário"] },
  { id: "enterprise", name: "Enterprise", price: "R$ 297", period: "/mês", popular: false, features: ["Tudo do Pro", "Multi-tenant", "SAML/SSO", "On-premise", "SLA 99.9%", "Gerente dedicado", "Treinamento"] },
];

const IS_DEMO = !import.meta.env.VITE_STRIPE_KEY;

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = useState("pro");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const plan = plans.find(p => p.id === selected)!;

  const handleSubscribe = async () => {
    if (plan.id === "starter") {
      toast("Plano Starter ativado! Bem-vindo.", "success");
      navigate("/dashboard");
      return;
    }
    setShowForm(true);
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de pagamento — substitua por integração Stripe real
    // 1. Criar PaymentIntent no backend: POST /api/payments/create-intent
    // 2. Confirmar com Stripe Elements: stripe.confirmCardPayment(clientSecret)
    setTimeout(() => {
      toast("Assinatura realizada com sucesso!", "success");
      setLoading(false);
      navigate("/settings");
    }, 1500);
  };

  return (
    <>
      <Seo title="Planos" description="Escolha o plano ideal para sua equipe na VibeFlow." />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Planos e Preços</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Escolha o plano ideal. Cancele quando quiser.</p>
        </div>

        {IS_DEMO && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400 text-center">
            ⚡ Modo demonstração — configure <code className="font-mono text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">VITE_STRIPE_KEY</code> no .env para ativar pagamentos reais.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelected(p.id); setShowForm(false); }}
              className={`relative rounded-2xl p-6 border text-left transition-all duration-200 ${
                selected === p.id
                  ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(140,43,238,0.15)]"
                  : "border-border-muted dark:border-[#362348] bg-white dark:bg-[#1c1126]/60 hover:border-primary/40"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white">Mais Popular</div>
              )}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{p.price}</span>
                {p.period && <span className="text-sm text-slate-500">{p.period}</span>}
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {showForm && plan.id !== "starter" && (
          <div className="bg-white dark:bg-[#1c1126]/60 border border-border-muted dark:border-[#362348] rounded-2xl p-8 animate-fade-in">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Finalizar Assinatura — {plan.name}</h3>
            <form onSubmit={handlePayment} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  required
                  placeholder="Nome como está no cartão"
                  className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Validade</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">CVV</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="size-4 text-emerald-400" />
                Pagamento processado com segurança. Seus dados não são armazenados.
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {loading ? "Processando..." : <>Assinar {plan.name} — {plan.price}{plan.period} <ArrowRight className="size-4" /></>}
              </button>
            </form>
          </div>
        )}

        {!showForm && (
          <div className="text-center">
            <button
              onClick={handleSubscribe}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(140,43,238,0.4)]"
            >
              {plan.id === "starter" ? "Começar Grátis" : "Assinar " + plan.name}
              <ArrowRight className="size-5" />
            </button>
            <p className="text-xs text-slate-500 mt-3">Cancele quando quiser. Sem multa.</p>
          </div>
        )}
      </div>
    </>
  );
}
