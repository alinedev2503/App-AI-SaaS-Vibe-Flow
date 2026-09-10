import { Router, Request, Response } from "express";
import { fcmService, PushNotificationPayload } from "../lib/fcm";
import logger from "../lib/logger";

const router = Router();

// In-memory preferences store per user
const userPreferences = new Map<string, {
  criticalAlerts: boolean;
  approvalRequests: boolean;
  weeklyReports: boolean;
  agentStatusChanges: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}>();

// Default preferences
const defaultPrefs = {
  criticalAlerts: true,
  approvalRequests: true,
  weeklyReports: false,
  agentStatusChanges: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

/**
 * POST /api/notifications/fcm/register
 * Register a device FCM token for push notifications
 */
router.post("/fcm/register", (req: Request, res: Response) => {
  try {
    const { token, platform, deviceName, userId } = req.body;

    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "Token FCM é obrigatório." });
      return;
    }

    const registered = fcmService.registerToken(
      token,
      userId || "admin-platform-01",
      platform || "android",
      deviceName || (platform === "android" ? "Android Device (FCM Native)" : "Web Client")
    );

    res.json({
      success: true,
      message: "Token FCM registrado com sucesso para push notifications em segundo plano.",
      device: registered,
    });
  } catch (error: any) {
    logger.error({ error }, "Erro ao registrar token FCM");
    res.status(500).json({ error: "Falha ao registrar token FCM." });
  }
});

/**
 * POST /api/notifications/fcm/unregister
 * Unregister a device token
 */
router.post("/fcm/unregister", (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: "Token é obrigatório." });
      return;
    }

    const removed = fcmService.unregisterToken(token);
    res.json({ success: true, removed });
  } catch (error: any) {
    res.status(500).json({ error: "Falha ao desregistrar token." });
  }
});

/**
 * POST /api/notifications/fcm/test
 * Send a test push notification to a specific token or all registered devices
 */
router.post("/fcm/test", async (req: Request, res: Response) => {
  try {
    const { token, title, body, type, approvalId, priority } = req.body;

    const payload: PushNotificationPayload = {
      title: title || "🔔 Teste de Notificação VibeFlow Android",
      body: body || "Esta é uma notificação push em segundo plano enviada via Firebase Cloud Messaging (FCM).",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      type: type || "critical_alert",
      approvalId: approvalId || "appr-test-01",
      url: type === "approval_request" ? "/approvals" : "/dashboard",
      priority: priority || "high",
    };

    if (token) {
      const result = await fcmService.sendToDevice(token, payload);
      res.json({
        success: result.success,
        message: result.mock
          ? "Notificação push simulada com sucesso (FCM em modo demonstração)."
          : "Notificação push enviada com sucesso via FCM Gateway.",
        result,
        payload,
      });
      return;
    }

    // Broadcast test to all devices
    const broadcastResult = await fcmService.broadcast(payload);
    res.json({
      success: true,
      message: `Notificação enviada para ${broadcastResult.sent} dispositivo(s).`,
      broadcastResult,
      payload,
    });
  } catch (error: any) {
    logger.error({ error }, "Erro ao enviar push notification de teste");
    res.status(500).json({ error: "Falha ao enviar notificação de teste." });
  }
});

/**
 * GET /api/notifications/devices
 * List registered devices
 */
router.get("/devices", (_req: Request, res: Response) => {
  try {
    const devices = fcmService.getTokens();
    res.json({
      success: true,
      count: devices.length,
      devices,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Falha ao listar dispositivos." });
  }
});

/**
 * GET /api/notifications/preferences
 * Get notification preferences
 */
router.get("/preferences", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "admin-platform-01";
  const prefs = userPreferences.get(userId) || defaultPrefs;
  res.json({ success: true, preferences: prefs });
});

/**
 * PUT /api/notifications/preferences
 * Update notification preferences
 */
router.put("/preferences", (req: Request, res: Response) => {
  try {
    const { userId = "admin-platform-01", preferences } = req.body;
    const current = userPreferences.get(userId) || defaultPrefs;
    const updated = { ...current, ...(preferences || {}) };
    userPreferences.set(userId, updated);

    res.json({
      success: true,
      message: "Preferências de notificação salvas com sucesso.",
      preferences: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Falha ao atualizar preferências." });
  }
});

export default router;
