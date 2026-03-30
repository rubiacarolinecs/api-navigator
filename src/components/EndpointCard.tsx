import { useState } from "react";
import { ChevronDown, Lock, Copy, Check } from "lucide-react";
import { MethodBadge } from "./MethodBadge";
import type { ApiEndpoint } from "@/data/apiEndpoints";

const exampleBodies: Record<string, string> = {
  POST: JSON.stringify({ field1: "value1", field2: "value2", options: { key: true } }, null, 2),
  PUT: JSON.stringify({ id: "abc-123", field1: "updated_value" }, null, 2),
  PATCH: JSON.stringify({ field1: "partial_update" }, null, 2),
};

const exampleResponse = JSON.stringify(
  { success: true, data: { id: "abc-123", status: "ok" }, message: "Operação realizada com sucesso" },
  null,
  2
);

export const EndpointCard = ({ endpoint }: { endpoint: ApiEndpoint }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasBody = ["POST", "PUT", "PATCH"].includes(endpoint.method);

  const copyPath = () => {
    navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group border border-border rounded-lg bg-card transition-all hover:shadow-md hover:border-primary/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex flex-col gap-1.5 p-4 text-left"
      >
        <div className="flex items-center gap-3 w-full">
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-sm text-foreground flex-1 truncate">{endpoint.path}</code>
          {endpoint.requiresAuth && (
            <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
        <div className="pl-[60px] space-y-1">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O que faz?</strong>{" "}
            {endpoint.whatItDoes || endpoint.summary}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Qual a motivação?</strong>{" "}
            {endpoint.motivation || endpoint.description}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">

          {/* Auth info */}
          {endpoint.requiresAuth && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              <Lock className="w-3 h-3" />
              <span>Requer autenticação via <code className="font-mono text-primary">Bearer Token</code></span>
            </div>
          )}

          {/* Copy endpoint */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-code-bg rounded-md px-3 py-2 font-mono text-xs text-code-fg flex items-center gap-2 overflow-x-auto">
              <MethodBadge method={endpoint.method} />
              <span>{endpoint.path}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); copyPath(); }}
              className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
              title="Copiar endpoint"
            >
              {copied ? <Check className="w-4 h-4 text-method-get" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>

          {/* Request Body Example */}
          {hasBody && (
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Exemplo de Body (Request)
              </h5>
              <pre className="bg-code-bg text-code-fg rounded-md p-3 text-xs overflow-x-auto">
                {exampleBodies[endpoint.method] || exampleBodies.POST}
              </pre>
            </div>
          )}

          {/* Response Example */}
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Exemplo de Resposta (200 OK)
            </h5>
            <pre className="bg-code-bg text-code-fg rounded-md p-3 text-xs overflow-x-auto">
              {exampleResponse}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
};
