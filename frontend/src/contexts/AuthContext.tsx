import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) { setLoading(false); return; }
    try {
      const data = await api.get<{ user: AuthUser }>("/api/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("jwt_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ access_token: string; user: AuthUser }>("/api/auth/login", { email, password });
    localStorage.setItem("jwt_token", data.access_token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (
    username: string,
    email: string,
    password: string,
    confirm_password: string,
  ) => {
    const data = await api.post<{ access_token: string; user: AuthUser }>("/api/auth/register", {
      username,
      email,
      password,
      confirm_password,
    });
    localStorage.setItem("jwt_token", data.access_token);
    setUser(data.user);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, signOut }),
    [user, loading, login, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
