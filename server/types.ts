export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "viewer";
  avatar?: string;
  created_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  role: string;
  status: "Online" | "Learning" | "Idle" | "Paused";
  icon: string;
  icon_color: string;
  icon_bg: string;
  memory_usage: string;
  memory_total: string;
  memory_percent: number;
  capabilities: string[];
  objective: string;
  tone: string;
  long_term_memory: boolean;
  context_persistence: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  event_id: string;
  actor: string;
  actor_type: string;
  action: string;
  status: "success" | "blocked" | "error";
  details?: string;
  created_at: string;
}

export interface Approval {
  id: string;
  user_id: string;
  request_id: string;
  agent_id: string;
  agent_name: string;
  action_type: string;
  description: string;
  client?: string;
  risk_level: "low" | "medium" | "high" | "critical";
  status: "pending" | "approved" | "rejected";
  queue_time: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used?: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}
