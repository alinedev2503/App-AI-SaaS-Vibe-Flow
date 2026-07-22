import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";
import logger from "../../lib/logger";

export class FirebaseAdapter implements DatabaseAdapter {
  async init(): Promise<void> {
    logger.warn("[FirebaseAdapter] Configure FIREBASE_* vars in .env");
  }

  async createUser(_user: Omit<User, "id" | "created_at"> & { password: string }): Promise<User> {
    throw new Error("FirebaseAdapter: not implemented. Set DB_TYPE=sqlite to use the embedded database.");
  }
  async findUserByEmail(_email: string): Promise<(User & { password: string }) | null> {
    throw new Error("FirebaseAdapter: not implemented");
  }
  async findUserById(_id: string): Promise<User | null> {
    throw new Error("FirebaseAdapter: not implemented");
  }
  async createSession(_session: Omit<Session, "id" | "created_at">): Promise<Session> {
    throw new Error("FirebaseAdapter: not implemented");
  }
  async findSessionByToken(_token: string): Promise<Session | null> {
    throw new Error("FirebaseAdapter: not implemented");
  }
  async deleteSession(_token: string): Promise<void> {
    throw new Error("FirebaseAdapter: not implemented");
  }
  async listAgents(_userId: string): Promise<Agent[]> { throw new Error("FirebaseAdapter: not implemented"); }
  async getAgent(_id: string): Promise<Agent | null> { throw new Error("FirebaseAdapter: not implemented"); }
  async createAgent(_agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent> { throw new Error("FirebaseAdapter: not implemented"); }
  async updateAgent(_id: string, _data: Partial<Agent>): Promise<Agent | null> { throw new Error("FirebaseAdapter: not implemented"); }
  async deleteAgent(_id: string): Promise<void> { throw new Error("FirebaseAdapter: not implemented"); }
  async listAuditLogs(_params: { userId?: string; limit?: number; offset?: number }): Promise<{ logs: AuditLog[]; total: number }> { throw new Error("FirebaseAdapter: not implemented"); }
  async createAuditLog(_log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog> { throw new Error("FirebaseAdapter: not implemented"); }
  async listApprovals(_params: { userId?: string; status?: string; limit?: number; offset?: number }): Promise<{ approvals: Approval[]; total: number }> { throw new Error("FirebaseAdapter: not implemented"); }
  async createApproval(_approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval> { throw new Error("FirebaseAdapter: not implemented"); }
  async updateApproval(_id: string, _data: Partial<Approval>): Promise<Approval | null> { throw new Error("FirebaseAdapter: not implemented"); }
  async listApiKeys(_userId: string): Promise<ApiKey[]> { throw new Error("FirebaseAdapter: not implemented"); }
  async createApiKey(_key: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey> { throw new Error("FirebaseAdapter: not implemented"); }
  async deleteApiKey(_id: string): Promise<void> { throw new Error("FirebaseAdapter: not implemented"); }
  async getStats(_userId: string): Promise<any> { throw new Error("FirebaseAdapter: not implemented"); }
  async close(): Promise<void> {}
}
