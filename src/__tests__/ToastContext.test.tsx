import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ToastProvider, useToast } from "@/contexts/ToastContext";

function TestComponent() {
  const { toast } = useToast();
  return <button onClick={() => toast("Teste", "success")}>Mostrar Toast</button>;
}

describe("ToastContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("exibe toast ao chamar toast()", () => {
    render(<ToastProvider><TestComponent /></ToastProvider>);
    fireEvent.click(screen.getByText("Mostrar Toast"));
    expect(screen.getByText("Teste")).toBeDefined();
  });

  it("remove toast após 4 segundos", () => {
    render(<ToastProvider><TestComponent /></ToastProvider>);
    fireEvent.click(screen.getByText("Mostrar Toast"));
    expect(screen.getByText("Teste")).toBeDefined();
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.queryByText("Teste")).toBeNull();
  });
});
