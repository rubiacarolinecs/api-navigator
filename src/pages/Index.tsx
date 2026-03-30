import { useState, useMemo } from "react";
import { apiGroups, apiSections } from "@/data/apiEndpoints";
import { ApiSidebar } from "@/components/ApiSidebar";
import { EndpointCard } from "@/components/EndpointCard";
import { MethodBadge } from "@/components/MethodBadge";
import { Shield, FileJson, Menu, X, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

      {/* Sidebar - Desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${sidebarCollapsed ? "w-0 overflow-hidden" : ""}`}>
        <ApiSidebar
          groups={apiGroups}
          sections={apiSections}
          activeTag={activeTag}
          onSelectTag={(tag) => { setActiveTag(tag); setSidebarOpen(false); }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <ApiSidebar
          groups={apiGroups}
          sections={apiSections}
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
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={sidebarCollapsed ? "Abrir menu" : "Fechar menu"}
          >
            {sidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
          <img src={logo} alt="CustomApps" width={72} height={72} className="rounded-lg" />
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">CustomApps</h1>
            <span className="text-[11px] text-muted-foreground font-mono">API Documentation</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {user && (
              <span className="hidden md:block text-sm text-muted-foreground">
                {user.displayName}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>

        {/* Hero */}
        <div className="border-b border-border bg-card px-6 lg:px-10 py-8">
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
          <div className="border border-yellow-500/40 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-5 max-w-3xl">
            <h3 className="text-sm font-semibold text-foreground mb-2">🔐 Autenticação</h3>
            <p className="text-xs text-muted-foreground mb-3">
              A maioria dos endpoints requer autenticação via Bearer Token. Inclua o seguinte header em suas requisições:
            </p>
            <pre className="text-xs text-foreground font-mono bg-muted rounded px-3 py-2">
{`Authorization: Bearer <seu_token_aqui>
Content-Type: application/json`}
            </pre>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">📌 Integração via plataforma:</strong> Estes endpoints são, em sua maioria, consumidos por meio de integrações com a plataforma <strong>cVortex</strong>. Todos os dados necessários para autenticação e configuração devem ser enviados a partir das <em>integrations</em> criadas dentro da plataforma.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">🛠️ Uso externo à plataforma:</strong> Caso precise utilizar estes endpoints fora do ambiente SaaS da cVortex, entre em contato com o Time de CustomApps pelo{" "}
                <a href="https://cvortex.atlassian.net/servicedesk/customer/portal/12" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                  catálogo de serviços
                </a>.
              </p>
            </div>
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
