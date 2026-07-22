import { Sparkles, Bot, Network, CheckSquare, FileText, Palette, Zap, Headphones, Globe, TrendingUp, Users, LayoutGrid, ArrowRight, Check, Menu, X, ChevronRight, Star, Shield, Code, Server, Cpu, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Seo from "@/components/Seo";

const features = [
  { icon: CheckSquare, title: "Approval Queue", desc: "Nenhuma ação crítica acontece sem supervisão humana. Risco baixo, médio ou alto com níveis configuráveis. Durma tranquilo." },
  { icon: FileText, title: "Audit Logs", desc: "Registro imutável de todas as ações dos agentes. Compliance, debugging e rastreabilidade total — do começo ao fim." },
  { icon: Bot, title: "Agent Hub", desc: "Crie, monitore e gerencie agentes com identidade, memória e capacidades multimodais. Estado real, não mágica." },
  { icon: Zap, title: "Command Center", desc: "Chat com Gemini Flash/Pro com streaming, síntese de voz e pensamento profundo. A potência da IA, sob seu comando." },
  { icon: Network, title: "MCP Gateway", desc: "Conecte Salesforce, HubSpot, PostgreSQL e qualquer API via protocolo MCP. Integração segura e padronizada." },
  { icon: Palette, title: "White-Label", desc: "Customize logo, cores, tipografia e domínio. Sua marca, sua plataforma — pronto para revenda." },
];

const agents = [
  { icon: TrendingUp, name: "Vendas", role: "Prospecção e CRM", color: "from-emerald-400 to-emerald-600" },
  { icon: Headphones, name: "Suporte", role: "Sucesso do Cliente", color: "from-primary to-purple-600" },
  { icon: Globe, name: "Pesquisa", role: "Inteligência de Mercado", color: "from-blue-400 to-blue-600" },
  { icon: Users, name: "Marketing", role: "Conteúdo e SEO", color: "from-orange-400 to-orange-600" },
];

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    desc: "Para testar e explorar",
    features: ["Até 2 agentes ativos", "Command Center básico", "Dashboard com métricas", "Tema dark/light", "Comunidade"],
    cta: "Começar grátis",
    featured: false,
  },
  {
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    desc: "Para profissionais e equipes",
    features: ["Agentes ilimitados", "MCP Gateway completo", "Approval Queue", "Audit Logs", "White-label básico", "API Keys", "Suporte prioritário"],
    cta: "Assinar Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "R$ 297",
    period: "/mês",
    desc: "Para organizações e agências",
    features: ["Tudo do Pro", "Multi-tenant", "SAML/SSO", "On-premise", "SLA 99.9%", "Gerente de conta dedicado", "Treinamento da equipe"],
    cta: "Falar com vendas",
    featured: false,
  },
];

