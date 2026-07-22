import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import Seo from "@/components/Seo";
import { post } from "@/lib/api/client";

interface ForgotResponse {
  error?: string;
  token?: string;
  message?: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "sent" | "reset" | "done">("form");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await post<ForgotResponse>("/api/auth/forgot-password", { email });
      if (res.error) { setError(res.error); return; }
      if (res.token) setToken(res.token);
      setStep("sent");
    } catch {
      setError("Erro ao solicitar recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Senhas não conferem"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await post<ForgotResponse>("/api/auth/reset-password", { token, password });
      if (res.error) { setError(res.error); return; }
      setStep("done");
    } catch {
      setError("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Recuperar Senha" description="Recupere o acesso à sua conta VibeFlow." />
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="w-full max-w-md bg-[#1c1126]/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
              <Sparkles className="size-6" />
            </div>
            {step === "form" && (
              <>
                <h1 className="text-2xl font-black text-white tracking-tight">Recuperar Senha</h1>
                <p className="text-slate-400 text-sm mt-2 text-center">Digite seu email para receber o link de recuperação.</p>
              </>
            )}
            {step === "sent" && (
              <>
                <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle className="size-6" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Email Enviado</h1>
                <p className="text-slate-400 text-sm mt-2 text-center">Verifique sua caixa de entrada. (Modo dev: use o token abaixo)</p>
                {token && (
                  <div className="mt-4 w-full bg-[#0f0720] rounded-xl p-3 border border-primary/10">
                    <p className="text-xs text-slate-500 mb-1">Token (desenvolvimento):</p>
                    <p className="text-xs text-primary font-mono break-all">{token}</p>
                  </div>
                )}
              </>
            )}
            {step === "reset" && (
              <h1 className="text-2xl font-black text-white tracking-tight">Nova Senha</h1>
            )}
            {step === "done" && (
              <>
                <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle className="size-6" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Senha Redefinida</h1>
                <p className="text-slate-400 text-sm mt-2 text-center">Sua senha foi redefinida com sucesso.</p>
              </>
            )}
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {step === "form" && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </button>
            </form>
          )}

          {step === "sent" && (
            <button
              onClick={() => { setStep("reset"); if (token) setToken(token); }}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Tenho o Token
            </button>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Cole o token"
                  required
                  className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Nova Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  minLength={6}
                  className="w-full bg-[#0f0720] border border-primary/20 rounded-xl py-3 px-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </button>
            </form>
          )}

          {step === "done" && (
            <Link
              to="/login"
              className="block w-full text-center py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Fazer Login
            </Link>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="size-3" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
