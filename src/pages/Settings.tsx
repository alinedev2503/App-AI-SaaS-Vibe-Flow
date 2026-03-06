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
  Save
} from "lucide-react";

export default function Settings() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
          <p className="text-slate-400 mt-1">Manage platform configuration and preferences.</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Save className="size-4" />
          Save Changes
        </button>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">
            <User className="size-4" />
            <span>Profile & Account</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Shield className="size-4" />
            <span>Security & Access</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Bell className="size-4" />
            <span>Notifications</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Key className="size-4" />
            <span>API Keys</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Globe className="size-4" />
            <span>Integrations</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <Palette className="size-4" />
            <span>Appearance</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
            <CreditCard className="size-4" />
            <span>Billing</span>
          </button>
          
          <div className="mt-auto pt-4 border-t border-[#362348]">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 font-medium text-sm transition-colors w-full">
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#261933] border border-[#362348] rounded-2xl overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-3xl space-y-8">
            {/* Profile Section */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="size-5 text-primary" />
                Profile Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-full bg-gradient-to-tr from-primary to-accent-cyan p-[2px]">
                    <div className="w-full h-full rounded-full bg-background-dark flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEDfjRXoeZlHub0rO43nIpQRONGJQ6h2fEPkYsLVlvMNaBey71u8MATZ5jqDxyIIImZE_SnNMgjcxC7OcSurkgcamBOLDmMSDp3xp-Apu2q9f0x6gHxWYv1Il4N-prkBzy1aRcd5UeWpI5EdkpCAsJpzZEA_V8eTHTVZHug4VL9QFfcVYbQp6StmtsBNwASWdWOhPh3n_8tL-aIOChx0-dCNL_pv5m6c_p_7hLgtLubHocGpu558-SPGiXOFDJdhjuh9gY8-rqjYtV" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 rounded-lg bg-white/5 border border-[#362348] text-white text-xs font-bold hover:bg-white/10 transition-all">
                      Change Avatar
                    </button>
                    <button className="px-4 py-2 rounded-lg text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Rivera"
                      className="w-full bg-background-dark border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="alex.rivera@example.com"
                      className="w-full bg-background-dark border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                    <input 
                      type="text" 
                      defaultValue="Platform Administrator"
                      disabled
                      className="w-full bg-background-dark/50 border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Timezone</label>
                    <select className="w-full bg-background-dark border border-[#362348] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none appearance-none">
                      <option>Pacific Time (US & Canada)</option>
                      <option>Eastern Time (US & Canada)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-[#362348] w-full"></div>

            {/* Notifications */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background-dark border border-[#362348]">
                  <div>
                    <p className="text-sm font-bold text-white">Critical Alerts</p>
                    <p className="text-xs text-slate-500">Receive emails for security breaches and system failures.</p>
                  </div>
                  <ToggleRight className="size-8 text-primary cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background-dark border border-[#362348]">
                  <div>
                    <p className="text-sm font-bold text-white">Approval Requests</p>
                    <p className="text-xs text-slate-500">Notify when an agent requires human approval.</p>
                  </div>
                  <ToggleRight className="size-8 text-primary cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background-dark border border-[#362348]">
                  <div>
                    <p className="text-sm font-bold text-white">Weekly Reports</p>
                    <p className="text-xs text-slate-500">Summary of agent performance and costs.</p>
                  </div>
                  <ToggleLeft className="size-8 text-slate-600 cursor-pointer" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
