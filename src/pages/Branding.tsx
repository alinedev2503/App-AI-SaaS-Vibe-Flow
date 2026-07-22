import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  RotateCcw, 
  Check, 
  Layout, 
  Type, 
  Image as ImageIcon,
  Globe,
  Smartphone
} from "lucide-react";
import Seo from "@/components/Seo";

export default function Branding() {
  return (
    <>
      <Seo title="Configuração White-Label — VibeFlow" />
      <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Configuração White-Label</h2>
          <p className="text-slate-400 mt-1">Personalize a aparência da plataforma para sua organização.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-[#362348] bg-[#261933] text-slate-400 text-sm font-bold hover:bg-white/5 hover:text-white transition-all flex items-center gap-2">
            <RotateCcw className="size-4" />
            Restaurar Padrões
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Save className="size-4" />
            Publicar Alterações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Configuration Panel */}
        <div className="col-span-4 bg-[#261933] border border-[#362348] rounded-2xl flex flex-col overflow-hidden">
          <div className="flex border-b border-[#362348]">
            <button className="flex-1 py-4 text-sm font-bold text-white border-b-2 border-primary bg-primary/5">Geral</button>
            <button className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-colors">Cores</button>
            <button className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-colors">Tipografia</button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
            {/* Logo Upload */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="text-primary size-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ativos da Marca</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Logo Primário (Modo Escuro)</label>
                  <div className="border-2 border-dashed border-[#362348] rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="size-12 bg-[#362348] rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Upload className="text-slate-400 group-hover:text-primary size-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Clique para enviar</p>
                      <p className="text-xs text-slate-500">SVG, PNG ou JPG (máx 2MB)</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-[#362348] rounded-lg border border-[#362348] flex items-center justify-center">
                      <div className="size-6 bg-primary rounded-sm"></div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-[#362348] text-white text-xs font-bold hover:bg-white/5 transition-all">
                      Alterar
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-[#362348] w-full"></div>

            {/* Color Palette */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="text-primary size-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sistema de Cores</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Cor Primária</label>
                  <div className="flex items-center gap-2 bg-background-dark p-2 rounded-lg border border-[#362348]">
                    <div className="size-8 rounded bg-[#8c2bee] border border-white/10 shadow-inner"></div>
                    <input type="text" value="#8c2bee" className="bg-transparent text-white text-xs font-mono w-full outline-none" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Cor de Destaque</label>
                  <div className="flex items-center gap-2 bg-background-dark p-2 rounded-lg border border-[#362348]">
                    <div className="size-8 rounded bg-[#00f0ff] border border-white/10 shadow-inner"></div>
                    <input type="text" value="#00f0ff" className="bg-transparent text-white text-xs font-mono w-full outline-none" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Fundo</label>
                  <div className="flex items-center gap-2 bg-background-dark p-2 rounded-lg border border-[#362348]">
                    <div className="size-8 rounded bg-[#0f0a15] border border-white/10 shadow-inner"></div>
                    <input type="text" value="#0f0a15" className="bg-transparent text-white text-xs font-mono w-full outline-none" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Superfície</label>
                  <div className="flex items-center gap-2 bg-background-dark p-2 rounded-lg border border-[#362348]">
                    <div className="size-8 rounded bg-[#1c1126] border border-white/10 shadow-inner"></div>
                    <input type="text" value="#1c1126" className="bg-transparent text-white text-xs font-mono w-full outline-none" readOnly />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-[#362348] w-full"></div>

            {/* Typography */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Type className="text-primary size-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tipografia</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Família da Fonte</label>
                  <select className="w-full bg-background-dark border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none appearance-none">
                    <option>Inter (Default)</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Lato</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Peso do Título</label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded bg-[#362348] text-white text-xs font-bold border border-primary/50">Negrito</button>
                    <button className="flex-1 py-2 rounded bg-background-dark text-slate-400 text-xs font-medium border border-[#362348] hover:bg-white/5">Seminegrito</button>
                    <button className="flex-1 py-2 rounded bg-background-dark text-slate-400 text-xs font-normal border border-[#362348] hover:bg-white/5">Regular</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Live Preview */}
        <div className="col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-[#261933] border border-[#362348] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Eye className="size-4 text-primary" />
              Pré-visualização ao Vivo
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                <Globe className="size-4" />
              </button>
              <button className="p-2 rounded bg-[#362348] text-slate-400 hover:text-white transition-colors">
                <Smartphone className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-background-dark border border-[#362348] rounded-2xl overflow-hidden relative shadow-2xl">
            {/* Mock UI for Preview */}
            <div className="absolute inset-0 flex flex-col pointer-events-none select-none">
              {/* Mock Header */}
              <div className="h-14 border-b border-primary/10 bg-background-dark/50 backdrop-blur flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <div className="size-4 bg-white rounded-sm"></div>
                  </div>
                  <span className="font-bold text-lg text-white">BrandName</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-8 bg-[#261933] rounded-lg"></div>
                  <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-accent-cyan"></div>
                </div>
              </div>
              
              <div className="flex flex-1">
                {/* Mock Sidebar */}
                <div className="w-56 border-r border-primary/10 bg-background-dark p-4 space-y-2">
                  <div className="h-10 bg-primary/10 rounded-lg w-full border-l-4 border-primary"></div>
                  <div className="h-10 bg-transparent rounded-lg w-full"></div>
                  <div className="h-10 bg-transparent rounded-lg w-full"></div>
                  <div className="h-10 bg-transparent rounded-lg w-full"></div>
                </div>
                
                {/* Mock Content */}
                <div className="flex-1 p-8 bg-background-light dark:bg-background-dark">
                  <div className="h-8 w-48 bg-white/10 rounded mb-6"></div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="h-32 bg-[#1c1126]/60 border border-primary/20 rounded-xl backdrop-blur-md"></div>
                    <div className="h-32 bg-[#1c1126]/60 border border-primary/20 rounded-xl backdrop-blur-md"></div>
                    <div className="h-32 bg-[#1c1126]/60 border border-primary/20 rounded-xl backdrop-blur-md"></div>
                  </div>
                  <div className="mt-6 h-64 bg-[#1c1126]/60 border border-primary/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="size-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                        <Palette className="size-8 text-primary" />
                      </div>
                      <p className="text-slate-400 text-sm">Pré-visualize atualizações em tempo real</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

