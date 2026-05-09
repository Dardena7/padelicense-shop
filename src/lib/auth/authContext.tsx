"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { tokenStore } from "./tokenStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/graphql", "") || "http://localhost:3000";

type User = {
  publicId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (params: SignupParams) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
};

type SignupParams = {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
};

class AuthError extends Error {}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

const mapUser = (data: Record<string, string>): User => ({
  publicId: data.public_id,
  email: data.email,
  firstName: data.first_name,
  lastName: data.last_name,
  phone: data.phone || null,
  role: data.role,
});

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthResponse = useCallback(
    (data: { user: Record<string, string>; access_token: string }) => {
      tokenStore.setAccessToken(data.access_token);
      setUser(mapUser(data.user));
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new AuthError(body.error || "Login failed");
      }

      const data = await res.json();
      handleAuthResponse(data);
    },
    [handleAuthResponse],
  );

  const signup = useCallback(
    async (params: SignupParams) => {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user: {
            email: params.email,
            password: params.password,
            password_confirmation: params.passwordConfirmation,
            first_name: params.firstName,
            last_name: params.lastName,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new AuthError(body.errors?.join(", ") || "Signup failed");
      }

      const data = await res.json();
      handleAuthResponse(data);
    },
    [handleAuthResponse],
  );

  const logout = useCallback(async () => {
    const accessToken = tokenStore.getAccessToken();
    if (accessToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
    }
    tokenStore.setAccessToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      handleAuthResponse(data);
    } catch {
      // silently fail — user is not logged in
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  useEffect(() => {
    // Restore session on mount — setState in effect is intentional here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshToken();
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export { AuthError };
