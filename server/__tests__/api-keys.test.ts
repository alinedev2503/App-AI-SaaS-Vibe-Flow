import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

let token: string;

beforeAll(async () => {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@vibeflow.ai", password: "admin123" });
  token = login.body.token;
});

describe("GET /api/api-keys", () => {
  it("lista chaves vazia inicialmente", async () => {
    const res = await request(app)
      .get("/api/api-keys")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.keys)).toBe(true);
  });
});

describe("POST /api/api-keys", () => {
  it("cria nova chave de API", async () => {
    const res = await request(app)
      .post("/api/api-keys")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Chave de Teste" });
    expect(res.status).toBe(201);
    expect(res.body.key.name).toBe("Chave de Teste");
    expect(res.body.raw_key).toMatch(/^vf_/);
  });

  it("rejeita nome vazio", async () => {
    const res = await request(app)
      .post("/api/api-keys")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/stats", () => {
  it("retorna estatísticas do usuário", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.total_agents).toBeGreaterThan(0);
    expect(res.body.stats.active_agents).toBeGreaterThanOrEqual(0);
    expect(res.body.stats.pending_approvals).toBeGreaterThan(0);
    expect(typeof res.body.stats.success_rate).toBe("number");
    expect(typeof res.body.stats.avg_latency).toBe("string");
  });
});
