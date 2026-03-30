import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ApiGroup, ApiSection } from "@/data/apiEndpoints";
import logo from "@/assets/logo.png";

interface ApiSidebarProps {
  groups: ApiGroup[];
  sections: ApiSection[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ApiSidebar = ({ groups, sections, activeTag, onSelectTag, searchQuery, onSearchChange }: ApiSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map((s) => [s.name, true]))
  );

  const toggleSection = (name: string) => {
    setExpandedSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const groupsByTag = Object.fromEntries(groups.map((g) => [g.tag, g]));

  return (
    <aside className="w-72 flex-shrink-0 border-r border-border bg-card h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <img src={logo} alt="CustomApps" width={32} height={32} className="rounded-lg" />
          <div>
            <h1 className="text-sm font-bold text-foreground">CustomApps</h1>
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
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
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

        {sections.map((section) => (
          <div key={section.name} className="mt-2">
            <button
              onClick={() => toggleSection(section.name)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{section.name}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  expandedSections[section.name] ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {expandedSections[section.name] && (
              <div className="space-y-0.5 ml-1">
                {section.tags
                  .filter((tag) => groupsByTag[tag])
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onSelectTag(tag)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                        activeTag === tag
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{tag}</span>
                      <span className="text-[10px] font-mono opacity-60">
                        {groupsByTag[tag].endpoints.length}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};
