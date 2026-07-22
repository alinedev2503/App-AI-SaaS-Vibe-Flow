import { get, post, del } from "./client";

export function listApiKeys() {
  return get<{ keys: any[] }>("/api/api-keys");
}

export function createApiKey(name: string) {
  return post<{ key: any; raw_key: string }>("/api/api-keys", { name });
}

export function deleteApiKey(id: string) {
  return del<{ message: string }>(`/api/api-keys/${id}`);
}
