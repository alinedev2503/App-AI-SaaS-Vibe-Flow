import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("GET /api/health", () => {
  it("retorna status ok com informações de segurança", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.db).toBe("sqlite");
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.security).toBeDefined();
    expect(res.body.security.helmet).toBe(true);
    expect(res.body.security.rate_limit).toBe(true);
  });
});

describe("404", () => {
  it("retorna 404 para rota inexistente", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Rota não encontrada");
  });
});
