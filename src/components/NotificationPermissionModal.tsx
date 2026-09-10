import { useState, useEffect } from "react";
import { 
  Bell, 
  ShieldCheck, 
  Bot, 
  CheckSquare, 
  Sparkles, 
  X, 
  Check, 
  Smartphone, 
  Zap, 
  ArrowRight,
  Volume2
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  registerPushNotifications, 
  getNotificationPermissionStatus,
  isAndroidNativeApp,
  isPushSupported
} from "@/lib/pushNotifications";
import { secureStorage } from "@/lib/secureStorage";

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
}

export function NotificationPermissionModal({
  isOpen,
  onClose,
  onPermissionGranted,
}: NotificationPermissionModalProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isAndroid = isAndroidNativeApp();
  const isSupported = isPushSupported();

  if (!isOpen) return null;

  const handleEnableNotifications = async () => {
    setIsActivating(true);
    try {
      const result = await registerPushNotifications();
      if (result.success || result.status === "granted") {
        setIsSuccess(true);
        secureStorage.setItem("vibeflow_notif_prompt_dismissed", "true");
        toast("Notificações em tempo real ativadas com sucesso!", "success");
        if (onPermissionGranted) onPermissionGranted();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (result.status === "denied") {
        secureStorage.setItem("vibeflow_notif_prompt_dismissed", "true");
        toast("Permissão de notificações bloqueada no navegador ou sistema.", "error");
        onClose();
      } else {
        secureStorage.setItem("vibeflow_notif_prompt_dismissed", "true");
        toast("Configuração salva. Você pode reativar nas Configurações.", "info");
        onClose();
      }
    } catch (err: any) {
      toast(err.message || "Erro ao solicitar permissão de notificações.", "error");
      onClose();
    } finally {
      setIsActivating(false);
    }
  };

  const handleDismiss = () => {
    secureStorage.setItem("vibeflow_notif_prompt_dismissed", "true");
    onClose();
  };

  const benefits = [
    {
      icon: Bot,
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      title: "Monitoramento Contínuo dos Agentes",
      desc: "Receba alertas imediatos sobre falhas, anomalias de execução ou conclusão de orquestrações complexas.",
    },
    {
      icon: CheckSquare,
      color: "text-pink-400 bg-pink-400/10 border-pink-400/20",
      title: "Aprovações Human-in-the-Loop Rápidas",
      desc: "Aprove ou rejeite ações sensíveis de alto risco diretamente pelas notificações do Android ou Web.",
    },
    {
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      title: "Segurança & Conectores Corporativos",
      desc: "Avisos em tempo real de expiração de credenciais de APIs e desconexão de MCP Gateway.",
    },
  ];

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="notif-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-background-light dark:bg-[#160d24] border border-primary/30 dark:border-primary/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all z-10"
        >
          <X className="size-5" />
        </button>

        <div className="p-5 sm:p-7 relative z-10">
          {/* Header Icon and Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Bell className="size-6 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="size-3" />
                <span>Supervisão em Tempo Real</span>
              </div>
              <h2 id="notif-modal-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Fique no controle dos seus Agentes
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            O VibeFlow opera com agentes de IA autônomos. Ative as notificações push para ser informado instantaneamente sobre aprovações pendentes e alertas críticos sem precisar manter a tela aberta.
          </p>

          {/* Benefits Cards */}
          <div className="space-y-2.5 mb-6">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-primary/20 transition-all"
              >
                <div className={`p-2 rounded-xl border shrink-0 ${b.color}`}>
                  <b.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Platform compatibility info */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-slate-500 dark:text-slate-400 mb-6">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-primary shrink-0" />
              <span>
                {isAndroid 
                  ? "Canal Android Push Nativo (FCM com prioridade alta)" 
                  : "Notificações Web Push PWA em segundo plano"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-semibold shrink-0">
              <Check className="size-3.5" />
              <span>Suportado</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleEnableNotifications}
              disabled={isActivating || isSuccess}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/90 hover:to-fuchsia-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-60 min-h-[44px]"
            >
              {isActivating ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Configurando canal de push...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="size-4 text-emerald-300" />
                  <span>Notificações Ativadas!</span>
                </>
              ) : (
                <>
                  <Bell className="size-4" />
                  <span>Ativar Notificações dos Agentes</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              disabled={isActivating}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-xs sm:text-sm transition-all min-h-[44px]"
            >
              Lembrar Mais Tarde
            </button>
          </div>
          
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3">
            Você pode personalizar canais, sons e categorias a qualquer momento em <strong>Configurações &gt; Notificações</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
