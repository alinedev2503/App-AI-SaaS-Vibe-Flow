import { post, get } from "./client";
import { secureStorage } from "../secureStorage";

export async function login(email: string, password: string) {
  const data = await post<{ user: any; token: string }>("/api/auth/login", { email, password });
  secureStorage.setItem("vibeflow_token", data.token);
  secureStorage.setItem("vibeflow_user", data.user);
  return data;
}

export async function register(email: string, name: string, password: string) {
  const data = await post<{ user: any; token: string }>("/api/auth/register", { email, name, password });
  secureStorage.setItem("vibeflow_token", data.token);
  secureStorage.setItem("vibeflow_user", data.user);
  return data;
}

export async function logout() {
  try { await post("/api/auth/logout"); } catch {}
  secureStorage.clearAuth();
}

export async function getMe() {
  return get<{ user: any }>("/api/auth/me");
}

export function getStoredUser(): any | null {
  return secureStorage.getItem<any>("vibeflow_user");
}

export function getStoredToken(): string | null {
  return secureStorage.getItem<string>("vibeflow_token");
}

