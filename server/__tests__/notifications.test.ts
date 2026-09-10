import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("FCM & Push Notifications API", () => {
  const testToken = "test_android_fcm_token_device_unit_test";

  it("registra token de dispositivo FCM para notificações em segundo plano", async () => {
    const res = await request(app)
      .post("/api/notifications/fcm/register")
      .send({
        token: testToken,
        platform: "android",
        deviceName: "Samsung Galaxy S24 (Android 14)",
        userId: "admin-platform-01",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.device).toBeDefined();
    expect(res.body.device.token).toBe(testToken);
    expect(res.body.device.platform).toBe("android");
  });

  it("retorna erro ao registrar sem token", async () => {
    const res = await request(app)
      .post("/api/notifications/fcm/register")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("lista dispositivos registrados", async () => {
    const res = await request(app).get("/api/notifications/devices");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.devices)).toBe(true);
    expect(res.body.devices.some((d: any) => d.token === testToken)).toBe(true);
  });

  it("dispara notificação push de teste", async () => {
    const res = await request(app)
      .post("/api/notifications/fcm/test")
      .send({
        token: testToken,
        title: "⚡ Alerta Crítico: Orquestração",
        body: "Ação de teste executada com sucesso.",
        type: "critical_alert",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payload).toBeDefined();
    expect(res.body.payload.title).toContain("Alerta Crítico");
  });

  it("obtém e atualiza preferências de notificação", async () => {
    const getRes = await request(app).get("/api/notifications/preferences?userId=admin-platform-01");
    expect(getRes.status).toBe(200);
    expect(getRes.body.preferences).toBeDefined();
    expect(getRes.body.preferences.criticalAlerts).toBe(true);

    const putRes = await request(app)
      .put("/api/notifications/preferences")
      .send({
        userId: "admin-platform-01",
        preferences: {
          weeklyReports: true,
          vibrationEnabled: false,
        },
      });

    expect(putRes.status).toBe(200);
    expect(putRes.body.preferences.weeklyReports).toBe(true);
    expect(putRes.body.preferences.vibrationEnabled).toBe(false);
  });

  it("desregistra token FCM com sucesso", async () => {
    const res = await request(app)
      .post("/api/notifications/fcm/unregister")
      .send({ token: testToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.removed).toBe(true);
  });
});
