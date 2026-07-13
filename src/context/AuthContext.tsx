"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, User } from "@/services/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkAuth = async () => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("gamecoins_token");
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setToken(storedToken);
      const fetchedUser = await authService.getCurrentUser(storedToken);
      setUser(fetchedUser);
      localStorage.setItem("gamecoins_user", JSON.stringify(fetchedUser));
    } catch (error) {
      console.error("Startup authentication verification failed:", error);
      // Remove invalid token & user data from storage
      localStorage.removeItem("gamecoins_token");
      localStorage.removeItem("gamecoins_user");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on startup
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for the custom logout event from the API wrapper
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
      router.push("/login");
    };

    window.addEventListener("gamecoins-logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("gamecoins-logout", handleLogoutEvent);
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      localStorage.setItem("gamecoins_token", data.token);
      localStorage.setItem("gamecoins_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await authService.register(name, email, password);
      router.push("/login");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
