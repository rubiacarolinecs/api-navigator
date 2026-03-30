import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface JiraUser {
  email: string;
  displayName: string;
  avatarUrl?: string;
  accountId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: JiraUser | null;
  isLoading: boolean;
  loginWithAtlassian: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JiraUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jira_auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("jira_auth");
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithAtlassian = async () => {
    const redirectUri = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.functions.invoke("atlassian-oauth", {
      body: { action: "get_auth_url", redirect_uri: redirectUri },
    });

    if (error || data?.error) {
      throw new Error(data?.error || error?.message || "Erro ao iniciar autenticação.");
    }

    window.location.href = data.url;
  };

  const logout = () => {
    localStorage.removeItem("jira_auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, loginWithAtlassian, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
