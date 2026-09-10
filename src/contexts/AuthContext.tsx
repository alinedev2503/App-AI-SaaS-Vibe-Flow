import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { secureStorage } from "@/lib/secureStorage";
import { get, post } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "viewer" | string;
  avatar?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => void;
  refreshUser: () => Promise<void>;
}

// Default initial profile for single-click showcase, local evaluations & seamless navigation
export const DEFAULT_PLATFORM_ADMIN: AuthUser = {
  id: "admin-platform-01",
  name: "Alex Rivera",
  email: "alex.rivera@vibeflow.ai",
  role: "admin",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEDfjRXoeZlHub0rO43nIpQRONGJQ6h2fEPkYsLVlvMNaBey71u8MATZ5jqDxyIIImZE_SnNMgjcxC7OcSurkgcamBOLDmMSDp3xp-Apu2q9f0x6gHxWYv1Il4N-prkBzy1aRcd5UeWpI5EdkpCAsJpzZEA_V8eTHTVZHug4VL9QFfcVYbQp6StmtsBNwASWdWOhPh3n_8tL-aIOChx0-dCNL_pv5m6c_p_7hLgtLubHocGpu558-SPGiXOFDJdhjuh9gY8-rqjYtV",
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = secureStorage.getItem<AuthUser>("vibeflow_user");
    return savedUser || DEFAULT_PLATFORM_ADMIN;
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = secureStorage.getItem<string>("vibeflow_token");
    return savedToken || "demo_secure_session_token_alex_rivera";
  });

  const [isLoading, setIsLoading] = useState(true);

  // Synchronize initial session to encrypted storage on mount
  useEffect(() => {
    const storedUser = secureStorage.getItem<AuthUser>("vibeflow_user");
    const storedToken = secureStorage.getItem<string>("vibeflow_token");

    if (!storedUser) {
      secureStorage.setItem("vibeflow_user", DEFAULT_PLATFORM_ADMIN);
      setUser(DEFAULT_PLATFORM_ADMIN);
    } else {
      setUser(storedUser);
    }

    if (!storedToken) {
      secureStorage.setItem("vibeflow_token", "demo_secure_session_token_alex_rivera");
      setToken("demo_secure_session_token_alex_rivera");
    } else {
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  // Listen to storage events across tabs to keep multiple windows in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "_vf_sec_vibeflow_user" || e.key === "vibeflow_user") {
        const updated = secureStorage.getItem<AuthUser>("vibeflow_user");
        setUser(updated || DEFAULT_PLATFORM_ADMIN);
      }
      if (e.key === "_vf_sec_vibeflow_token" || e.key === "vibeflow_token") {
        const updatedToken = secureStorage.getItem<string>("vibeflow_token");
        setToken(updatedToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Background refresh of user profile from API if online
  const refreshUser = useCallback(async () => {
    try {
      const activeToken = secureStorage.getItem<string>("vibeflow_token");
      if (!activeToken) return;

      const res = await get<{ user: AuthUser }>("/api/auth/me").catch(() => null);
      if (res && res.user) {
        setUser(res.user);
        secureStorage.setItem("vibeflow_user", res.user);
      }
    } catch {
      // Keep existing authenticated session in case API is temporarily unreachable
    }
  }, []);

  const login = async (email: string, password = "password123"): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Try real server API endpoint
      const res = await post<{ user: AuthUser; token: string }>("/api/auth/login", { email, password }).catch(() => null);

      if (res && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        secureStorage.setItem("vibeflow_token", res.token);
        secureStorage.setItem("vibeflow_user", res.user);
        setIsLoading(false);
        return true;
      }

      // 2. Fallback client-side simulated login for demo mode / showcase
      const fallbackUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Alex Rivera",
        email: email || "alex.rivera@vibeflow.ai",
        role: "admin",
        avatar: DEFAULT_PLATFORM_ADMIN.avatar,
        created_at: new Date().toISOString(),
      };
      const fallbackToken = `vbf_sec_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      setToken(fallbackToken);
      setUser(fallbackUser);
      secureStorage.setItem("vibeflow_token", fallbackToken);
      secureStorage.setItem("vibeflow_user", fallbackUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, name: string, password = "password123"): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await post<{ user: AuthUser; token: string }>("/api/auth/register", { email, name, password }).catch(() => null);

      if (res && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        secureStorage.setItem("vibeflow_token", res.token);
        secureStorage.setItem("vibeflow_user", res.user);
        setIsLoading(false);
        return true;
      }

      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: name || "Novo Usuário",
        email: email || "usuario@empresa.com",
        role: "operator",
        avatar: DEFAULT_PLATFORM_ADMIN.avatar,
        created_at: new Date().toISOString(),
      };
      const newToken = `vbf_reg_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      setToken(newToken);
      setUser(newUser);
      secureStorage.setItem("vibeflow_token", newToken);
      secureStorage.setItem("vibeflow_user", newUser);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await post("/api/auth/logout").catch(() => {});
    } catch {}
    secureStorage.clearAuth();
    setUser(null);
    setToken(null);
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated: AuthUser = { ...user, ...data };
    setUser(updated);
    secureStorage.setItem("vibeflow_user", updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
