import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";
import logger from "../../lib/logger";
import crypto from "crypto";

export class SupabaseAdapter implements DatabaseAdapter {
  private url: string;
  private key: string;
  private memoryStore: Map<string, any[]> = new Map();

  constructor() {
    this.url = process.env.SUPABASE_URL || "";
    this.key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "";

    // Initialize in-memory fallback collections
    this.memoryStore.set("users", []);
    this.memoryStore.set("sessions", []);
    this.memoryStore.set("agents", []);
    this.memoryStore.set("audit_logs", []);
    this.memoryStore.set("approvals", []);
    this.memoryStore.set("api_keys", []);
    this.memoryStore.set("password_resets", []);
  }

  private isConfigured(): boolean {
    return Boolean(this.url && this.key);
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      "apikey": this.key,
      "Authorization": `Bearer ${this.key}`,
      "Prefer": "return=representation",
    };
  }

  async init(): Promise<void> {
    if (!this.isConfigured()) {
      logger.warn("[SupabaseAdapter] SUPABASE_URL / SUPABASE_SERVICE_KEY not set. Using in-memory fallback for Supabase.");
      this.seedMemoryStore();
      return;
    }
    logger.info("[SupabaseAdapter] Initialized Supabase adapter successfully.");
  }

  private seedMemoryStore() {
    const demoId = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync("admin123", salt, 1000, 64, "sha512").toString("hex");
    const password = `${salt}:${hash}`;

    const adminUser: User & { password: string } = {
      id: demoId,
      email: "admin@vibeflow.ai",
      name: "Alex Rivera",
      role: "admin",
      password,
      created_at: new Date().toISOString(),
    };

    this.memoryStore.get("users")?.push(adminUser);
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === computed;
  }

  async createUser(user: Omit<User, "id" | "created_at"> & { password: string }): Promise<User> {
    const id = crypto.randomUUID();
    const hashed = this.hashPassword(user.password);
    const created_at = new Date().toISOString();
    const record = { id, email: user.email, name: user.name, password: hashed, role: user.role || "operator", created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("users")?.push(record);
      return { id, email: user.email, name: user.name, role: user.role || "operator", created_at };
    }

    const res = await fetch(`${this.url}/rest/v1/users`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.error(`[SupabaseAdapter] createUser failed: ${err}`);
      throw new Error(`Supabase createUser error: ${res.statusText}`);
    }

    return { id, email: user.email, name: user.name, role: user.role || "operator", created_at };
  }

  async findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      return users.find((u: any) => u.email === email) || null;
    }

    const res = await fetch(`${this.url}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`, {
      headers: this.headers,
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    return data[0] || null;
  }

  async findUserById(id: string): Promise<User | null> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      const found = users.find((u: any) => u.id === id);
      if (!found) return null;
      const { password, ...u } = found;
      return u;
    }

    const res = await fetch(`${this.url}/rest/v1/users?id=eq.${encodeURIComponent(id)}&select=id,email,name,role,avatar,created_at`, {
      headers: this.headers,
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    return data[0] || null;
  }

  async createSession(session: Omit<Session, "id" | "created_at">): Promise<Session> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record = { id, ...session, created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("sessions")?.push(record);
      return record;
    }

    await fetch(`${this.url}/rest/v1/sessions`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });
    return record;
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    if (!this.isConfigured()) {
      const sessions = this.memoryStore.get("sessions") || [];
      const found = sessions.find((s: any) => s.token === token && new Date(s.expires_at) > new Date());
      return found || null;
    }

    const res = await fetch(`${this.url}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}&select=*`, {
      headers: this.headers,
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    return data[0] || null;
  }

  async deleteSession(token: string): Promise<void> {
    if (!this.isConfigured()) {
      const sessions = this.memoryStore.get("sessions") || [];
      this.memoryStore.set("sessions", sessions.filter((s: any) => s.token !== token));
      return;
    }

    await fetch(`${this.url}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  async listAgents(userId: string): Promise<Agent[]> {
    if (!this.isConfigured()) {
      return this.memoryStore.get("agents")?.filter((a: any) => a.user_id === userId) || [];
    }

    const res = await fetch(`${this.url}/rest/v1/agents?user_id=eq.${encodeURIComponent(userId)}&order=created_at.asc`, {
      headers: this.headers,
    });
    if (!res.ok) return [];
    return await res.json() as Agent[];
  }

  async getAgent(id: string): Promise<Agent | null> {
    if (!this.isConfigured()) {
      return this.memoryStore.get("agents")?.find((a: any) => a.id === id) || null;
    }

    const res = await fetch(`${this.url}/rest/v1/agents?id=eq.${encodeURIComponent(id)}`, {
      headers: this.headers,
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    return data[0] || null;
  }

  async createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = { id, ...agent, created_at: now, updated_at: now };

    if (!this.isConfigured()) {
      this.memoryStore.get("agents")?.push(record);
      return record as Agent;
    }

    const res = await fetch(`${this.url}/rest/v1/agents`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });
    const data: any = await res.json();
    return data[0] || record;
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent | null> {
    const now = new Date().toISOString();
    if (!this.isConfigured()) {
      const agents = this.memoryStore.get("agents") || [];
      const idx = agents.findIndex((a: any) => a.id === id);
      if (idx !== -1) {
        agents[idx] = { ...agents[idx], ...data, updated_at: now };
        return agents[idx];
      }
      return null;
    }

    const res = await fetch(`${this.url}/rest/v1/agents?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ ...data, updated_at: now }),
    });
    if (!res.ok) return null;
    const resData: any = await res.json();
    return resData[0] || null;
  }

  async deleteAgent(id: string): Promise<void> {
    if (!this.isConfigured()) {
      const agents = this.memoryStore.get("agents") || [];
      this.memoryStore.set("agents", agents.filter((a: any) => a.id !== id));
      return;
    }

    await fetch(`${this.url}/rest/v1/agents?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  async listAuditLogs(params: { userId?: string; limit?: number; offset?: number }): Promise<{ logs: AuditLog[]; total: number }> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    if (!this.isConfigured()) {
      let logs = this.memoryStore.get("audit_logs") || [];
      if (params.userId) logs = logs.filter((l: any) => l.user_id === params.userId);
      return { logs: logs.slice(offset, offset + limit), total: logs.length };
    }

    let url = `${this.url}/rest/v1/audit_logs?order=created_at.desc&limit=${limit}&offset=${offset}`;
    if (params.userId) url += `&user_id=eq.${encodeURIComponent(params.userId)}`;

    const res = await fetch(url, { headers: { ...this.headers, "Prefer": "count=exact" } });
    if (!res.ok) return { logs: [], total: 0 };
    const logs = await res.json() as AuditLog[];
    const contentRange = res.headers.get("content-range");
    const total = contentRange ? parseInt(contentRange.split("/")[1] || "0", 10) : logs.length;

    return { logs, total };
  }

  async createAuditLog(log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record = { id, ...log, created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("audit_logs")?.push(record);
      return record as AuditLog;
    }

    const res = await fetch(`${this.url}/rest/v1/audit_logs`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });
    const data: any = await res.json();
    return data[0] || record;
  }

  async listApprovals(params: { userId?: string; status?: string; limit?: number; offset?: number }): Promise<{ approvals: Approval[]; total: number }> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    if (!this.isConfigured()) {
      let apps = this.memoryStore.get("approvals") || [];
      if (params.userId) apps = apps.filter((a: any) => a.user_id === params.userId);
      if (params.status) apps = apps.filter((a: any) => a.status === params.status);
      return { approvals: apps.slice(offset, offset + limit), total: apps.length };
    }

    let url = `${this.url}/rest/v1/approvals?order=created_at.desc&limit=${limit}&offset=${offset}`;
    if (params.userId) url += `&user_id=eq.${encodeURIComponent(params.userId)}`;
    if (params.status) url += `&status=eq.${encodeURIComponent(params.status)}`;

    const res = await fetch(url, { headers: { ...this.headers, "Prefer": "count=exact" } });
    if (!res.ok) return { approvals: [], total: 0 };
    const approvals = await res.json() as Approval[];
    const contentRange = res.headers.get("content-range");
    const total = contentRange ? parseInt(contentRange.split("/")[1] || "0", 10) : approvals.length;

    return { approvals, total };
  }

  async createApproval(approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = { id, ...approval, created_at: now, updated_at: now };

    if (!this.isConfigured()) {
      this.memoryStore.get("approvals")?.push(record);
      return record as Approval;
    }

    const res = await fetch(`${this.url}/rest/v1/approvals`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });
    const data: any = await res.json();
    return data[0] || record;
  }

  async updateApproval(id: string, data: Partial<Approval>): Promise<Approval | null> {
    const now = new Date().toISOString();
    if (!this.isConfigured()) {
      const apps = this.memoryStore.get("approvals") || [];
      const idx = apps.findIndex((a: any) => a.id === id);
      if (idx !== -1) {
        apps[idx] = { ...apps[idx], ...data, updated_at: now };
        return apps[idx];
      }
      return null;
    }

    const res = await fetch(`${this.url}/rest/v1/approvals?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ ...data, updated_at: now }),
    });
    if (!res.ok) return null;
    const resData: any = await res.json();
    return resData[0] || null;
  }

  async listApiKeys(userId: string): Promise<ApiKey[]> {
    if (!this.isConfigured()) {
      return this.memoryStore.get("api_keys")?.filter((k: any) => k.user_id === userId) || [];
    }

    const res = await fetch(`${this.url}/rest/v1/api_keys?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`, {
      headers: this.headers,
    });
    if (!res.ok) return [];
    return await res.json() as ApiKey[];
  }

  async createApiKey(key: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record = { id, ...key, created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("api_keys")?.push(record);
      return record as ApiKey;
    }

    const res = await fetch(`${this.url}/rest/v1/api_keys`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });
    const data: any = await res.json();
    return data[0] || record;
  }

  async deleteApiKey(id: string): Promise<void> {
    if (!this.isConfigured()) {
      const keys = this.memoryStore.get("api_keys") || [];
      this.memoryStore.set("api_keys", keys.filter((k: any) => k.id !== id));
      return;
    }

    await fetch(`${this.url}/rest/v1/api_keys?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  async getStats(userId: string): Promise<{ total_agents: number; active_agents: number; success_rate: number; avg_latency: string; pending_approvals: number }> {
    const agents = await this.listAgents(userId);
    const approvals = await this.listApprovals({ userId, status: "pending" });
    const audit = await this.listAuditLogs({ userId });

    const total_agents = agents.length;
    const active_agents = agents.filter(a => a.status === "Online").length;
    const pending_approvals = approvals.total;
    const successCount = audit.logs.filter(l => l.status === "success").length;
    const success_rate = audit.total > 0 ? Math.round((successCount / audit.total) * 1000) / 10 : 99.8;

    return {
      total_agents,
      active_agents,
      success_rate,
      avg_latency: "380ms",
      pending_approvals,
    };
  }

  async createPasswordReset(userId: string): Promise<string> {
    const id = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 3600000).toISOString();
    const record = { id, user_id: userId, token, expires_at, used: 0 };

    if (!this.isConfigured()) {
      this.memoryStore.get("password_resets")?.push(record);
      return token;
    }

    await fetch(`${this.url}/rest/v1/password_resets`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(record),
    });
    return token;
  }

  async findPasswordReset(token: string): Promise<{ id: string; user_id: string; expires_at: string; used: number } | null> {
    if (!this.isConfigured()) {
      const resets = this.memoryStore.get("password_resets") || [];
      const found = resets.find((r: any) => r.token === token && r.used === 0 && new Date(r.expires_at) > new Date());
      return found || null;
    }

    const res = await fetch(`${this.url}/rest/v1/password_resets?token=eq.${encodeURIComponent(token)}&used=eq.0&select=*`, {
      headers: this.headers,
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    return data[0] || null;
  }

  async usePasswordReset(id: string): Promise<void> {
    if (!this.isConfigured()) {
      const resets = this.memoryStore.get("password_resets") || [];
      const idx = resets.findIndex((r: any) => r.id === id);
      if (idx !== -1) resets[idx].used = 1;
      return;
    }

    await fetch(`${this.url}/rest/v1/password_resets?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ used: 1 }),
    });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const hashed = this.hashPassword(password);
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx !== -1) users[idx].password = hashed;
      return;
    }

    await fetch(`${this.url}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ password: hashed }),
    });
  }

  async listUsers(): Promise<User[]> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      return users.map(({ password, ...u }: any) => u);
    }

    const res = await fetch(`${this.url}/rest/v1/users?select=id,email,name,role,avatar,created_at&order=created_at.desc`, {
      headers: this.headers,
    });
    if (!res.ok) return [];
    return await res.json() as User[];
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx !== -1) users[idx].role = role;
      return;
    }

    await fetch(`${this.url}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ role }),
    });
  }

  async close(): Promise<void> {}
}
