import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationPermissionModal } from "@/components/NotificationPermissionModal";
import { ToastProvider } from "@/contexts/ToastContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import * as pushNotifications from "@/lib/pushNotifications";

vi.mock("@/lib/pushNotifications", () => ({
  registerPushNotifications: vi.fn(),
  getNotificationPermissionStatus: vi.fn(() => "default"),
  isAndroidNativeApp: vi.fn(() => false),
  isPushSupported: vi.fn(() => true),
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <ToastProvider>
        {ui}
      </ToastProvider>
    </LanguageProvider>
  );
}

describe("NotificationPermissionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("não renderiza quando isOpen é false", () => {
    renderWithProviders(
      <NotificationPermissionModal isOpen={false} onClose={() => {}} />
    );
    expect(screen.queryByText("Fique no controle dos seus Agentes")).toBeNull();
  });

  it("renderiza corretamente com benefícios de monitoramento e supervisão quando isOpen é true", () => {
    renderWithProviders(
      <NotificationPermissionModal isOpen={true} onClose={() => {}} />
    );
    expect(screen.getByText("Fique no controle dos seus Agentes")).toBeDefined();
    expect(screen.getByText("Monitoramento Contínuo dos Agentes")).toBeDefined();
    expect(screen.getByText("Aprovações Human-in-the-Loop Rápidas")).toBeDefined();
    expect(screen.getByText("Segurança & Conectores Corporativos")).toBeDefined();
  });

  it("chama onClose ao clicar em 'Lembrar Mais Tarde'", () => {
    const handleClose = vi.fn();
    renderWithProviders(
      <NotificationPermissionModal isOpen={true} onClose={handleClose} />
    );
    
    const dismissBtn = screen.getByText("Lembrar Mais Tarde");
    fireEvent.click(dismissBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("chama registerPushNotifications ao clicar no botão de ativar", async () => {
    (pushNotifications.registerPushNotifications as any).mockResolvedValue({
      success: true,
      status: "granted",
      token: "test_token",
    });

    const handleClose = vi.fn();
    const handleGranted = vi.fn();

    renderWithProviders(
      <NotificationPermissionModal 
        isOpen={true} 
        onClose={handleClose} 
        onPermissionGranted={handleGranted} 
      />
    );

    const activateBtn = screen.getByText("Ativar Notificações dos Agentes");
    await act(async () => {
      fireEvent.click(activateBtn);
    });

    expect(pushNotifications.registerPushNotifications).toHaveBeenCalled();
  });
});
