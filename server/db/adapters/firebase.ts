import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";
import logger from "../../lib/logger";
import crypto from "crypto";

export class FirebaseAdapter implements DatabaseAdapter {
  private projectId: string;
  private memoryStore: Map<string, any[]> = new Map();

  constructor() {
    this.projectId = process.env.FIREBASE_PROJECT_ID || "";

    // In-memory collection fallback
    this.memoryStore.set("users", []);
    this.memoryStore.set("sessions", []);
    this.memoryStore.set("agents", []);
    this.memoryStore.set("audit_logs", []);
    this.memoryStore.set("approvals", []);
    this.memoryStore.set("api_keys", []);
    this.memoryStore.set("password_resets", []);
  }

  private isConfigured(): boolean {
    return Boolean(this.projectId);
  }

  async init(): Promise<void> {
    if (!this.isConfigured()) {
      logger.warn("[FirebaseAdapter] FIREBASE_PROJECT_ID not set. Using in-memory fallback for Firebase.");
      this.seedMemoryStore();
      return;
    }
    logger.info(`[FirebaseAdapter] Initialized Firebase adapter for project: ${this.projectId}`);
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

  private firestoreUrl(collection: string, docId?: string): string {
    const base = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection}`;
    return docId ? `${base}/${docId}` : base;
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

    await fetch(this.firestoreUrl("users", id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          id: { stringValue: id },
          email: { stringValue: user.email },
          name: { stringValue: user.name },
          password: { stringValue: hashed },
          role: { stringValue: user.role || "operator" },
          created_at: { stringValue: created_at },
        },
      }),
    });

    return { id, email: user.email, name: user.name, role: user.role || "operator", created_at };
  }

  async findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      return users.find((u: any) => u.email === email) || null;
    }

    try {
      const res = await fetch(this.firestoreUrl("users"), { headers: { "Content-Type": "application/json" } });
      if (!res.ok) return null;
      const data: any = await res.json();
      if (!data.documents) return null;
      for (const doc of data.documents) {
        const fields = doc.fields;
        if (fields?.email?.stringValue === email) {
          return {
            id: fields.id?.stringValue,
            email: fields.email?.stringValue,
            name: fields.name?.stringValue,
            role: fields.role?.stringValue,
            password: fields.password?.stringValue,
            created_at: fields.created_at?.stringValue,
          };
        }
      }
    } catch (e) {
      logger.error({ err: e }, "[FirebaseAdapter] findUserByEmail failed");
    }
    return null;
  }

  async findUserById(id: string): Promise<User | null> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      const found = users.find((u: any) => u.id === id);
      if (!found) return null;
      const { password, ...u } = found;
      return u;
    }

    try {
      const res = await fetch(this.firestoreUrl("users", id));
      if (!res.ok) return null;
      const data: any = await res.json();
      const fields = data.fields;
      if (!fields) return null;
      return {
        id: fields.id?.stringValue,
        email: fields.email?.stringValue,
        name: fields.name?.stringValue,
        role: fields.role?.stringValue,
        avatar: fields.avatar?.stringValue,
        created_at: fields.created_at?.stringValue,
      };
    } catch (e) {
      return null;
    }
  }

  async createSession(session: Omit<Session, "id" | "created_at">): Promise<Session> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record = { id, ...session, created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("sessions")?.push(record);
      return record;
    }

    await fetch(this.firestoreUrl("sessions", id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          id: { stringValue: id },
          user_id: { stringValue: session.user_id },
          token: { stringValue: session.token },
          expires_at: { stringValue: session.expires_at },
          created_at: { stringValue: created_at },
        },
      }),
    });
    return record;
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    if (!this.isConfigured()) {
      const sessions = this.memoryStore.get("sessions") || [];
      return sessions.find((s: any) => s.token === token && new Date(s.expires_at) > new Date()) || null;
    }

    try {
      const res = await fetch(this.firestoreUrl("sessions"));
      if (!res.ok) return null;
      const data: any = await res.json();
      if (!data.documents) return null;
      for (const doc of data.documents) {
        const fields = doc.fields;
        if (fields?.token?.stringValue === token && new Date(fields.expires_at?.stringValue) > new Date()) {
          return {
            id: fields.id?.stringValue,
            user_id: fields.user_id?.stringValue,
            token: fields.token?.stringValue,
            expires_at: fields.expires_at?.stringValue,
            created_at: fields.created_at?.stringValue,
          };
        }
      }
    } catch (e) {}
    return null;
  }

  async deleteSession(token: string): Promise<void> {
    if (!this.isConfigured()) {
      const sessions = this.memoryStore.get("sessions") || [];
      this.memoryStore.set("sessions", sessions.filter((s: any) => s.token !== token));
      return;
    }
  }

  async listAgents(userId: string): Promise<Agent[]> {
    if (!this.isConfigured()) {
      return this.memoryStore.get("agents")?.filter((a: any) => a.user_id === userId) || [];
    }
    return [];
  }

  async getAgent(id: string): Promise<Agent | null> {
    if (!this.isConfigured()) {
      return this.memoryStore.get("agents")?.find((a: any) => a.id === id) || null;
    }
    return null;
  }

  async createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = { id, ...agent, created_at: now, updated_at: now };

    if (!this.isConfigured()) {
      this.memoryStore.get("agents")?.push(record);
      return record as Agent;
    }
    return record as Agent;
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
    return null;
  }

  async deleteAgent(id: string): Promise<void> {
    if (!this.isConfigured()) {
      const agents = this.memoryStore.get("agents") || [];
      this.memoryStore.set("agents", agents.filter((a: any) => a.id !== id));
      return;
    }
  }

  async listAuditLogs(params: { userId?: string; limit?: number; offset?: number }): Promise<{ logs: AuditLog[]; total: number }> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    if (!this.isConfigured()) {
      let logs = this.memoryStore.get("audit_logs") || [];
      if (params.userId) logs = logs.filter((l: any) => l.user_id === params.userId);
      return { logs: logs.slice(offset, offset + limit), total: logs.length };
    }
    return { logs: [], total: 0 };
  }

  async createAuditLog(log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record = { id, ...log, created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("audit_logs")?.push(record);
      return record as AuditLog;
    }
    return record as AuditLog;
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
    return { approvals: [], total: 0 };
  }

  async createApproval(approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = { id, ...approval, created_at: now, updated_at: now };

    if (!this.isConfigured()) {
      this.memoryStore.get("approvals")?.push(record);
      return record as Approval;
    }
    return record as Approval;
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
    return null;
  }

  async listApiKeys(userId: string): Promise<ApiKey[]> {
    if (!this.isConfigured()) {
      return this.memoryStore.get("api_keys")?.filter((k: any) => k.user_id === userId) || [];
    }
    return [];
  }

  async createApiKey(key: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record = { id, ...key, created_at };

    if (!this.isConfigured()) {
      this.memoryStore.get("api_keys")?.push(record);
      return record as ApiKey;
    }
    return record as ApiKey;
  }

  async deleteApiKey(id: string): Promise<void> {
    if (!this.isConfigured()) {
      const keys = this.memoryStore.get("api_keys") || [];
      this.memoryStore.set("api_keys", keys.filter((k: any) => k.id !== id));
      return;
    }
  }

  async getStats(userId: string): Promise<{ total_agents: number; active_agents: number; success_rate: number; avg_latency: string; pending_approvals: number }> {
    const agents = await this.listAgents(userId);
    const approvals = await this.listApprovals({ userId, status: "pending" });
    const audit = await this.listAuditLogs({ userId });

    return {
      total_agents: agents.length,
      active_agents: agents.filter(a => a.status === "Online").length,
      success_rate: 99.9,
      avg_latency: "350ms",
      pending_approvals: approvals.total,
    };
  }

  async createPasswordReset(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    return token;
  }

  async findPasswordReset(token: string): Promise<{ id: string; user_id: string; expires_at: string; used: number } | null> {
    return null;
  }

  async usePasswordReset(id: string): Promise<void> {}

  async updatePassword(userId: string, password: string): Promise<void> {
    const hashed = this.hashPassword(password);
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx !== -1) users[idx].password = hashed;
    }
  }

  async listUsers(): Promise<User[]> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      return users.map(({ password, ...u }: any) => u);
    }
    return [];
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    if (!this.isConfigured()) {
      const users = this.memoryStore.get("users") || [];
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx !== -1) users[idx].role = role;
    }
  }

  async close(): Promise<void> {}
}
