// Firebase Cloud Messaging (FCM) & Web Push Service Worker for VibeFlow
// Handles background notifications for Android (Google Play / PWA / Capacitor) and Web

const FCM_VERSION = "2.4.0";
const CACHE_NAME = `vibeflow-fcm-v${FCM_VERSION}`;

// Service Worker Install
self.addEventListener("install", (event) => {
  console.log(`[VibeFlow SW] Service Worker v${FCM_VERSION} instalado com sucesso.`);
  self.skipWaiting();
});

// Service Worker Activate
self.addEventListener("activate", (event) => {
  console.log(`[VibeFlow SW] Service Worker v${FCM_VERSION} ativado.`);
  event.waitUntil(self.clients.claim());
});

// Background Push Notification Handler
self.addEventListener("push", (event) => {
  console.log("[VibeFlow FCM SW] Notificação Push em segundo plano recebida.", event);

  let payload = {
    title: "VibeFlow — Alerta de Agente",
    body: "Você possui uma nova atividade de agente autônomo pendente de revisão.",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "vibeflow-alert",
    url: "/dashboard",
    data: {
      url: "/dashboard",
      type: "general",
      timestamp: Date.now()
    }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      const notification = data.notification || {};
      const customData = data.data || {};

      payload.title = notification.title || customData.title || payload.title;
      payload.body = notification.body || customData.body || payload.body;
      payload.icon = notification.icon || customData.icon || payload.icon;
      payload.badge = notification.badge || customData.badge || payload.badge;
      payload.tag = customData.tag || notification.tag || `vf-${Date.now()}`;
      payload.url = customData.url || notification.click_action || "/dashboard";
      payload.data = {
        ...customData,
        url: payload.url,
        timestamp: Date.now()
      };
    } catch (err) {
      console.warn("[VibeFlow FCM SW] Erro ao parsear payload JSON, usando texto puro:", err);
      payload.body = event.data.text() || payload.body;
    }
  }

  // Determine actions based on notification type
  const actions = [];
  if (payload.data && payload.data.type === "approval_request") {
    actions.push(
      { action: "approve", title: "✅ Aprovar Ação", icon: "/favicon.svg" },
      { action: "reject", title: "❌ Rejeitar", icon: "/favicon.svg" }
    );
  } else {
    actions.push(
      { action: "open", title: "🔍 Ver Detalhes", icon: "/favicon.svg" },
      { action: "dismiss", title: "Dispensar" }
    );
  }

  // Android & Desktop rich notification options
  const notificationOptions = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    tag: payload.tag,
    data: payload.data,
    actions: actions,
    vibrate: [200, 100, 200, 100, 200], // Android vibration pattern
    requireInteraction: true, // Keep notification visible until user interacts
    renotify: true,
    silent: false,
    timestamp: Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// Notification Click Handler (Deep Linking & Actions)
self.addEventListener("notificationclick", (event) => {
  console.log("[VibeFlow FCM SW] Clique em notificação detectado:", event.action, event.notification.data);
  
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = data.url || "/dashboard";

  // Handle action buttons
  if (event.action === "approve") {
    targetUrl = `/approvals?action=approve&id=${data.approvalId || ""}`;
  } else if (event.action === "reject") {
    targetUrl = `/approvals?action=reject&id=${data.approvalId || ""}`;
  } else if (event.action === "dismiss") {
    return; // Don't navigate
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Notification Close Handler (Analytics & telemetry)
self.addEventListener("notificationclose", (event) => {
  console.log("[VibeFlow FCM SW] Notificação dispensada pelo usuário:", event.notification.tag);
});
