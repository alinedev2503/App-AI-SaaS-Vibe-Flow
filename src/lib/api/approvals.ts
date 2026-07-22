import { get, post, put } from "./client";

export function listApprovals(params?: { status?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.offset) q.set("offset", String(params.offset));
  const query = q.toString() ? `?${q}` : "";
  return get<{ approvals: any[]; total: number }>(`/api/approvals${query}`);
}

export function createApproval(approval: any) {
  return post<{ approval: any }>("/api/approvals", approval);
}

export function updateApproval(id: string, data: any) {
  return put<{ approval: any }>(`/api/approvals/${id}`, data);
}
