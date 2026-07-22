import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

let token: string;
let agentId: string;

beforeAll(async () => {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@vibeflow.ai", password: "admin123" });
  token = login.body.token;
});

describe("GET /api/agents", () => {
  it("lista agentes do seed", async () => {
    const res = await request(app)
      .get("/api/agents")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.agents)).toBe(true);
    expect(res.body.agents.length).toBeGreaterThanOrEqual(6);
  });
});

describe("POST /api/agents", () => {
  it("cria um novo agente", async () => {
    const res = await request(app)
      .post("/api/agents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Agente Teste",
        role: "Testador Automatizado",
        status: "Idle",
        icon: "Bot",
        icon_color: "text-primary",
        icon_bg: "bg-primary/10",
        memory_usage: "0",
        memory_total: "128k",
        memory_percent: 0,
        capabilities: ["FileText"],
        objective: "Testar o sistema",
        tone: "Profissional",
        long_term_memory: true,
        context_persistence: true,
      });
    expect(res.status).toBe(201);
    expect(res.body.agent.name).toBe("Agente Teste");
    agentId = res.body.agent.id;
  });

  it("rejeita dados inválidos", async () => {
    const res = await request(app)
      .post("/api/agents")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/agents/:id", () => {
  it("retorna agente por ID", async () => {
    const res = await request(app)
      .get(`/api/agents/${agentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.agent.name).toBe("Agente Teste");
  });

  it("retorna 404 para ID inexistente", async () => {
    const res = await request(app)
      .get("/api/agents/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/agents/:id", () => {
  it("atualiza um agente", async () => {
    const res = await request(app)
      .put(`/api/agents/${agentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Agente Atualizado" });
    expect(res.status).toBe(200);
    expect(res.body.agent.name).toBe("Agente Atualizado");
  });
});

describe("DELETE /api/agents/:id", () => {
  it("remove um agente", async () => {
    const res = await request(app)
      .delete(`/api/agents/${agentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Agente removido");
  });
});
