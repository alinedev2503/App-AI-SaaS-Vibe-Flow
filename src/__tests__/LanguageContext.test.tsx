import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import React from "react";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("LanguageContext", () => {
  function renderLanguageHook() {
    return renderHook(() => useLanguage(), {
      wrapper: ({ children }: { children: React.ReactNode }) =>
        React.createElement(LanguageProvider, null, children),
    });
  }

  it("usa pt-BR como idioma padrão", () => {
    const { result } = renderLanguageHook();
    expect(result.current.language).toBe("pt-BR");
  });

  it("altera o idioma", () => {
    const { result } = renderLanguageHook();
    act(() => result.current.setLanguage("en-US"));
    expect(result.current.language).toBe("en-US");
  });

  it("persiste idioma no localStorage", () => {
    const { result } = renderLanguageHook();
    act(() => result.current.setLanguage("en-US"));
    expect(localStorage.getItem("language")).toBe("en-US");
  });

  it("traduz chaves existentes", () => {
    const { result } = renderLanguageHook();
    expect(result.current.t("sidebar.dashboard")).toBe("Painel de Controle");
  });

  it("retorna a chave como fallback para chave inexistente", () => {
    const { result } = renderLanguageHook();
    expect(result.current.t("chave.inexistente")).toBe("chave.inexistente");
  });
});

describe("useLanguage error", () => {
  it("lança erro fora do provider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      "useLanguage must be used within a LanguageProvider"
    );
  });
});
