import type {
  User, Agent, AuditLog, Approval, ApiKey, Session,
} from "../types";

export interface DatabaseAdapter {
  init(): Promise<void>;

  createUser(user: Omit<User, "id" | "created_at"> & { password: string }): Promise<User>;
  findUserByEmail(email: string): Promise<(User & { password: string }) | null>;
  findUserById(id: string): Promise<User | null>;

  createSession(session: Omit<Session, "id" | "created_at">): Promise<Session>;
  findSessionByToken(token: string): Promise<Session | null>;
  deleteSession(token: string): Promise<void>;

  listAgents(userId: string): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | null>;
  createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent>;
  updateAgent(id: string, data: Partial<Agent>): Promise<Agent | null>;
  deleteAgent(id: string): Promise<void>;

  listAuditLogs(params: { userId?: string; limit?: number; offset?: number }): Promise<{ logs: AuditLog[]; total: number }>;
  createAuditLog(log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog>;

  listApprovals(params: { userId?: string; status?: string; limit?: number; offset?: number }): Promise<{ approvals: Approval[]; total: number }>;
  createApproval(approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval>;
  updateApproval(id: string, data: Partial<Approval>): Promise<Approval | null>;

  listApiKeys(userId: string): Promise<ApiKey[]>;
  createApiKey(key: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey>;
  deleteApiKey(id: string): Promise<void>;

  getStats(userId: string): Promise<{
    total_agents: number;
    active_agents: number;
    success_rate: number;
    avg_latency: string;
    pending_approvals: number;
  }>;

  createPasswordReset(userId: string): Promise<string>;
  findPasswordReset(token: string): Promise<{ id: string; user_id: string; expires_at: string; used: number } | null>;
  usePasswordReset(id: string): Promise<void>;
  updatePassword(userId: string, password: string): Promise<void>;

  listUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<void>;

  close(): Promise<void>;
}
