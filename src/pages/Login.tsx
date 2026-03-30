import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";

const Login = () => {
  const { loginWithAtlassian } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithAtlassian();
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(220,20%,93%)] to-[hsl(220,70%,95%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="cVortex" className="h-16 w-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">CustomApps</h1>
          <p className="text-muted-foreground text-sm mt-1">Documentação de APIs</p>
        </div>

        <Card className="shadow-xl border-0 bg-amber-50/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Acesso via Atlassian</CardTitle>
            <CardDescription>
              Faça login com sua conta Atlassian (Jira) para acessar a documentação.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              className="w-full h-12 font-semibold text-base gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Entrar com Atlassian
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Você será redirecionado para o login seguro da Atlassian.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} cVortex — CustomApps
        </p>
      </div>
    </div>
  );
};

export default Login;
