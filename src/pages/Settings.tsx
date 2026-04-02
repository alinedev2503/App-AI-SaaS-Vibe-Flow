import { 
  Settings as SettingsIcon, 
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
  Languages
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">{t('settings.title')}</h2>
          <p className="text-slate-400 mt-1">Gerencie a configuração e preferências da plataforma.</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Save className="size-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">
            <User className="size-4" />
            <span>Perfil e Conta</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Shield className="size-4" />
            <span>Segurança e Acesso</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Bell className="size-4" />
            <span>Notificações</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Key className="size-4" />
            <span>Chaves de API</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Globe className="size-4" />
            <span>Integrações</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Palette className="size-4" />
            <span>Aparência</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <CreditCard className="size-4" />
            <span>Faturamento</span>
          </button>
          
          <div className="mt-auto pt-4 border-t border-[#362348]">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 font-medium text-sm transition-colors w-full">
              <LogOut className="size-4" />
              <span>{t('sidebar.logout')}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface border border-border-muted rounded-2xl overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-3xl space-y-8">
            {/* Appearance Section */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Palette className="size-5 text-primary" />
                {t('settings.theme')} & {t('settings.language')}
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
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

            <div className="h-px bg-border-muted w-full"></div>

            {/* Profile Section */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="size-5 text-primary" />
                Informações do Perfil
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-full bg-gradient-to-tr from-primary to-accent-cyan p-[2px]">
                    <div className="w-full h-full rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEDfjRXoeZlHub0rO43nIpQRONGJQ6h2fEPkYsLVlvMNaBey71u8MATZ5jqDxyIIImZE_SnNMgjcxC7OcSurkgcamBOLDmMSDp3xp-Apu2q9f0x6gHxWYv1Il4N-prkBzy1aRcd5UeWpI5EdkpCAsJpzZEA_V8eTHTVZHug4VL9QFfcVYbQp6StmtsBNwASWdWOhPh3n_8tL-aIOChx0-dCNL_pv5m6c_p_7hLgtLubHocGpu558-SPGiXOFDJdhjuh9gY8-rqjYtV" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-white/5 border border-border-muted text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-white/10 transition-all">
                      Alterar Avatar
                    </button>
                    <button className="px-4 py-2 rounded-lg text-red-500 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                      Remover
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nome Completo</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Rivera"
                      className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Endereço de Email</label>
                    <input 
                      type="email" 
                      defaultValue="alex.rivera@example.com"
                      className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Função</label>
                    <input 
                      type="text" 
                      defaultValue="Administrador da Plataforma"
                      disabled
                      className="w-full bg-slate-100 dark:bg-background-dark/50 border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Fuso Horário</label>
                    <select className="w-full bg-background-light dark:bg-background-dark border border-border-muted rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none appearance-none">
                      <option>Pacific Time (US & Canada)</option>
                      <option>Eastern Time (US & Canada)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-border-muted w-full"></div>

            {/* Notifications */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                Preferências de Notificação
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Alertas Críticos</p>
                    <p className="text-xs text-slate-500">Receba emails para violações de segurança e falhas do sistema.</p>
                  </div>
                  <ToggleRight className="size-8 text-primary cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Solicitações de Aprovação</p>
                    <p className="text-xs text-slate-500">Notifique quando um agente exigir aprovação humana.</p>
                  </div>
                  <ToggleRight className="size-8 text-primary cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-muted">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Relatórios Semanais</p>
                    <p className="text-xs text-slate-500">Resumo do desempenho e custos dos agentes.</p>
                  </div>
                  <ToggleLeft className="size-8 text-slate-400 dark:text-slate-600 cursor-pointer" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
