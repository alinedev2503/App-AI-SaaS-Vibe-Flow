import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";
export declare class SqliteAdapter implements DatabaseAdapter {
    private dbPath;
    private db;
    constructor(dbPath: string);
    init(): Promise<void>;
    private runMigrations;
    private seedIfEmpty;
    private hashPassword;
    private verifyPassword;
    private uid;
    createUser(user: Omit<User, "id" | "created_at"> & {
        password: string;
    }): Promise<User>;
    findUserByEmail(email: string): Promise<(User & {
        password: string;
    }) | null>;
    findUserById(id: string): Promise<User | null>;
    createSession(session: Omit<Session, "id" | "created_at">): Promise<Session>;
    findSessionByToken(token: string): Promise<Session | null>;
    deleteSession(token: string): Promise<void>;
    listAgents(userId: string): Promise<Agent[]>;
    getAgent(id: string): Promise<Agent | null>;
    createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent>;
    updateAgent(id: string, data: Partial<Agent>): Promise<Agent | null>;
    deleteAgent(id: string): Promise<void>;
    listAuditLogs(params: {
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: AuditLog[];
        total: number;
    }>;
    createAuditLog(log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog>;
    listApprovals(params: {
        userId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        approvals: Approval[];
        total: number;
    }>;
    createApproval(approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval>;
    private getApprovalById;
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
    close(): Promise<void>;
}
