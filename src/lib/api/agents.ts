import { get, post, put, del } from "./client";

export function listAgents() {
  return get<{ agents: any[] }>("/api/agents");
}

export function getAgent(id: string) {
  return get<{ agent: any }>(`/api/agents/${id}`);
}

export function createAgent(agent: any) {
  return post<{ agent: any }>("/api/agents", agent);
}

export function updateAgent(id: string, data: any) {
  return put<{ agent: any }>(`/api/agents/${id}`, data);
}

export function deleteAgent(id: string) {
  return del<{ message: string }>(`/api/agents/${id}`);
}
