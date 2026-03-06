import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Github, 
  Chrome 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-accent-cyan/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md bg-[#1c1126]/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
            <Sparkles className="size-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Bem-vindo de Volta</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">Faça login para acessar sua força de trabalho autônoma.</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase ml-1">Endereço de Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-4" />
              <input 
                type="email" 
                className="w-full bg-[#261933] border border-[#362348] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                placeholder="nome@empresa.com" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Senha</label>
              <a href="#" className="text-xs text-primary hover:underline font-medium">Esqueceu a senha?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-4" />
              <input 
                type="password" 
                className="w-full bg-[#261933] border border-[#362348] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <Link to="/" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 mt-6 group">
            Entrar
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#362348]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1c1126] px-2 text-slate-500 font-bold">Ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#261933] border border-[#362348] rounded-xl text-white text-sm font-bold hover:bg-white/5 transition-all">
            <Github className="size-4" />
            GitHub
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#261933] border border-[#362348] rounded-xl text-white text-sm font-bold hover:bg-white/5 transition-all">
            <Chrome className="size-4 text-blue-500" />
            Google
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Não tem uma conta? <a href="#" className="text-primary font-bold hover:underline">Solicitar Acesso</a>
        </p>
      </div>
      
      <div className="absolute bottom-4 text-[10px] text-slate-600 font-mono">
        Plataforma Agêntica Aether v2.4.0-alpha
      </div>
    </div>
  );
}
