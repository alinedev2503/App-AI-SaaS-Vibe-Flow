import { get, post } from "./client";

export function listAuditLogs(params?: { limit?: number; offset?: number }) {
  const query = params ? `?limit=${params.limit || 50}&offset=${params.offset || 0}` : "";
  return get<{ logs: any[]; total: number }>(`/api/audit${query}`);
}

export function createAuditLog(log: any) {
  return post<{ log: any }>("/api/audit", log);
}
