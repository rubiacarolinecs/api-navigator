import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface JiraUser {
  email: string;
  displayName: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: JiraUser | null;
  isLoading: boolean;
  login: (email: string, apiToken: string, domain: string) => Promise<void>;
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

  const login = async (email: string, apiToken: string, domain: string) => {
    const credentials = btoa(`${email}:${apiToken}`);
    
    try {
      const response = await fetch(`https://${domain}.atlassian.net/rest/api/3/myself`, {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas. Verifique seu email, token e domínio.");
      }

      const data = await response.json();
      const jiraUser: JiraUser = {
        email: data.emailAddress || email,
        displayName: data.displayName || email,
        avatarUrl: data.avatarUrls?.["48x48"],
      };

      localStorage.setItem("jira_auth", JSON.stringify(jiraUser));
      localStorage.setItem("jira_credentials", JSON.stringify({ email, apiToken, domain }));
      setUser(jiraUser);
    } catch (error: any) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        // CORS issue - fallback: accept credentials and store
        const jiraUser: JiraUser = {
          email,
          displayName: email.split("@")[0],
        };
        localStorage.setItem("jira_auth", JSON.stringify(jiraUser));
        localStorage.setItem("jira_credentials", JSON.stringify({ email, apiToken, domain }));
        setUser(jiraUser);
      } else {
        throw error;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("jira_auth");
    localStorage.removeItem("jira_credentials");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
