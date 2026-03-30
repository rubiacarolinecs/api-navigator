import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Código de autorização não encontrado.");
      return;
    }

    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/callback`;

        const { data, error: fnError } = await supabase.functions.invoke("atlassian-oauth", {
          body: { action: "exchange_code", code, redirect_uri: redirectUri },
        });

        if (fnError || data?.error) {
          setError(data?.error || fnError?.message || "Erro ao autenticar.");
          return;
        }

        localStorage.setItem("jira_auth", JSON.stringify(data.user));
        navigate("/", { replace: true });
      } catch (err: any) {
        setError(err.message || "Erro inesperado.");
      }
    };

    exchangeCode();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <a href="/login" className="text-primary hover:underline text-sm">
          Voltar ao login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Autenticando com Atlassian...</p>
    </div>
  );
};

export default AuthCallback;
