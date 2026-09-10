import { secureStorage } from "../secureStorage";

const API_BASE = import.meta.env.VITE_API_URL || "";

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = secureStorage.getItem<string>("vibeflow_token");

  const isForm = options.body && isFormData(options.body);
  const headers: Record<string, string> = {
    ...(!isForm ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    secureStorage.clearAuth();
    throw new Error("Sessão expirada");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Erro na requisição" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  const isForm = isFormData(body);
  return request<T>(path, { method: "POST", body: isForm ? body : body ? JSON.stringify(body) : undefined });
}

export function put<T>(path: string, body?: unknown): Promise<T> {
  const isForm = isFormData(body);
  return request<T>(path, { method: "PUT", body: isForm ? body : body ? JSON.stringify(body) : undefined });
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}

export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = secureStorage.getItem<string>("vibeflow_token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload/branding`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error("Upload falhou");
  return res.json();
}

