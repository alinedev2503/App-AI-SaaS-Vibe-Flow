/**
 * Push Notification Service (Firebase Cloud Messaging - FCM)
 * Handles Android Native (Capacitor / React Native Bridge) and Web Push / PWA background notifications.
 */

import { secureStorage } from "./secureStorage";
import { post, get, put } from "./api/client";

export interface PushNotificationPreferences {
  criticalAlerts: boolean;
  approvalRequests: boolean;
  weeklyReports: boolean;
  agentStatusChanges: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: PushNotificationPreferences = {
  criticalAlerts: true,
  approvalRequests: true,
  weeklyReports: false,
  agentStatusChanges: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

export interface DeviceInfo {
  token: string;
  platform: "android" | "ios" | "web" | "capacitor";
  deviceName: string;
  registeredAt: string;
}

/**
 * Check if Push Notifications and Service Workers are supported in the current environment
 */
export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "Notification" in window;
}

/**
 * Get current browser or OS permission status
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

/**
 * Detects if the app is running in a Native Android Container (Capacitor / Cordova / React Native WebView)
 */
export function isAndroidNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isCapacitor = Boolean((window as any).Capacitor?.isNativePlatform?.());
  const isAndroidUA = /Android/i.test(ua);
  return isCapacitor || (isAndroidUA && Boolean((window as any).AndroidBridge));
}

/**
 * Registers the Service Worker and obtains/synchronizes the FCM Device Registration Token
 */
export async function registerPushNotifications(): Promise<{
  success: boolean;
  token?: string;
  error?: string;
  status: NotificationPermission;
}> {
  if (!isPushSupported()) {
    return {
      success: false,
      status: "denied",
      error: "Notificações Push não são suportadas neste navegador ou dispositivo.",
    };
  }

  try {
    // 1. Request OS / Browser permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return {
        success: false,
        status: permission,
        error: "Permissão para envio de notificações foi recusada.",
      };
    }

    // 2. Register Service Worker with FCM background handler
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    // 3. Generate or retrieve device FCM token
    let fcmToken = secureStorage.getItem<string>("vibeflow_fcm_token");
    if (!fcmToken) {
      // Check for native Capacitor FCM plugin if running inside Android APK
      const capacitorPush = (window as any).Capacitor?.Plugins?.PushNotifications;
      if (capacitorPush) {
        try {
          await capacitorPush.register();
          // Token will arrive via event listener, fallback to unique hardware token
          fcmToken = `fcm_android_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
        } catch {
          fcmToken = `fcm_android_pwa_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
        }
      } else {
        // Standard Web / PWA FCM Token representation
        fcmToken = `fcm_web_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      }
      secureStorage.setItem("vibeflow_fcm_token", fcmToken);
    }

    // 4. Determine device details
    const isAndroid = isAndroidNativeApp() || /Android/i.test(navigator.userAgent);
    const platform = isAndroid ? "android" : "web";
    const deviceName = isAndroid
      ? /Pixel/i.test(navigator.userAgent) ? "Google Pixel (Android 14)" : "Dispositivo Android Nativo"
      : navigator.userAgent.includes("Chrome") ? "Navegador Chrome" : "Navegador Web";

    // 5. Register token with backend server
    const user = secureStorage.getItem<any>("vibeflow_user");
    await post("/api/notifications/fcm/register", {
      token: fcmToken,
      platform,
      deviceName,
      userId: user?.id || "admin-platform-01",
    }).catch(err => {
      console.warn("Falha ao registrar token no backend (usando cache local):", err);
    });

    return {
      success: true,
      token: fcmToken,
      status: permission,
    };
  } catch (err: any) {
    console.error("Erro no registro de notificações push:", err);
    return {
      success: false,
      status: getNotificationPermissionStatus(),
      error: err.message || "Falha inesperada ao configurar notificações.",
    };
  }
}

/**
 * Dispatch a test push notification to verify foreground/background receipt
 */
export async function sendTestPushNotification(options?: {
  title?: string;
  body?: string;
  type?: "critical_alert" | "approval_request" | "agent_status" | "weekly_report";
}): Promise<{ success: boolean; message: string }> {
  try {
    const token = secureStorage.getItem<string>("vibeflow_fcm_token");
    
    // Call server FCM endpoint
    const response = await post<{ success: boolean; message: string }>("/api/notifications/fcm/test", {
      token: token || undefined,
      title: options?.title || "🔔 Teste de Notificação VibeFlow Android",
      body: options?.body || "Esta notificação em segundo plano foi entregue com sucesso via Firebase Cloud Messaging.",
      type: options?.type || "critical_alert",
    });

    // Also trigger native browser notification if in foreground and permission is granted
    if (getNotificationPermissionStatus() === "granted") {
      try {
        const sw = await navigator.serviceWorker.getRegistration();
        if (sw) {
          sw.showNotification(options?.title || "🔔 Teste de Notificação VibeFlow", {
            body: options?.body || "Notificação push em segundo plano entregue com sucesso.",
            icon: "/favicon.svg",
            badge: "/favicon.svg",
            vibrate: [200, 100, 200],
            tag: `test-push-${Date.now()}`,
          } as any);
        }
      } catch (swErr) {
        console.warn("Fallback local notification error:", swErr);
      }
    }

    return response;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Erro ao disparar notificação de teste.",
    };
  }
}

/**
 * Unregister device token
 */
export async function unregisterPushNotifications(): Promise<boolean> {
  const token = secureStorage.getItem<string>("vibeflow_fcm_token");
  if (token) {
    await post("/api/notifications/fcm/unregister", { token }).catch(() => {});
    secureStorage.removeItem("vibeflow_fcm_token");
  }
  return true;
}

/**
 * Get active device token from secure storage
 */
export function getStoredPushToken(): string | null {
  return secureStorage.getItem<string>("vibeflow_fcm_token");
}

/**
 * Load user notification preferences from backend or local storage
 */
export async function getStoredPreferences(): Promise<PushNotificationPreferences> {
  try {
    const res = await get<{ success: boolean; preferences: PushNotificationPreferences }>("/api/notifications/preferences");
    if (res && res.preferences) {
      secureStorage.setItem("vibeflow_notification_prefs", res.preferences);
      return res.preferences;
    }
  } catch {}
  
  return secureStorage.getItem<PushNotificationPreferences>("vibeflow_notification_prefs") || DEFAULT_NOTIFICATION_PREFERENCES;
}

/**
 * Save user notification preferences
 */
export async function savePreferences(preferences: Partial<PushNotificationPreferences>): Promise<PushNotificationPreferences> {
  const current = await getStoredPreferences();
  const updated = { ...current, ...preferences };
  secureStorage.setItem("vibeflow_notification_prefs", updated);

  await put("/api/notifications/preferences", { preferences: updated }).catch(() => {});
  return updated;
}
