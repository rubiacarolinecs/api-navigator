import { Search, BookOpen } from "lucide-react";
import type { ApiGroup } from "@/data/apiEndpoints";

interface ApiSidebarProps {
  groups: ApiGroup[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ApiSidebar = ({ groups, activeTag, onSelectTag, searchQuery, onSearchChange }: ApiSidebarProps) => {
  return (
    <aside className="w-72 flex-shrink-0 border-r border-border bg-card h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Custom-Apps</h1>
            <span className="text-[10px] text-muted-foreground font-mono">v1.7.7</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar endpoints..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <button
          onClick={() => onSelectTag(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            activeTag === null
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Todos os endpoints
        </button>
        {groups.map((g) => (
          <button
            key={g.tag}
            onClick={() => onSelectTag(g.tag)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
              activeTag === g.tag
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="truncate">{g.tag}</span>
            <span className="text-[10px] font-mono opacity-60">{g.endpoints.length}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
