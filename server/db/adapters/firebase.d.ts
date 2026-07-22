import type { DatabaseAdapter } from "../adapter";
import type { User, Agent, AuditLog, Approval, ApiKey, Session } from "../../types";
export declare class FirebaseAdapter implements DatabaseAdapter {
    init(): Promise<void>;
    createUser(_user: Omit<User, "id" | "created_at"> & {
        password: string;
    }): Promise<User>;
    findUserByEmail(_email: string): Promise<(User & {
        password: string;
    }) | null>;
    findUserById(_id: string): Promise<User | null>;
    createSession(_session: Omit<Session, "id" | "created_at">): Promise<Session>;
    findSessionByToken(_token: string): Promise<Session | null>;
    deleteSession(_token: string): Promise<void>;
    listAgents(_userId: string): Promise<Agent[]>;
    getAgent(_id: string): Promise<Agent | null>;
    createAgent(_agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent>;
    updateAgent(_id: string, _data: Partial<Agent>): Promise<Agent | null>;
    deleteAgent(_id: string): Promise<void>;
    listAuditLogs(_params: {
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: AuditLog[];
        total: number;
    }>;
    createAuditLog(_log: Omit<AuditLog, "id" | "created_at">): Promise<AuditLog>;
    listApprovals(_params: {
        userId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        approvals: Approval[];
        total: number;
    }>;
    createApproval(_approval: Omit<Approval, "id" | "created_at" | "updated_at">): Promise<Approval>;
    updateApproval(_id: string, _data: Partial<Approval>): Promise<Approval | null>;
    listApiKeys(_userId: string): Promise<ApiKey[]>;
    createApiKey(_key: Omit<ApiKey, "id" | "created_at">): Promise<ApiKey>;
    deleteApiKey(_id: string): Promise<void>;
    getStats(_userId: string): Promise<any>;
    close(): Promise<void>;
}
