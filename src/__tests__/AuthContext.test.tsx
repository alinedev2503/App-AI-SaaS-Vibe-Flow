import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { secureStorage } from "../lib/secureStorage";
import * as apiClient from "../lib/api/client";
import React from "react";

// Mock the API client
vi.mock("../lib/api/client", () => ({
  post: vi.fn(),
  get: vi.fn(),
}));

// Mock secureStorage
vi.mock("../lib/secureStorage", () => ({
  secureStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clearAuth: vi.fn(),
  },
}));

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderAuthHook() {
    return renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) =>
        React.createElement(AuthProvider, null, children),
    });
  }

  it("deve realizar login com sucesso e persistir dados", async () => {
    const mockUser = { id: "1", email: "test@vibeflow.ai", name: "Test User", role: "admin" };
    const mockToken = "mock_token";
    
    // Mock successful post response
    (apiClient.post as vi.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

    const { result } = renderAuthHook();

    await act(async () => {
      const success = await result.current.login("test@vibeflow.ai", "password123");
      expect(success).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    
    // Verify persistence
    expect(secureStorage.setItem).toHaveBeenCalledWith("vibeflow_token", mockToken);
    expect(secureStorage.setItem).toHaveBeenCalledWith("vibeflow_user", mockUser);
  });
});
