import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Key, Globe, AlertCircle, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, apiToken, domain);
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar. Tente novamente.");
    } finally {
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

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Acesso via Jira</CardTitle>
            <CardDescription>
              Entre com suas credenciais do Atlassian Jira para acessar a documentação.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain" className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Domínio Atlassian
                </Label>
                <div className="flex items-center gap-0">
                  <Input
                    id="domain"
                    placeholder="sua-empresa"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                    className="rounded-r-none border-r-0"
                  />
                  <span className="h-10 px-3 flex items-center bg-muted text-muted-foreground text-sm border border-input rounded-r-md whitespace-nowrap">
                    .atlassian.net
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiToken" className="flex items-center gap-2 text-sm font-medium">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  API Token
                </Label>
                <Input
                  id="apiToken"
                  type="password"
                  placeholder="Seu API Token do Jira"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Gere seu token em{" "}
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    id.atlassian.com
                  </a>
                </p>
              </div>

              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
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
