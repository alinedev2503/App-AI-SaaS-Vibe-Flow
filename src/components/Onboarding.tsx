import { useState, useEffect } from "react";
import { X, Sparkles, Bot, Network, CheckSquare, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";

const steps = [
  { icon: Bot, title: "Conheça o Agent Hub", desc: "Crie e gerencie agentes de IA com identidade, memória e capacidades multimodais." },
  { icon: Sparkles, title: "Comande com o Command Center", desc: "Converse com Gemini Flash/Pro, ative o pensamento profundo e use síntese de voz." },
  { icon: Network, title: "Conecte com MCP Gateway", desc: "Integre Salesforce, HubSpot, PostgreSQL e qualquer API via protocolo MCP." },
  { icon: CheckSquare, title: "Controle com Approval Queue", desc: "Nenhuma ação crítica acontece sem sua aprovação. Risco baixo, médio ou alto." },
  { icon: FileText, title: "Audite tudo", desc: "Registro imutável de todas as ações. Compliance, debugging e paz de espírito." },
];

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("onboarding_done", "true");
      onClose();
    }
  };

  const handleGo = (path: string) => {
    localStorage.setItem("onboarding_done", "true");
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1c1126] border border-primary/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-4 bg-slate-700"}`} />
            ))}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="size-5" /></button>
        </div>

        <div className="px-6 py-8 text-center">
          <div className="size-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <current.icon className="size-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{current.title}</h2>
          <p className="text-slate-400 leading-relaxed">{current.desc}</p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => handleGo("/dashboard")}
            className="flex-1 px-4 py-2.5 border border-primary/20 text-white text-sm font-bold rounded-xl hover:bg-white/5 transition-all"
          >
            Ir para o Dashboard
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? "Próximo" : "Começar"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("onboarding_done");
    if (!done) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return { show, close: () => setShow(false) };
}
