import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";

export class SqliteAdapter implements DatabaseAdapter {
  private db!: Database.Database;

  constructor(private dbPath: string) {}

  async init(): Promise<void> {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(this.dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.runMigrations();
  }

  private runMigrations(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'operator',
        avatar TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Idle',
        icon TEXT NOT NULL DEFAULT 'Brain',
        icon_color TEXT NOT NULL DEFAULT 'text-primary',
        icon_bg TEXT NOT NULL DEFAULT 'bg-primary/10',
        memory_usage TEXT NOT NULL DEFAULT '0',
        memory_total TEXT NOT NULL DEFAULT '128k',
        memory_percent INTEGER NOT NULL DEFAULT 0,
        capabilities TEXT NOT NULL DEFAULT '[]',
        objective TEXT DEFAULT '',
        tone TEXT DEFAULT 'Profissional',
        long_term_memory INTEGER NOT NULL DEFAULT 1,
        context_persistence INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id TEXT NOT NULL,
        actor TEXT NOT NULL,
        actor_type TEXT NOT NULL DEFAULT 'user',
        action TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'success',
        details TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        request_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        action_type TEXT NOT NULL,
        description TEXT NOT NULL,
        client TEXT DEFAULT '',
        risk_level TEXT NOT NULL DEFAULT 'medium',
        status TEXT NOT NULL DEFAULT 'pending',
        queue_time TEXT NOT NULL DEFAULT '0s',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        key_prefix TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_used TEXT
      );
    `);

    this.seedIfEmpty();
  }

  private seedIfEmpty(): void {
    const count = this.db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    if (count.count > 0) return;

    const demoId = crypto.randomUUID();
    const hashed = this.hashPassword("admin123");

    this.db.prepare(`
      INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)
    `).run(demoId, "admin@vibeflow.ai", "Alex Rivera", hashed, "admin");

    const agents = [
      { name: "Especialista em Vendas", role: "Prospecção Direta e CRM", status: "Online", icon: "DollarSign", icon_color: "text-primary", icon_bg: "bg-primary/10", memory_usage: "6.4k", memory_total: "128k", memory_percent: 15, capabilities: ["FileText", "Eye", "Mic"], objective: "Impulsionar a geração de leads qualificados através de prospecção hiper-personalizada." },
      { name: "Especialista em Suporte", role: "Agente de Sucesso do Cliente", status: "Learning", icon: "Headphones", icon_color: "text-slate-400", icon_bg: "bg-[#362348]", memory_usage: "42k", memory_total: "128k", memory_percent: 33, capabilities: ["FileText", "Eye"], objective: "Resolver tickets de suporte com empatia e eficiência." },
      { name: "Analista de Pesquisa", role: "Motor de Mercado e Tendências", status: "Idle", icon: "Globe", icon_color: "text-slate-400", icon_bg: "bg-[#362348]", memory_usage: "0", memory_total: "256k", memory_percent: 0, capabilities: ["FileText", "Globe"], objective: "Fornecer inteligência de mercado acionável." },
      { name: "Analista de Dados", role: "Processamento e Visualização", status: "Online", icon: "TrendingUp", icon_color: "text-emerald-500", icon_bg: "bg-emerald-500/10", memory_usage: "85k", memory_total: "256k", memory_percent: 33, capabilities: ["FileText", "Database"], objective: "Transformar dados brutos em insights visuais." },
      { name: "Especialista em Marketing", role: "Criação de Conteúdo e SEO", status: "Paused", icon: "LayoutGrid", icon_color: "text-orange-500", icon_bg: "bg-orange-500/10", memory_usage: "12k", memory_total: "128k", memory_percent: 9, capabilities: ["FileText", "Eye", "Globe"], objective: "Criar conteúdo otimizado para SEO e engajamento." },
      { name: "Coordenador de Projetos", role: "Gestão de Tarefas e Equipe", status: "Online", icon: "Users", icon_color: "text-accent-cyan", icon_bg: "bg-accent-cyan/10", memory_usage: "24k", memory_total: "128k", memory_percent: 18, capabilities: ["FileText", "Mic"], objective: "Coordenar tarefas e manter a equipe alinhada." },
    ];

    const insertAgent = this.db.prepare(`
      INSERT INTO agents (id, user_id, name, role, status, icon, icon_color, icon_bg, memory_usage, memory_total, memory_percent, capabilities, objective)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const a of agents) {
      insertAgent.run(crypto.randomUUID(), demoId, a.name, a.role, a.status, a.icon, a.icon_color, a.icon_bg, a.memory_usage, a.memory_total, a.memory_percent, JSON.stringify(a.capabilities), a.objective);
    }

    const insertAudit = this.db.prepare(`
      INSERT INTO audit_logs (id, user_id, event_id, actor, actor_type, action, status) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getTime() - i * 900000);
      insertAudit.run(crypto.randomUUID(), demoId, `EVT-${99281 - i}`, i === 2 ? "Alex Rivera" : (i === 1 ? "Sistema (Auto)" : "IP Externo"), i === 2 ? "user" : "system", ["Configuração do Agente atualizada", "Chaves de API rotacionadas", "Tentativa de login falha (3x)"][i], i === 2 ? "success" : (i === 1 ? "success" : "blocked"));
    }

    const insertApproval = this.db.prepare(`
      INSERT INTO approvals (id, user_id, request_id, agent_id, agent_name, action_type, description, client, risk_level, status, queue_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const approvals = [
      { rid: "REQ-8821", aid: "1", agent: "Agente de Vendas", action: "Aprovar Reembolso > $500", desc: "Cliente: Acme Corp", risk: "high", qtime: "2m 14s" },
      { rid: "REQ-8820", aid: "2", agent: "Agente de Suporte", action: "Escalar Ticket #992", desc: "Motivo: Sentimento Negativo", risk: "medium", qtime: "5m 42s" },
      { rid: "REQ-8819", aid: "3", agent: "Agente Legal", action: "Publicar Rascunho de Contrato", desc: "Cliente: TechStart Inc.", risk: "critical", qtime: "12m 05s" },
    ];
    for (const ap of approvals) {
      insertApproval.run(crypto.randomUUID(), demoId, ap.rid, ap.aid, ap.agent, ap.action, ap.desc, "", ap.risk, "pending", ap.qtime);
    }
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(":");
    const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === computed;
  }

  private uid(): string {
    return crypto.randomUUID();
  }

  async createUser(user: Omit<User, "id" | "created_at"> & { password: string }): Promise<User> {
    const id = this.uid();
    const hashed = this.hashPassword(user.password);
    this.db.prepare(`INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)`).run(id, user.email, user.name, hashed, user.role || "operator");
    return { id, email: user.email, name: user.name, role: user.role || "operator", avatar: undefined, created_at: new Date().toISOString() };
  }

  async findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
    const row = this.db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!row) return null;
    return { id: row.id, email: row.email, name: row.name, role: row.role, avatar: row.avatar, created_at: row.created_at, password: row.password };
  }

  async findUserById(id: string): Promise<User | null> {
    const row = this.db.prepare("SELECT id, email, name, role, avatar, created_at FROM users WHERE id = ?").get(id) as any;
    if (!row) return null;
    return row;
  }

  async createSession(session: Omit<Session, "id" | "created_at">): Promise<Session> {
    const id = this.uid();
    this.db.prepare(`INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`).run(id, session.user_id, session.token, session.expires_at);
    return { id, user_id: session.user_id, token: session.token, expires_at: session.expires_at, created_at: new Date().toISOString() };
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    const row = this.db.prepare("SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')").get(token) as any;
    if (!row) return null;
    return row;
  }

  async deleteSession(token: string): Promise<void> {
    this.db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }

  async listAgents(userId: string): Promise<Agent[]> {
    const rows = this.db.prepare("SELECT * FROM agents WHERE user_id = ? ORDER BY created_at ASC").all(userId) as any[];
    return rows.map(rowToAgent);
  }

  async getAgent(id: string): Promise<Agent | null> {
    const row = this.db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as any;
    if (!row) return null;
    return rowToAgent(row);
  }

  async createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent> {
    const id = this.uid();
    this.db.prepare(`
      INSERT INTO agents (id, user_id, name, role, status, icon, icon_color, icon_bg, memory_usage, memory_total, memory_percent, capabilities, objective, tone, long_term_memory, context_persistence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, agent.user_id, agent.name, agent.role, agent.status, agent.icon, agent.icon_color, agent.icon_bg, agent.memory_usage, agent.memory_total, agent.memory_percent, JSON.stringify(agent.capabilities), agent.objective, agent.tone, agent.long_term_memory ? 1 : 0, agent.context_persistence ? 1 : 0);
    return (await this.getAgent(id))!;
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent | null> {
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (key === "capabilities" && Array.isArray(value)) {
        fields.push("capabilities = ?");
        values.push(JSON.stringify(value));
      } else if (key !== "id" && key !== "created_at" && key !== "updated_at") {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return this.getAgent(id);
    fields.push("updated_at = datetime('now')");
    values.push(id);
    this.db.prepare(`UPDATE agents SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    return this.getAgent(id);
  }

  async deleteAgent(id: string): Promise<void> {
    this.db.prepare("DELETE FROM agents WHERE id = ?").run(id);
  }

  async listAuditLogs(params: { userId?: string; limit?: number; offset?: number }): Promise<{ logs: AuditLog[]; total: number }> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    let where = "";
    const values: any[] = [];
    if (params.userId) { where = "WHERE user_id = ?"; values.push(params.userId); }
    const total = (this.db.prepare(`SELECT COUNT(*) as count FROM audit_logs ${where}`).get(...values) as any).count;
    const rows = this.db.prepare(`SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...values, limit, offset) as any[];
    return { logs: rows, total };
  }

  async createAuditLog(log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog> {
    const id = this.uid();
    this.db.prepare(`INSERT INTO audit_logs (id, user_id, event_id, actor, actor_type, action, status, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(id, log.user_id, log.event_id, log.actor, log.actor_type, log.action, log.status, log.details || null);
    return { id, ...log, created_at: new Date().toISOString() };
  }

  async listApprovals(params: { userId?: string; status?: string; limit?: number; offset?: number }): Promise<{ approvals: Approval[]; total: number }> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const conditions: string[] = [];
    const values: any[] = [];
    if (params.userId) { conditions.push("user_id = ?"); values.push(params.userId); }
    if (params.status) { conditions.push("status = ?"); values.push(params.status); }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const total = (this.db.prepare(`SELECT COUNT(*) as count FROM approvals ${where}`).get(...values) as any).count;
    const rows = this.db.prepare(`SELECT * FROM approvals ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...values, limit, offset) as any[];
    return { approvals: rows, total };
  }

  async createApproval(approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval> {
    const id = this.uid();
    this.db.prepare(`INSERT INTO approvals (id, user_id, request_id, agent_id, agent_name, action_type, description, client, risk_level, status, queue_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, approval.user_id, approval.request_id, approval.agent_id, approval.agent_name, approval.action_type, approval.description, approval.client, approval.risk_level, approval.status, approval.queue_time);
    return (await this.getApprovalById(id))!;
  }

  private async getApprovalById(id: string): Promise<Approval | null> {
    const row = this.db.prepare("SELECT * FROM approvals WHERE id = ?").get(id) as any;
    return row || null;
  }

  async updateApproval(id: string, data: Partial<Approval>): Promise<Approval | null> {
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== "id" && key !== "created_at" && key !== "updated_at") {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return this.getApprovalById(id);
    fields.push("updated_at = datetime('now')");
    values.push(id);
    this.db.prepare(`UPDATE approvals SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    return this.getApprovalById(id);
  }

  async listApiKeys(userId: string): Promise<ApiKey[]> {
    return this.db.prepare("SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC").all(userId) as ApiKey[];
  }

  async createApiKey(key: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey> {
    const id = this.uid();
    this.db.prepare(`INSERT INTO api_keys (id, user_id, name, key_prefix) VALUES (?, ?, ?, ?)`).run(id, key.user_id, key.name, key.key_prefix);
    return { id, ...key, created_at: new Date().toISOString(), last_used: undefined };
  }

  async deleteApiKey(id: string): Promise<void> {
    this.db.prepare("DELETE FROM api_keys WHERE id = ?").run(id);
  }

  async getStats(userId: string): Promise<{ total_agents: number; active_agents: number; success_rate: number; avg_latency: string; pending_approvals: number }> {
    const totalAgents = (this.db.prepare("SELECT COUNT(*) as count FROM agents WHERE user_id = ?").get(userId) as any).count;
    const activeAgents = (this.db.prepare("SELECT COUNT(*) as count FROM agents WHERE user_id = ? AND status = 'Online'").get(userId) as any).count;
    const totalLogs = (this.db.prepare("SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ?").get(userId) as any).count;
    const successLogs = (this.db.prepare("SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ? AND status = 'success'").get(userId) as any).count;
    const pendingApprovals = (this.db.prepare("SELECT COUNT(*) as count FROM approvals WHERE user_id = ? AND status = 'pending'").get(userId) as any).count;
    return {
      total_agents: totalAgents,
      active_agents: activeAgents,
      success_rate: totalLogs > 0 ? Math.round((successLogs / totalLogs) * 1000) / 10 : 99.8,
      avg_latency: "420ms",
      pending_approvals: pendingApprovals,
    };
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

function rowToAgent(row: any): Agent {
  return {
    ...row,
    capabilities: typeof row.capabilities === "string" ? JSON.parse(row.capabilities) : row.capabilities,
    long_term_memory: !!row.long_term_memory,
    context_persistence: !!row.context_persistence,
  };
}
