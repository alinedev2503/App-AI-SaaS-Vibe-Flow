import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

const testEmail = `test-${Date.now()}@test.com`;
const testPassword = "123456";

describe("POST /api/auth/register", () => {
  it("registra um novo usuário com dados válidos", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: testEmail, name: "Test User", password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.token).toBeDefined();
  });

  it("rejeita email já cadastrado", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: testEmail, name: "Test User", password: testPassword });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email já cadastrado");
  });

  it("rejeita dados inválidos", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "invalido", name: "", password: "12" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("faz login com credenciais corretas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it("rejeita credenciais incorretas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Credenciais inválidas");
  });

  it("rejeita email não cadastrado", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "noone@test.com", password: testPassword });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("retorna dados do usuário autenticado", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });
    const token = login.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });

  it("rejeita requisição sem token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("invalida o token", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });
    const token = login.body.token;

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logout realizado");

    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(me.status).toBe(401);
  });
});
