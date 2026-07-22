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

describe("GET /api/audit", () => {
  it("lista audit logs com paginação", async () => {
    const res = await request(app)
      .get("/api/audit")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.logs)).toBe(true);
    expect(typeof res.body.total).toBe("number");
  });

  it("aplica limite de paginação", async () => {
    const res = await request(app)
      .get("/api/audit?limit=2")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.logs.length).toBeLessThanOrEqual(2);
  });
});

describe("POST /api/audit", () => {
  it("cria um novo audit log", async () => {
    const res = await request(app)
      .post("/api/audit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        event_id: "TEST-001",
        actor: "Test Suite",
        actor_type: "system",
        action: "Teste automatizado executado",
        status: "success",
      });
    expect(res.status).toBe(201);
    expect(res.body.log.event_id).toBe("TEST-001");
  });
});
