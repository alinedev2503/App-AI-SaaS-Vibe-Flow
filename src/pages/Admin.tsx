import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shield, Crown, Search, AlertCircle } from "lucide-react";
import Seo from "@/components/Seo";
import { EmptyState } from "@/components/EmptyState";
import { TableSkeleton } from "@/components/Skeleton";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { get } from "@/lib/api/client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  created_at: string;
}

interface UsersResponse {
  users: User[];
}

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    loadUsers();
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const data = await get<UsersResponse>("/api/auth/users");
      setUsers(data.users || []);
    } catch {
      toast("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId: string, role: string) => {
    try {
      await fetch("/api/auth/users/" + userId + "/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ role }),
      });
      toast("Permissão atualizada", "success");
      loadUsers();
    } catch {
      toast("Erro ao atualizar permissão", "error");
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Seo title="Administração" description="Gerencie usuários e permissões da plataforma VibeFlow." />
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Administração</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie usuários e permissões da plataforma.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar usuários..."
              className="w-full bg-white dark:bg-[#1c1126] border border-border-muted dark:border-[#362348] rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1126]/60 border border-border-muted dark:border-[#362348] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} cols={4} /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="search"
              title="Nenhum usuário encontrado"
              description={search ? "Tente outros termos de busca." : "Nenhum usuário cadastrado."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-muted dark:border-[#362348]">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Membro Desde</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-muted dark:divide-[#362348]">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === "admin" ? "bg-primary/10 text-primary" :
                          u.role === "operator" ? "bg-emerald-500/10 text-emerald-400" :
                          "bg-slate-500/10 text-slate-400"
                        }`}>
                          {u.role === "admin" ? <Crown className="size-3" /> :
                           u.role === "operator" ? <Users className="size-3" /> :
                           <Shield className="size-3" />}
                          {u.role === "admin" ? "Admin" : u.role === "operator" ? "Operador" : "Visualizador"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(u.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== currentUser?.id && (
                          <select
                            value={u.role}
                            onChange={e => changeRole(u.id, e.target.value)}
                            className="bg-[#0f0720] border border-primary/20 rounded-lg px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="viewer">Visualizador</option>
                            <option value="operator">Operador</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
