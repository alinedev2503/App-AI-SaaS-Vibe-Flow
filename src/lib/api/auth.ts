import { post, get } from "./client";

export async function login(email: string, password: string) {
  const data = await post<{ user: any; token: string }>("/api/auth/login", { email, password });
  localStorage.setItem("vibeflow_token", data.token);
  localStorage.setItem("vibeflow_user", JSON.stringify(data.user));
  return data;
}

export async function register(email: string, name: string, password: string) {
  const data = await post<{ user: any; token: string }>("/api/auth/register", { email, name, password });
  localStorage.setItem("vibeflow_token", data.token);
  localStorage.setItem("vibeflow_user", JSON.stringify(data.user));
  return data;
}

export async function logout() {
  try { await post("/api/auth/logout"); } catch {}
  localStorage.removeItem("vibeflow_token");
  localStorage.removeItem("vibeflow_user");
}

export async function getMe() {
  return get<{ user: any }>("/api/auth/me");
}

export function getStoredUser(): any | null {
  const raw = localStorage.getItem("vibeflow_user");
  return raw ? JSON.parse(raw) : null;
}

export function getStoredToken(): string | null {
  return localStorage.getItem("vibeflow_token");
}
