import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot, 
  Network, 
  CheckSquare, 
  FileText, 
  Settings, 
  Plus, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Painel de Controle", path: "/" },
    { icon: Sparkles, label: "Centro de Comando", path: "/command" },
    { icon: Bot, label: "Central de Agentes", path: "/agents" },
    { icon: Network, label: "Gateway MCP", path: "/mcp" },
    { icon: CheckSquare, label: "Fila de Aprovação", path: "/approvals", badge: 12 },
    { icon: FileText, label: "Logs de Auditoria", path: "/audit" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <aside className="w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark hidden md:flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <Sparkles className="size-5" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Aether</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-primary/10">
        <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
          <Plus className="size-4" />
          Novo Agente
        </button>
      </div>
    </aside>
  );
}
