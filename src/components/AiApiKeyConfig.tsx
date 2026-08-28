import { useState, useEffect } from "react";
import { 
  Key, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Save, 
  Trash2, 
  RefreshCw, 
  HelpCircle,
  Zap,
  Lock,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { useAiKeys, AI_PROVIDERS, type AiProvider } from "@/contexts/AiKeysContext";
import { useToast } from "@/contexts/ToastContext";

interface AiApiKeyConfigProps {
  compact?: boolean;
  onSaved?: () => void;
  showHelpSection?: boolean;
}

export function AiApiKeyConfig({ compact = false, onSaved, showHelpSection = true }: AiApiKeyConfigProps) {
  const { 
    keys, 
    activeProvider, 
    isConfigured, 
    activeKey, 
    hasEnvKey,
    setActiveProvider, 
    saveKey, 
    removeKey, 
    testConnection 
  } = useAiKeys();

  const { toast } = useToast();

  const [selectedProvider, setSelectedProvider] = useState<AiProvider>(activeProvider);
  const [currentInputValue, setCurrentInputValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  // Sync input value when provider changes or keys load
  useEffect(() => {
    setSelectedProvider(activeProvider);
    setCurrentInputValue(keys[activeProvider] || "");
    setTestResult(null);
  }, [activeProvider, keys]);

  const handleProviderSelect = (provider: AiProvider) => {
    setSelectedProvider(provider);
    setActiveProvider(provider);
    setCurrentInputValue(keys[provider] || "");
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!currentInputValue.trim()) {
      toast("Insira a chave de API antes de testar.", "warning");
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection(selectedProvider, currentInputValue.trim());
      setTestResult(result);
      if (result.success) {
        toast("Conexão validada com sucesso!", "success");
      } else {
        toast("Erro ao testar a conexão com o provedor.", "error");
      }
    } catch {
      setTestResult({
        success: false,
        message: "Ocorreu um erro inesperado ao testar a conexão.",
      });
      toast("Falha na comunicação com a API.", "error");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!currentInputValue.trim()) {
      toast("Por favor, insira uma chave válida ou utilize o botão Limpar.", "warning");
      return;
    }

    saveKey(selectedProvider, currentInputValue.trim());
    toast(`Chave de ${AI_PROVIDERS[selectedProvider].name} salva com sucesso!`, "success");
    if (onSaved) onSaved();
  };

  const handleClear = () => {
    removeKey(selectedProvider);
    setCurrentInputValue("");
    setTestResult(null);
    toast(`Chave de ${AI_PROVIDERS[selectedProvider].name} removida.`, "info");
  };

  const currentProviderInfo = AI_PROVIDERS[selectedProvider];
  const isKeySaved = Boolean(keys[selectedProvider] && keys[selectedProvider].trim().length > 0);

  return (
    <div className={`rounded-2xl border border-primary/20 bg-surface/95 dark:bg-card-dark/95 backdrop-blur-xl p-6 shadow-xl ${compact ? "space-y-4" : "space-y-6"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-muted">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-primary/25">
            <Key className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Configuração da Chave de API de IA (BYOK)
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isConfigured 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
              }`}>
                {isConfigured ? "Pronto para Uso" : "Chave Requerida"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Insira sua credencial para autenticar as requisições dos agentes autônomos e assistentes.
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-border-muted text-[11px] text-slate-600 dark:text-slate-300 self-start sm:self-auto">
          <Lock className="size-3.5 text-primary" />
          <span>Armazenamento Seguro Local</span>
        </div>
      </div>

      {/* Provider Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Selecione o Provedor de IA</span>
          <span className="text-[11px] text-primary lowercase font-normal">
            Ativo no momento: {AI_PROVIDERS[activeProvider].name}
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(AI_PROVIDERS) as AiProvider[]).map((provKey) => {
            const prov = AI_PROVIDERS[provKey];
            const isSelected = selectedProvider === provKey;
            const hasKey = Boolean(keys[provKey] || (provKey === "gemini" && hasEnvKey));

            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => handleProviderSelect(provKey)}
                className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-border-muted bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {prov.name}
                  </span>
                  {hasKey && (
                    <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="Chave configurada" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    prov.id === "gemini"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                  }`}>
                    {prov.badge}
                  </span>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                      <Check className="size-3" /> Selecionado
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input and Quick Action Form */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Chave de API ({currentProviderInfo.name})</span>
            {currentProviderInfo.recommended && (
              <span className="text-[10px] bg-primary/20 text-primary font-extrabold px-1.5 py-0.5 rounded">
                Recomendado
              </span>
            )}
          </label>

          <a
            href={currentProviderInfo.consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-light font-bold hover:underline"
          >
            <span>Gerar chave no {currentProviderInfo.consoleLabel}</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={currentInputValue}
            onChange={(e) => {
              setCurrentInputValue(e.target.value);
              setTestResult(null);
            }}
            placeholder={`Cole sua chave aqui (ex: ${currentProviderInfo.placeholder})`}
            className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-xl pl-4 pr-24 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-mono"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              title={showPassword ? "Ocultar chave" : "Exibir chave"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>

            {currentInputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                title="Limpar chave"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Informational description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {currentProviderInfo.description} <strong>{currentProviderInfo.pricingInfo}</strong>
        </p>

        {/* Test Result Display */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed transition-all ${
              testResult.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold">{testResult.success ? "Conexão Validada!" : "Falha na Verificação"}</p>
              <p className="mt-0.5">{testResult.message}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !currentInputValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-extrabold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border-muted"
            >
              <RefreshCw className={`size-3.5 ${isTesting ? "animate-spin text-primary" : ""}`} />
              <span>{isTesting ? "Testando Conexão..." : "Testar Conexão"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!currentInputValue.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/90 hover:to-fuchsia-500 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-primary/25 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-primary/40"
            >
              <Save className="size-3.5" />
              <span>Salvar Chave API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Help & Consoles Section */}
      {showHelpSection && (
        <div className="pt-4 border-t border-border-muted space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <HelpCircle className="size-4 text-primary" />
            <span>Ajuda Rápida • Onde Obter Chaves Gratuitas ou Comerciais</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Google AI Studio */}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-border-muted hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                  Google AI Studio
                </span>
                <ExternalLink className="size-3 text-slate-400 group-hover:text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Gere em 30 segundos uma chave gratuita para o Gemini 3 Flash e Pro.
              </p>
              <span className="inline-block mt-2 text-[10px] text-emerald-500 font-extrabold uppercase">
                Tier Gratuito Imediato →
              </span>
            </a>

            {/* OpenAI Platform */}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-border-muted hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                  OpenAI Platform
                </span>
                <ExternalLink className="size-3 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Acesse o dashboard da OpenAI para criar chaves secretas para GPT-4o.
              </p>
              <span className="inline-block mt-2 text-[10px] text-cyan-500 font-extrabold uppercase">
                Acessar Dashboard →
              </span>
            </a>

            {/* Anthropic Console */}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-border-muted hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">
                  Anthropic Console
                </span>
                <ExternalLink className="size-3 text-slate-400 group-hover:text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Gere chaves para modelos Claude 3.5 Sonnet e Claude 3.7.
              </p>
              <span className="inline-block mt-2 text-[10px] text-amber-500 font-extrabold uppercase">
                Acessar Console →
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
