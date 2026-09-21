import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  X,
  FileText,
  Image as ImageIcon,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import {
  TOOLS_REGISTRY,
  searchTools,
  getTotalToolsCount,
  getPdfToolsCount,
  getImageToolsCount,
  type ToolDefinition,
} from "../registry/tools";

interface AllToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const AllToolsModal: React.FC<AllToolsModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pdf" | "image">("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setActiveTab("all");
      setSelectedSubcategory("all");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter tools strictly from central registry
  const filteredTools = useMemo(() => {
    let list = searchQuery ? searchTools(searchQuery) : TOOLS_REGISTRY;

    if (activeTab !== "all") {
      list = list.filter((t) => t.category === activeTab);
    }

    if (selectedSubcategory !== "all") {
      list = list.filter((t) => t.subcategory === selectedSubcategory);
    }

    return list;
  }, [searchQuery, activeTab, selectedSubcategory]);

  // Subcategories available in active view
  const availableSubcategories = useMemo(() => {
    const subcats = new Map<string, string>();
    const baseList =
      activeTab === "all"
        ? TOOLS_REGISTRY
        : TOOLS_REGISTRY.filter((t) => t.category === activeTab);

    baseList.forEach((t) => {
      if (!subcats.has(t.subcategory)) {
        subcats.set(t.subcategory, t.subcategoryLabel);
      }
    });

    return Array.from(subcats.entries()).map(([key, label]) => ({
      key,
      label,
    }));
  }, [activeTab]);

  // Group filtered tools by category & subcategory for clear, scannable layout
  const groupedTools = useMemo(() => {
    const map = new Map<string, ToolDefinition[]>();

    filteredTools.forEach((tool) => {
      const groupKey = `${tool.category.toUpperCase()} — ${tool.subcategoryLabel}`;
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)!.push(tool);
    });

    return Array.from(map.entries()).map(([title, tools]) => ({
      title,
      tools,
    }));
  }, [filteredTools]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 z-10 bg-[var(--surface)]">
        {/* Header Section with Search */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between pb-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                  All Utilities Directory
                </h2>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  <span className="text-[var(--accent)] font-mono font-medium">
                    {getTotalToolsCount()} utilities
                  </span>{" "}
                  available • Zero database • In-Memory Processing
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedSubcategory !== "all") setSelectedSubcategory("all");
              }}
              placeholder="Search all tools (e.g. compress, merge, word to pdf, watermark, sign, jpg)..."
              className="w-full pl-10 pr-9 py-3 bg-[var(--surface-subtle)] border border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs sm:text-sm focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
            <div className="flex items-center p-0.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-lg">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedSubcategory("all");
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-hover)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                All ({getTotalToolsCount()})
              </button>

              <button
                onClick={() => {
                  setActiveTab("pdf");
                  setSelectedSubcategory("all");
                }}
                className={`flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "pdf"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-hover)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <FileText className="w-3 h-3 text-[var(--accent)]" />
                <span>PDF ({getPdfToolsCount()})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("image");
                  setSelectedSubcategory("all");
                }}
                className={`flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "image"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-hover)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <ImageIcon className="w-3 h-3 text-[var(--accent)]" />
                <span>Image ({getImageToolsCount()})</span>
              </button>
            </div>

            {/* Subcategory Pill Filters */}
            <div className="hidden sm:flex items-center space-x-1 ml-auto border-l border-[var(--border)] pl-2.5">
              <span className="text-[10px] font-mono text-[var(--text-muted)] mr-0.5">
                Filter:
              </span>
              <button
                onClick={() => setSelectedSubcategory("all")}
                className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                  selectedSubcategory === "all"
                    ? "bg-[var(--surface-hover)] text-[var(--text-primary)] font-medium border border-[var(--border-hover)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                All
              </button>
              {availableSubcategories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedSubcategory(key)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                    selectedSubcategory === key
                      ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-medium border border-[var(--accent-border)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Body (Scrollable Grid) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {filteredTools.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-2 text-[var(--text-muted)]">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                No tools matched "{searchQuery}"
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
                Try searching for "compress", "word", "sign", "rotate", or "split"
              </p>
            </div>
          ) : (
            groupedTools.map(({ title, tools }) => (
              <div key={title} className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] font-mono">
                    {title}
                  </span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTool(tool);
                          onClose();
                        }}
                        className="tool-card group text-left p-4 flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex items-center space-x-1.5">
                              {tool.badge && (
                                <span
                                  className={`px-1.5 py-0.2 text-[8px] font-mono uppercase rounded border ${
                                    tool.badge === "Popular"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                      : "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)]"
                                  }`}
                                >
                                  {tool.badge}
                                </span>
                              )}
                              <span className="px-1.5 py-0.2 text-[8px] font-mono rounded bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--border)]">
                                {tool.processingMethod === "client"
                                  ? "In-Browser"
                                  : "Server"}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                            <span>{tool.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                          </h3>

                          <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-2">
                            {tool.description}
                          </p>
                        </div>

                        <div className="mt-3.5 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                          <span>{tool.acceptedFormats.join(", ")}</span>
                          <span className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors uppercase">
                            → {tool.outputFormat}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-subtle)] flex flex-wrap items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              All {getTotalToolsCount()} tools loaded and ready in memory.
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono text-[var(--text-muted)]">
            <span>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] rounded">
                ESC
              </kbd>{" "}
              to exit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
