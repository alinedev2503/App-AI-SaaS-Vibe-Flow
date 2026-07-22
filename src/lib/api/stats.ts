import { get } from "./client";

export function getStats() {
  return get<{ stats: { total_agents: number; active_agents: number; success_rate: number; avg_latency: string; pending_approvals: number } }>("/api/stats");
}
