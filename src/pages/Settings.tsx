import { SubscriptionOverview } from "../components/settings/SubscriptionOverview";
import { useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Globe, 
  Palette, 
  CreditCard, 
  LogOut,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Save,
  Moon,
  Sun,
  Languages,
  HelpCircle,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  BookOpen,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight,
  Smartphone,
  Radio,
  Copy,
  Check,
  Send,
  Volume2,
  Vibrate,
  Layers,
  AlertCircle,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Seo from "@/components/Seo";
import { useToast } from "@/contexts/ToastContext";
import { useAiKeys, AI_PROVIDERS } from "@/contexts/AiKeysContext";
import { useAuth } from "@/contexts/AuthContext";
import { AiApiKeyConfig } from "@/components/AiApiKeyConfig";
import {
  registerPushNotifications,
  sendTestPushNotification,
  getNotificationPermissionStatus,
  getStoredPushToken,
  getStoredPreferences,
  savePreferences,
  isAndroidNativeApp,
  type PushNotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/lib/pushNotifications";

type SettingsTab = "apiKeys" | "help" | "profile" | "appearance" | "security" | "notifications" | "billing";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const { isConfigured, activeProvider } = useAiKeys();
  const { user, token, updateProfile, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get("tab") as SettingsTab) || "apiKeys";
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    ["apiKeys", "help", "profile", "appearance", "security", "notifications", "billing"].includes(initialTab)
      ? initialTab
      : "apiKeys"
  );

  const [fullName, setFullName] = useState(user?.name || "Alex Rivera");
  const [email, setEmail] = useState(user?.email || "alex.rivera@vibeflow.ai");

  // Push Notifications (FCM / Android) State
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => getNotificationPermissionStatus());
  const [fcmToken, setFcmToken] = useState<string | null>(() => getStoredPushToken());
  const [copiedToken, setCopiedToken] = useState(false);
  const [isRegisteringPush, setIsRegisteringPush] = useState(false);
  const [isSendingTestPush, setIsSendingTestPush] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState<PushNotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    // Load initial notification preferences
    getStoredPreferences().then(prefs => {
      setNotificationPrefs(prefs);
    });
    setPushPermission(getNotificationPermissionStatus());
    setFcmToken(getStoredPushToken());
  }, []);

  const handleTogglePref = async (key: keyof PushNotificationPreferences) => {
    const updated = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(updated);
    setIsSavingPrefs(true);
    try {
      await savePreferences(updated);
      toast("Preferência de notificação salva!", "success");
    } catch {
      toast("Erro ao sincronizar preferência", "error");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleRegisterPush = async () => {
    setIsRegisteringPush(true);
    try {
      const result = await registerPushNotifications();
      setPushPermission(result.status);
      if (result.success && result.token) {
        setFcmToken(result.token);
        toast("Push Notifications via FCM ativadas com sucesso!", "success");
      } else {
        toast(result.error || "Não foi possível habilitar notificações", "error");
      }
    } catch (err: any) {
      toast("Erro ao registrar no FCM", "error");
    } finally {
      setIsRegisteringPush(false);
    }
  };

  const handleSendTestPush = async () => {
    setIsSendingTestPush(true);
    try {
      const res = await sendTestPushNotification({
        title: "⚡ Alerta Crítico: Orquestração de Agentes",
        body: "Agente Maya solicitou aprovação para envio de relatório financeiro executivo.",
        type: "approval_request",
      });
      if (res.success) {
        toast("Push de teste disparado com sucesso via FCM!", "success");
      } else {
        toast(res.message || "Falha ao enviar notificação de teste.", "error");
      }
    } catch {
      toast("Erro ao disparar teste push.", "error");
    } finally {
      setIsSendingTestPush(false);
    }
  };

  const handleCopyToken = () => {
    if (!fcmToken) return;
    navigator.clipboard.writeText(fcmToken);
    setCopiedToken(true);
    toast("Token FCM copiado para a área de transferência!", "success");
    setTimeout(() => setCopiedToken(false), 2000);
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab") as SettingsTab;
    if (tabParam && ["apiKeys", "help", "profile", "appearance", "security", "notifications", "billing"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
      await fetch(`${API_BASE}/api/upload/branding`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });
      toast("Avatar atualizado com sucesso!", "success");
    } catch {
      toast("Erro ao fazer upload", "error");
    }
  };

  const handleSaveProfile = () => {
    updateProfile({ name: fullName, email });
    toast("Perfil e preferências salvos com sucesso!", "success");
  };

  return (
    <>
      <Seo title={t('settings.title')} description="Configure suas chaves de IA (Gemini, OpenAI, Claude), tutoriais de consoles, perfil e preferências." />
      
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('settings.title')}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isConfigured 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
              }`}>
                <span className={`size-2 rounded-full ${isConfigured ? "bg-emerald-500" : "bg-rose-500"}`} />
                {isConfigured ? `IA Conectada (${AI_PROVIDERS[activeProvider].name})` : "Chave de IA Pendente"}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Gerencie suas chaves de API para marketplaces, tutoriais de acesso rápido e preferências do sistema.
            </p>
          </div>

          <button 
            onClick={handleSaveProfile} 
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/90 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-primary/25 border border-primary/40 self-start sm:self-auto"
          >
            <Save className="size-4" />
            {t('settings.saveChanges')}
          </button>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-row md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar pb-2 md:pb-0">
            {/* Chaves de API */}
            <button 
              onClick={() => handleTabChange("apiKeys")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "apiKeys"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Key className="size-4 shrink-0" />
              <span className="flex-1 text-left">Chaves de API & IA</span>
              {isConfigured && <span className="size-2 rounded-full bg-emerald-400" />}
            </button>

            {/* Ajuda & Consoles */}
            <button 
              onClick={() => handleTabChange("help")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "help"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <HelpCircle className="size-4 shrink-0" />
              <span className="flex-1 text-left">Ajuda & Consoles</span>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Links
              </span>
            </button>

            {/* Profile */}
            <button 
              onClick={() => handleTabChange("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "profile"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <User className="size-4 shrink-0" />
              <span className="flex-1 text-left">{t('settings.profileAndAccount')}</span>
            </button>

            {/* Appearance */}
            <button 
              onClick={() => handleTabChange("appearance")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "appearance"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Palette className="size-4 shrink-0" />
              <span className="flex-1 text-left">{t('settings.appearance')}</span>
            </button>

            {/* Security */}
            <button 
              onClick={() => handleTabChange("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "security"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Shield className="size-4 shrink-0" />
              <span className="flex-1 text-left">{t('settings.securityAndAccess')}</span>
            </button>

            {/* Notifications */}
            <button 
              onClick={() => handleTabChange("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "notifications"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Bell className="size-4 shrink-0" />
              <span className="flex-1 text-left">{t('settings.notifications')}</span>
            </button>

            {/* Billing */}
            <button 
              onClick={() => handleTabChange("billing")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeTab === "billing"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
              }`}
            >
              <CreditCard className="size-4 shrink-0" />
              <span className="flex-1 text-left">{t('settings.billing')}</span>
            </button>
            
            <div className="mt-auto pt-4 border-t border-border-muted hidden md:block">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-border-muted text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Pronto para Marketplace</p>
                <p className="text-[11px] text-slate-500">Modelo BYOK (Bring Your Own Key) 100% ativo.</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-surface border border-border-muted rounded-2xl overflow-y-auto custom-scrollbar p-6 sm:p-8">
            <div className="max-w-3xl space-y-8">
              
              {/* TAB: API KEYS & IA */}
              {activeTab === "apiKeys" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Key className="size-5 text-primary" />
                      <span>Gerenciamento de Chaves de API de IA</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Configure suas credenciais para alimentar os agentes de IA, Command Center e automações do VibeFlow.
                    </p>
                  </div>

                  {/* BYOK Explanation Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-fuchsia-500/5 to-transparent border border-primary/20 flex items-start gap-3">
                    <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="font-bold text-slate-900 dark:text-white">
                        Como funciona o modelo "Traga sua Própria Chave" (BYOK)?
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        Ao adquirir o código ou testar o aplicativo num marketplace, você insere sua própria chave da <strong>Google AI Studio (Gemini)</strong>, <strong>OpenAI</strong> ou <strong>Claude (Anthropic)</strong>. O custo de consumo da IA fica sob sua própria conta e você mantém controle total sobre quotas e segurança.
                      </p>
                    </div>
                  </div>

                  {/* Componente Interativo de Configuração de Chaves */}
                  <AiApiKeyConfig showHelpSection={true} />

                  {/* Environment variable notes */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-border-muted space-y-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="size-4 text-primary" />
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Uso em Servidor / Arquivo .env
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Se você estiver hospedando o VibeFlow em produção ou contêineres Docker, também pode configurar a variável de ambiente no seu arquivo <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-primary font-bold">.env</code>:
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                      {`GEMINI_API_KEY=sua_chave_do_google_ai_studio\nOPENAI_API_KEY=sua_chave_da_openai\nANTHROPIC_API_KEY=sua_chave_da_anthropic`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB: AJUDA & CONSOLES DE DESENVOLVEDOR */}
              {activeTab === "help" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpCircle className="size-5 text-primary" />
                      <span>Ajuda & Consoles Oficiais de IA</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Links rápidos para os consoles de desenvolvedores e passo a passo para gerar suas chaves em menos de 1 minuto.
                    </p>
                  </div>

                  {/* 3 Major Provider Cards */}
                  <div className="grid grid-cols-1 gap-5">
                    {/* Google AI Studio */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface to-background-dark border border-emerald-500/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black">
                            G
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                                Google AI Studio (Gemini)
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Recomendado • Grátis
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Alimenta o Command Center nativo, streaming em tempo real e raciocínio avançado.
                            </p>
                          </div>
                        </div>

                        <a
                          href="https://aistudio.google.com/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 self-start sm:self-auto"
                        >
                          <span>Abrir Google AI Studio</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>

                      {/* Step by step */}
                      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-emerald-500/20 space-y-2 text-xs">
                        <p className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">
                          Passo a Passo para obter sua chave gratuita:
                        </p>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                          <li>Acesse o link <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline text-emerald-400 font-bold">aistudio.google.com/apikey</a> e faça login com sua conta Google.</li>
                          <li>Clique no botão azul <strong>"Create API Key"</strong> (Criar chave de API).</li>
                          <li>Selecione um projeto Google Cloud existente ou crie um novo projeto automático em 1 clique.</li>
                          <li>Copie a chave gerada (inicia com <code className="font-mono text-emerald-300">AIzaSy...</code>) e cole na aba <strong>Chaves de API</strong> do VibeFlow.</li>
                        </ol>
                      </div>
                    </div>

                    {/* OpenAI Platform */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-surface to-background-dark border border-cyan-500/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-black">
                            O
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                                OpenAI Platform (GPT-4o / GPT-4o Mini)
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                                GPT Series
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Para processamento com ecossistema OpenAI e embeddings.
                            </p>
                          </div>
                        </div>

                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20 self-start sm:self-auto"
                        >
                          <span>Abrir OpenAI Platform</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>

                      {/* Step by step */}
                      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-cyan-500/20 space-y-2 text-xs">
                        <p className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider">
                          Passo a Passo:
                        </p>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                          <li>Acesse <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline text-cyan-400 font-bold">platform.openai.com/api-keys</a> e entre na sua conta OpenAI.</li>
                          <li>Clique em <strong>"Create new secret key"</strong>.</li>
                          <li>Dê um nome para a chave (ex: <code className="font-mono text-cyan-300">VibeFlow-App</code>) e confirme.</li>
                          <li>Copie a chave secreta que começa com <code className="font-mono text-cyan-300">sk-...</code> e salve no VibeFlow.</li>
                        </ol>
                      </div>
                    </div>

                    {/* Anthropic Console */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-surface to-background-dark border border-amber-500/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                            A
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                                Anthropic Console (Claude 3.5 & 3.7)
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                Claude Series
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Excelente para raciocínio profundo de código e arquitetura.
                            </p>
                          </div>
                        </div>

                        <a
                          href="https://console.anthropic.com/settings/keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 self-start sm:self-auto"
                        >
                          <span>Abrir Anthropic Console</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>

                      {/* Step by step */}
                      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-amber-500/20 space-y-2 text-xs">
                        <p className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                          Passo a Passo:
                        </p>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                          <li>Acesse <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="underline text-amber-400 font-bold">console.anthropic.com/settings/keys</a>.</li>
                          <li>Clique em <strong>"Create Key"</strong>.</li>
                          <li>Copie a chave que começa com <code className="font-mono text-amber-300">sk-ant-...</code>.</li>
                          <li>Insira a chave no VibeFlow e clique em Testar Conexão.</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* FAQ & Marketplace FAQ */}
                  <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-border-muted space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      <span>Dúvidas Frequentes sobre Chaves e Marketplace</span>
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                        <p className="font-bold text-slate-900 dark:text-white">Minhas chaves são enviadas para terceiros?</p>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          Não. As chaves inseridas via formulário ficam salvas localmente no armazenamento seguro do seu navegador (<code className="font-mono">localStorage</code>) e são enviadas diretamente para os endpoints oficiais do Google, OpenAI ou Anthropic.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                        <p className="font-bold text-slate-900 dark:text-white">O Google AI Studio é realmente gratuito?</p>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          Sim! O tier gratuito do Google AI Studio oferece até 15 requisições por minuto (RPM) e 1.000.000 de tokens por minuto (TPM) no Gemini 3 Flash e Gemini 3.1 Pro, perfeito para testes, protótipos e produção inicial sem gastar nada.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: APPEARANCE */}
              {activeTab === "appearance" && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette className="size-5 text-primary" />
                    {t('settings.theme')} & {t('settings.language')}
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('settings.theme')}</label>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                          <button 
                            onClick={() => theme !== 'light' && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${theme === 'light' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'}`}
                          >
                            <Sun className="size-4" />
                            {t('settings.lightMode')}
                          </button>
                          <button 
                            onClick={() => theme !== 'dark' && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${theme === 'dark' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'}`}
                          >
                            <Moon className="size-4" />
                            {t('settings.darkMode')}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('settings.language')}</label>
                        <div className="relative">
                          <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                          <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none appearance-none"
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB: PROFILE */}
              {activeTab === "profile" && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="size-5 text-primary" />
                    {t('settings.profileInfo')}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="size-20 rounded-full bg-gradient-to-tr from-primary to-accent-cyan p-[2px]">
                        <div className="w-full h-full rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden">
                          <img 
                            src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAEDfjRXoeZlHub0rO43nIpQRONGJQ6h2fEPkYsLVlvMNaBey71u8MATZ5jqDxyIIImZE_SnNMgjcxC7OcSurkgcamBOLDmMSDp3xp-Apu2q9f0x6gHxWYv1Il4N-prkBzy1aRcd5UeWpI5EdkpCAsJpzZEA_V8eTHTVZHug4VL9QFfcVYbQp6StmtsBNwASWdWOhPh3n_8tL-aIOChx0-dCNL_pv5m6c_p_7hLgtLubHocGpu558-SPGiXOFDJdhjuh9gY8-rqjYtV"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-white/5 border border-border-muted text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-white/10 transition-all cursor-pointer">
                          {t('settings.changeAvatar')}
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </label>
                        <button 
                          onClick={() => updateProfile({ avatar: "" })}
                          className="px-4 py-2 rounded-lg text-red-500 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
                        >
                          {t('settings.removeAvatar')}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('settings.fullName')}</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('settings.emailAddress')}</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('settings.role')}</label>
                        <input 
                          type="text" 
                          value={user?.role === "admin" ? "Administrador da Plataforma" : user?.role === "operator" ? "Operador" : "Visualizador"}
                          disabled
                          className="w-full bg-slate-100 dark:bg-background-dark/50 border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('settings.timezone')}</label>
                        <select className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none appearance-none">
                          <option>Horário de Brasília (UTC-3)</option>
                          <option>Pacific Time (US & Canada)</option>
                          <option>Eastern Time (US & Canada)</option>
                          <option>UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB: SECURITY */}
              {activeTab === "security" && (
                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="size-5 text-primary" />
                    {t('settings.securityAndAccess')}
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Autenticação de Dois Fatores (2FA)</p>
                        <p className="text-xs text-slate-500">Adicione uma camada extra de segurança à sua conta de administrador.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Ativado
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Persistência de Sessão Criptografada</p>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Ativa • AES/XOR Encrypted
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Sessão persistida e sincronizada entre recargas de página e abas ativas.</p>
                      </div>
                      <button 
                        onClick={() => logout()}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                      >
                        Encerrar Sessão
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bell className="size-5 text-primary" />
                      Push Notifications & Firebase Cloud Messaging (FCM)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Configure notificações nativas em segundo plano para o aplicativo mobile Android e notificações Web Push.
                    </p>
                  </div>

                  {/* FCM Device & Permission Status Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-background-dark border border-primary/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                          <Smartphone className="size-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                              Canal Push Android & Web (FCM)
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              pushPermission === "granted"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : pushPermission === "denied"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            }`}>
                              {pushPermission === "granted" ? "Ativo • Conectado" : pushPermission === "denied" ? "Permissão Bloqueada" : "Pendente de Ativação"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isAndroidNativeApp() 
                              ? "Ambiente Android Nativo detectado (Capacitor / Android Bridge)." 
                              : "Service Worker com suporte a segundo plano (FCM HTTP v1 / Web Push)."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={handleRegisterPush}
                          disabled={isRegisteringPush}
                          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                        >
                          {isRegisteringPush ? (
                            <>
                              <RefreshCw className="size-3.5 animate-spin" />
                              <span>Registrando...</span>
                            </>
                          ) : (
                            <>
                              <Radio className="size-3.5" />
                              <span>{pushPermission === "granted" ? "Sincronizar Token" : "Ativar Notificações"}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleSendTestPush}
                          disabled={isSendingTestPush}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-border-muted transition-all disabled:opacity-50"
                          title="Enviar notificação push de teste"
                        >
                          {isSendingTestPush ? (
                            <RefreshCw className="size-3.5 animate-spin text-primary" />
                          ) : (
                            <Send className="size-3.5 text-accent-cyan" />
                          )}
                          <span>Testar Push</span>
                        </button>
                      </div>
                    </div>

                    {/* Active FCM Token */}
                    {fcmToken && (
                      <div className="p-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                            <Radio className="size-3 text-emerald-500" />
                            FCM Registration Device Token
                          </span>
                          <button
                            onClick={handleCopyToken}
                            className="text-primary hover:text-primary/80 font-bold flex items-center gap-1 text-[11px] transition-colors"
                          >
                            {copiedToken ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                            {copiedToken ? "Copiado!" : "Copiar Token"}
                          </button>
                        </div>
                        <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all bg-slate-100 dark:bg-black/30 p-2 rounded-lg border border-border-muted">
                          {fcmToken}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preference Toggles */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      Canais e Categorias de Notificação
                    </h4>

                    {/* Critical Alerts */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.criticalAlerts')}</p>
                        <p className="text-xs text-slate-500">{t('settings.criticalAlertsDesc')}</p>
                      </div>
                      <button onClick={() => handleTogglePref("criticalAlerts")}>
                        {notificationPrefs.criticalAlerts ? (
                          <ToggleRight className="size-8 text-primary cursor-pointer" />
                        ) : (
                          <ToggleLeft className="size-8 text-slate-400 dark:text-slate-600 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    {/* Approval Requests */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.approvalRequests')}</p>
                        <p className="text-xs text-slate-500">{t('settings.approvalRequestsDesc')}</p>
                      </div>
                      <button onClick={() => handleTogglePref("approvalRequests")}>
                        {notificationPrefs.approvalRequests ? (
                          <ToggleRight className="size-8 text-primary cursor-pointer" />
                        ) : (
                          <ToggleLeft className="size-8 text-slate-400 dark:text-slate-600 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    {/* Agent Status Changes */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Atividades e Mudanças de Status dos Agentes</p>
                        <p className="text-xs text-slate-500">Notificar quando agentes concluírem rotinas ou necessitarem de intervenção humana.</p>
                      </div>
                      <button onClick={() => handleTogglePref("agentStatusChanges")}>
                        {notificationPrefs.agentStatusChanges ? (
                          <ToggleRight className="size-8 text-primary cursor-pointer" />
                        ) : (
                          <ToggleLeft className="size-8 text-slate-400 dark:text-slate-600 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    {/* Weekly Reports */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.weeklyReports')}</p>
                        <p className="text-xs text-slate-500">{t('settings.weeklyReportsDesc')}</p>
                      </div>
                      <button onClick={() => handleTogglePref("weeklyReports")}>
                        {notificationPrefs.weeklyReports ? (
                          <ToggleRight className="size-8 text-primary cursor-pointer" />
                        ) : (
                          <ToggleLeft className="size-8 text-slate-400 dark:text-slate-600 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    {/* Hardware Feedback Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                        <div className="flex items-center gap-2.5">
                          <Volume2 className="size-4 text-primary" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Som de Alerta</p>
                            <p className="text-[10px] text-slate-500">Tocar áudio de notificação</p>
                          </div>
                        </div>
                        <button onClick={() => handleTogglePref("soundEnabled")}>
                          {notificationPrefs.soundEnabled ? (
                            <ToggleRight className="size-7 text-primary cursor-pointer" />
                          ) : (
                            <ToggleLeft className="size-7 text-slate-400 dark:text-slate-600 cursor-pointer" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                        <div className="flex items-center gap-2.5">
                          <Vibrate className="size-4 text-accent-cyan" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Vibração Tátil Android</p>
                            <p className="text-[10px] text-slate-500">Padrão háptico em segundo plano</p>
                          </div>
                        </div>
                        <button onClick={() => handleTogglePref("vibrationEnabled")}>
                          {notificationPrefs.vibrationEnabled ? (
                            <ToggleRight className="size-7 text-accent-cyan cursor-pointer" />
                          ) : (
                            <ToggleLeft className="size-7 text-slate-400 dark:text-slate-600 cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Android Background & FCM Integration Docs */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-border-muted space-y-3">
                    <h5 className="font-bold text-xs text-slate-300 flex items-center gap-2">
                      <Layers className="size-4 text-primary" />
                      Arquitetura Android Background (FCM HTTP v1 & Canais de Notificação)
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
                      <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
                        <span className="font-bold text-slate-200">Canais Android (NotificationChannels)</span>
                        <p className="text-[11px] leading-relaxed">
                          • <code className="text-primary font-mono">vibeflow_critical_alerts</code>: Prioridade máxima com som e vibração.<br />
                          • <code className="text-accent-cyan font-mono">vibeflow_approvals</code>: Ações rápidas com botões [Aprovar] e [Rejeitar].
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
                        <span className="font-bold text-slate-200">Isenção de Bateria (Doze Mode)</span>
                        <p className="text-[11px] leading-relaxed">
                          Para entrega instantânea em segundo plano no Android 14+, as mensagens utilizam prioridade <code className="text-emerald-400 font-mono">priority: "high"</code> no payload FCM.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB: BILLING */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <SubscriptionOverview />
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 to-fuchsia-900/20 border border-primary/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-primary text-white">
                          Licença Comercial & Código-Fonte
                        </span>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2">VibeFlow Enterprise SaaS</h4>
                      </div>
                      <span className="text-2xl font-black text-emerald-400">R$ 297,00</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Licença completa com código-fonte aberto TypeScript/React/Tailwind, direito de revenda e uso comercial sem royalties.
                    </p>

                    <div className="pt-2 flex gap-3">
                      <a
                        href="/checkout"
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/20"
                      >
                        Ver Detalhes do Checkout
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
