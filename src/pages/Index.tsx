import { useState, useMemo } from "react";
import { apiGroups } from "@/data/apiEndpoints";
import { ApiSidebar } from "@/components/ApiSidebar";
import { EndpointCard } from "@/components/EndpointCard";
import { MethodBadge } from "@/components/MethodBadge";
import { Shield, Zap, FileJson, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return apiGroups
      .filter((g) => !activeTag || g.tag === activeTag)
      .map((g) => ({
        ...g,
        endpoints: g.endpoints.filter(
          (ep) =>
            !q ||
            ep.path.toLowerCase().includes(q) ||
            ep.summary.toLowerCase().includes(q) ||
            ep.method.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.endpoints.length > 0);
  }, [activeTag, searchQuery]);

  const totalEndpoints = filteredGroups.reduce((acc, g) => acc + g.endpoints.length, 0);

  const methodCounts = useMemo(() => {
    const all = apiGroups.flatMap((g) => g.endpoints);
    return {
      GET: all.filter((e) => e.method === "GET").length,
      POST: all.filter((e) => e.method === "POST").length,
      PUT: all.filter((e) => e.method === "PUT").length,
      PATCH: all.filter((e) => e.method === "PATCH").length,
      DELETE: all.filter((e) => e.method === "DELETE").length,
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-card border border-border shadow-md"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:relative lg:block ${sidebarOpen ? "block" : "hidden lg:block"}`}>
        <ApiSidebar
          groups={apiGroups}
          activeTag={activeTag}
          onSelectTag={(tag) => { setActiveTag(tag); setSidebarOpen(false); }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar with logo */}
        <div className="border-b border-border bg-card px-6 lg:px-10 py-4 flex items-center gap-4">
          <img src={logo} alt="CustomApps" width={40} height={40} className="rounded-lg" />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">CustomApps</h1>
            <span className="text-[11px] text-muted-foreground font-mono">API Documentation</span>
          </div>
        </div>

        {/* Hero */}
        <div className="border-b border-border bg-card px-6 lg:px-10 py-8">
          <h2 className="text-lg font-semibold text-foreground mb-2">Sobre a iniciativa</h2>
          <p className="text-muted-foreground text-sm max-w-3xl mb-6 leading-relaxed">
            A plataforma <strong className="text-foreground">CustomApps</strong> nasceu para ir além do core do produto — 
            oferecendo aplicações e serviços complementares que aceleram a celebração de novos negócios. 
            Aqui, extensões de recursos e integrações com o motor de fluxos podem ser construídas com 
            autonomia, agilidade e governança independente, sem depender do ciclo padrão de desenvolvimento. 
            Explore abaixo todos os endpoints disponíveis.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 text-xs">
              <FileJson className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">{apiGroups.flatMap(g => g.endpoints).length} endpoints</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 text-xs">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">{apiGroups.length} categorias</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 text-xs">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">OpenAPI 3.0</span>
            </div>
            {Object.entries(methodCounts).filter(([,c]) => c > 0).map(([m, c]) => (
              <div key={m} className="flex items-center gap-1.5 text-xs">
                <MethodBadge method={m} />
                <span className="text-muted-foreground">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auth guide */}
        <div className="px-6 lg:px-10 py-6 border-b border-border">
          <div className="bg-code-bg rounded-lg p-5 max-w-3xl">
            <h3 className="text-sm font-semibold text-code-fg mb-2">🔐 Autenticação</h3>
            <p className="text-xs text-code-fg/70 mb-3">
              A maioria dos endpoints requer autenticação via Bearer Token. Inclua o seguinte header em suas requisições:
            </p>
            <pre className="text-xs text-code-fg font-mono bg-foreground/5 rounded px-3 py-2">
{`Authorization: Bearer <seu_token_aqui>
Content-Type: application/json`}
            </pre>
          </div>
        </div>

        {/* Endpoints */}
        <div className="px-6 lg:px-10 py-8 space-y-10">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-1">Nenhum endpoint encontrado</p>
              <p className="text-sm">Tente buscar com outros termos.</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <section key={group.tag} id={group.tag}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-foreground">{group.tag}</h2>
                  <span className="text-xs font-mono text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
                    {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.endpoints.map((ep, i) => (
                    <EndpointCard key={`${ep.method}-${ep.path}-${i}`} endpoint={ep} />
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Footer */}
          <div className="border-t border-border pt-8 pb-4 text-center text-xs text-muted-foreground">
            Custom-Apps API v1.7.7 · {totalEndpoints} endpoints exibidos
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
