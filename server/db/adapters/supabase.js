import logger from "../../lib/logger";
export class SupabaseAdapter {
    async init() {
        logger.warn("[SupabaseAdapter] Configure SUPABASE_URL and SUPABASE_SERVICE_KEY in .env");
    }
    async createUser(_user) {
        throw new Error("SupabaseAdapter: not implemented. Set DB_TYPE=sqlite to use the embedded database.");
    }
    async findUserByEmail(_email) {
        throw new Error("SupabaseAdapter: not implemented");
    }
    async findUserById(_id) {
        throw new Error("SupabaseAdapter: not implemented");
    }
    async createSession(_session) {
        throw new Error("SupabaseAdapter: not implemented");
    }
    async findSessionByToken(_token) {
        throw new Error("SupabaseAdapter: not implemented");
    }
    async deleteSession(_token) {
        throw new Error("SupabaseAdapter: not implemented");
    }
    async listAgents(_userId) { throw new Error("SupabaseAdapter: not implemented"); }
    async getAgent(_id) { throw new Error("SupabaseAdapter: not implemented"); }
    async createAgent(_agent) { throw new Error("SupabaseAdapter: not implemented"); }
    async updateAgent(_id, _data) { throw new Error("SupabaseAdapter: not implemented"); }
    async deleteAgent(_id) { throw new Error("SupabaseAdapter: not implemented"); }
    async listAuditLogs(_params) { throw new Error("SupabaseAdapter: not implemented"); }
    async createAuditLog(_log) { throw new Error("SupabaseAdapter: not implemented"); }
    async listApprovals(_params) { throw new Error("SupabaseAdapter: not implemented"); }
    async createApproval(_approval) { throw new Error("SupabaseAdapter: not implemented"); }
    async updateApproval(_id, _data) { throw new Error("SupabaseAdapter: not implemented"); }
    async listApiKeys(_userId) { throw new Error("SupabaseAdapter: not implemented"); }
    async createApiKey(_key) { throw new Error("SupabaseAdapter: not implemented"); }
    async deleteApiKey(_id) { throw new Error("SupabaseAdapter: not implemented"); }
    async getStats(_userId) { throw new Error("SupabaseAdapter: not implemented"); }
    async close() { }
}
