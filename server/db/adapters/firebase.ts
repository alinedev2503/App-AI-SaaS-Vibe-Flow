import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";
import logger from "../../lib/logger";

export class FirebaseAdapter implements DatabaseAdapter {
  private warned = false;

  private warn() {
    if (!this.warned) {
      logger.warn("[FirebaseAdapter] Firebase not configured. Set FIREBASE_* env vars or use DB_TYPE=sqlite.");
      this.warned = true;
    }
  }

  async init(): Promise<void> { this.warn(); }

  async createUser(_u: Omit<User, "id" | "created_at"> & { password: string }): Promise<User> {
    this.warn(); throw new Error("Firebase not configured. Use DB_TYPE=sqlite.");
  }
  async findUserByEmail(_e: string): Promise<(User & { password: string }) | null> { this.warn(); return null; }
  async findUserById(_id: string): Promise<User | null> { this.warn(); return null; }
  async createSession(_s: Omit<Session, "id" | "created_at">): Promise<Session> { this.warn(); throw new Error("Firebase not configured."); }
  async findSessionByToken(_t: string): Promise<Session | null> { this.warn(); return null; }
  async deleteSession(_t: string): Promise<void> { this.warn(); }
  async listAgents(_u: string): Promise<Agent[]> { this.warn(); return []; }
  async getAgent(_id: string): Promise<Agent | null> { this.warn(); return null; }
  async createAgent(_a: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent> { this.warn(); throw new Error("Firebase not configured."); }
  async updateAgent(_id: string, _d: Partial<Agent>): Promise<Agent | null> { this.warn(); return null; }
  async deleteAgent(_id: string): Promise<void> { this.warn(); }
  async listAuditLogs(_p: { userId?: string; limit?: number; offset?: number }): Promise<{ logs: AuditLog[]; total: number }> { this.warn(); return { logs: [], total: 0 }; }
  async createAuditLog(_l: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog> { this.warn(); throw new Error("Firebase not configured."); }
  async listApprovals(_p: { userId?: string; status?: string; limit?: number; offset?: number }): Promise<{ approvals: Approval[]; total: number }> { this.warn(); return { approvals: [], total: 0 }; }
  async createApproval(_a: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval> { this.warn(); throw new Error("Firebase not configured."); }
  async updateApproval(_id: string, _d: Partial<Approval>): Promise<Approval | null> { this.warn(); return null; }
  async listApiKeys(_u: string): Promise<ApiKey[]> { this.warn(); return []; }
  async createApiKey(_k: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey> { this.warn(); throw new Error("Firebase not configured."); }
  async deleteApiKey(_id: string): Promise<void> { this.warn(); }
  async getStats(_u: string): Promise<any> { this.warn(); return {}; }
  async createPasswordReset(_u: string): Promise<string> { this.warn(); throw new Error("Firebase not configured."); }
  async findPasswordReset(_t: string): Promise<any> { this.warn(); return null; }
  async usePasswordReset(_id: string): Promise<void> { this.warn(); }
  async updatePassword(_u: string, _p: string): Promise<void> { this.warn(); }
  async listUsers(): Promise<User[]> { this.warn(); return []; }
  async updateUserRole(_u: string, _r: string): Promise<void> { this.warn(); }
  async close(): Promise<void> {}
}
