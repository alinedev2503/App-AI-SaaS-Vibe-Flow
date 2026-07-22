import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import React from "react";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeContext", () => {
  function renderThemeHook() {
    return renderHook(() => useTheme(), {
      wrapper: ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children),
    });
  }

  it("usa dark como tema padrão", () => {
    const { result } = renderThemeHook();
    expect(result.current.theme).toBe("dark");
  });

  it("alterna entre light e dark", () => {
    const { result } = renderThemeHook();
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("adiciona classe dark ao HTML no tema dark", () => {
    renderThemeHook();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("remove classe dark ao alternar para light", () => {
    const { result } = renderThemeHook();
    act(() => result.current.toggleTheme());
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persiste tema no localStorage", () => {
    const { result } = renderThemeHook();
    act(() => result.current.toggleTheme());
    expect(localStorage.getItem("theme")).toBe("light");
  });
});

describe("useTheme error", () => {
  it("lança erro fora do provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });
});
