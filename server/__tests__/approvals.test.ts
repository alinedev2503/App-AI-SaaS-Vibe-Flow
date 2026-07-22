import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

let token: string;
let approvalId: string;

beforeAll(async () => {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@vibeflow.ai", password: "admin123" });
  token = login.body.token;
});

describe("GET /api/approvals", () => {
  it("lista aprovações pendentes do seed", async () => {
    const res = await request(app)
      .get("/api/approvals")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.approvals)).toBe(true);
    expect(res.body.approvals.length).toBeGreaterThanOrEqual(3);
  });

  it("filtra por status", async () => {
    const res = await request(app)
      .get("/api/approvals?status=approved")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.approvals.every((a: any) => a.status === "approved")).toBe(true);
  });
});

describe("POST /api/approvals", () => {
  it("cria nova solicitação de aprovação", async () => {
    const res = await request(app)
      .post("/api/approvals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        request_id: "REQ-TEST-001",
        agent_id: "00000000-0000-0000-0000-000000000001",
        agent_name: "Agente Teste",
        action_type: "Executar Ação Crítica",
        description: "Teste automatizado",
        risk_level: "low",
      });
    expect(res.status).toBe(201);
    expect(res.body.approval.request_id).toBe("REQ-TEST-001");
    approvalId = res.body.approval.id;
  });

  it("rejeita dados inválidos", async () => {
    const res = await request(app)
      .post("/api/approvals")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/approvals/:id", () => {
  it("aprova uma solicitação pendente", async () => {
    const res = await request(app)
      .put(`/api/approvals/${approvalId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "approved" });
    expect(res.status).toBe(200);
    expect(res.body.approval.status).toBe("approved");
  });

  it("rejeita status inválido", async () => {
    const res = await request(app)
      .put(`/api/approvals/${approvalId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "invalid" });
    expect(res.status).toBe(400);
  });
});