const faq = [
  { q: "Como eu controlo o que os agentes fazem?", a: "Toda ação crítica passa pela Approval Queue com níveis de risco. Você define regras, aprova ou rejeita. Nada escapa." },
  { q: "E se um agente cometer um erro? Como rastreio?", a: "Cada ação é registrada no Audit Log imutável. Você sabe quem fez o quê, quando e com qual autorização." },
  { q: "Meus dados ficam seguros?", a: "SQLite embarcado. Os dados estão no seu servidor, sob seu controle. Nenhum dado sai sem sua autorização." },
  { q: "Posso conectar ferramentas que já uso?", a: "Sim. O MCP Gateway conecta Salesforce, HubSpot, PostgreSQL e qualquer API REST. Integração segura e padronizada." },
  { q: "Preciso de cartão de crédito para testar?", a: "Não. O plano Starter é gratuito e sem compromisso. Só precisa de uma chave da API Gemini." },
  { q: "Posso revender para meus clientes?", a: "Sim. White-label completo com logo, cores, tipografia e domínio próprio. Plano Enterprise inclui multi-tenant." },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Seo title="VibeFlow — Força de Trabalho Autônoma com IA" description="Plataforma de força de trabalho autônoma com agentes de IA, chat com Gemini, gateway MCP, fila de aprovação e logs de auditoria." />
      <div className="min-h-screen bg-background-dark text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg">Vibe flow</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Funcionalidades</a>
            <a href="#agents" className="text-sm text-slate-300 hover:text-white transition-colors">Agentes</a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="text-sm text-slate-300 hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Entrar</Link>
            <Link to="/login" className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Começar Grátis</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-300">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-primary/10 bg-background-dark/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-300 py-2">Funcionalidades</a>
              <a href="#agents" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-300 py-2">Agentes</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-300 py-2">Preços</a>
              <a href="#faq" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-300 py-2">FAQ</a>
              <div className="pt-2 flex gap-3">
                <Link to="/login" className="flex-1 text-center px-4 py-2 text-sm font-bold text-slate-300 border border-primary/20 rounded-xl">Entrar</Link>
                <Link to="/login" className="flex-1 text-center px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl">Começar Grátis</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-accent-cyan/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[30%] w-[20%] h-[20%] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8">
              <Star className="size-3" />
              Plataforma Oficial Google AI Studio
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              Controle total sobre seus{" "}
              <span className="bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">Agentes de IA</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
              Seus agentes de IA não podem agir no escuro. Cada ação crítica passa por aprovação humana,
              cada chamada de API é auditada, cada decisão é rastreável. Implante IA com segurança, não com medo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link to="/login" className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(140,43,238,0.4)] flex items-center gap-2 group">
                Começar Grátis
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-4 bg-white/5 border border-primary/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                Ver Funcionalidades
                <ChevronRight className="size-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Shield className="size-3 text-primary" /> Approval Queue</span>
              <span className="flex items-center gap-1"><FileText className="size-3 text-primary" /> Audit Logs</span>
              <span className="flex items-center gap-1"><Network className="size-3 text-primary" /> MCP Gateway</span>
              <span className="flex items-center gap-1"><Check className="size-3 text-primary" /> Sem cartão de crédito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 relative bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            IA sem controle é um risco que sua empresa não pode correr
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Agentes que agem sem supervisão cometem erros caros. Acessam APIs sem aprovação,
            tomam decisões sem rastreabilidade e geram dor de cabeça para compliance.
            O resultado? Sua equipe passa mais tempo apagando incêndios do que ganhando produtividade.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "Sem rastreabilidade", desc: "Ações acontecem sem registro. Impossível auditar, debugar ou provar conformidade." },
              { title: "Sem supervisão", desc: "Agentes acessam ferramentas e bancos sem aprovação humana. Um erro pode custar caro." },
              { title: "Sem confiança", desc: "Sua equipe não confia na IA. Então ela não é usada. Todo o potencial fica na gaveta." },
            ].map((item, i) => (
              <div key={i} className="bg-[#1c1126]/60 border border-red-900/20 rounded-2xl p-6">
                <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                  <Shield className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black">Tudo que você precisa para orquestrar IA</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Seis módulos integrados que transformam a forma como sua equipe trabalha com inteligência artificial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-[#1c1126]/60 border border-primary/10 rounded-2xl p-6 hover:border-primary/40 hover:bg-[#1c1126]/80 transition-all duration-300">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black">Agentes de IA especializados</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Cada agente tem identidade, memória, capacidades multimodais e acesso a ferramentas externas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((a, i) => (
              <div key={i} className="bg-[#1c1126]/60 border border-primary/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all group">
                <div className={`size-16 mx-auto rounded-2xl bg-gradient-to-br ${a.color} p-3 mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <a.icon className="size-10 text-white" />
                </div>
                <h3 className="text-lg font-bold">{a.name}</h3>
                <p className="text-sm text-slate-400">{a.role}</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(3)].map((_, j) => (
                    <span key={j} className="size-2 rounded-full bg-primary/30" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
            {[
              { value: "56", label: "Testes Automatizados", suffix: "" },
              { value: "100%", label: "Cobertura de Auditoria", suffix: "" },
              { value: "99.9%", label: "SLA Enterprise", suffix: "" },
              { value: "3", label: "Camadas de Segurança", suffix: "" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl sm:text-4xl font-black text-primary">{s.value}{s.suffix}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <blockquote className="text-center max-w-2xl mx-auto">
            <p className="text-lg text-slate-300 italic leading-relaxed">
              "Finalmente uma plataforma que trata IA com a seriedade que ela merece.
              Supervisão humana não é opcional — é obrigatória. O VibeFlow entrega isso de forma nativa."
            </p>
            <footer className="mt-4 text-sm text-slate-500">
              — <span className="text-primary font-bold">Rafael M.</span>, CTO de fintech
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black">Planos simples e transparentes</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Escolha o plano ideal para seu negócio. Todos incluem atualizações vitalícias.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border transition-all duration-300 ${plan.featured ? "bg-gradient-to-b from-primary/10 to-transparent border-primary/40 shadow-[0_0_40px_rgba(140,43,238,0.15)] scale-105" : "bg-[#1c1126]/60 border-primary/10 hover:border-primary/30"}`}>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-bold text-white shadow-lg">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-sm text-slate-400">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-400 mt-2">{plan.desc}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="size-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`mt-8 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${plan.featured ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" : "bg-white/5 border border-primary/20 text-white hover:bg-white/10"}`}>
                  {plan.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="group bg-[#1c1126]/60 border border-primary/10 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-bold text-sm cursor-pointer flex items-center justify-between hover:bg-primary/5 transition-colors list-none">
                  {item.q}
                  <ChevronRight className="size-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-primary/10 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black">Implante IA com controle, não com medo.</h2>
          <p className="text-lg text-slate-400 mt-4">
            Comece grátis. Sem cartão de crédito. Seus dados ficam com você.
            Se em 14 dias não sentir a diferença, você não perde nada — a gente não perde o sono.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(140,43,238,0.4)] group">
            Começar Grátis — 14 Dias de Teste
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-slate-600 mt-4">Sem compromisso. Cancele quando quiser.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-primary rounded flex items-center justify-center">
                <Sparkles className="size-3 text-white" />
              </div>
              <span className="font-bold">Vibe flow</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
              <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="https://ai.studio/apps/48a63ad9-6ded-4fa6-9ebf-ed01b82f9cc7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AI Studio</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/5 border border-primary/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/30 transition-all cursor-pointer">
                <Code className="size-4" />
              </div>
              <div className="size-8 rounded-lg bg-white/5 border border-primary/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/30 transition-all cursor-pointer">
                <Mail className="size-4" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary/5 text-center text-xs text-slate-600">
            &copy; 2026 Vibe flow. Todos os direitos reservados. Feito com Sparkles e IA.
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
