import React, { useState } from "react";
import {
  FileText,
  Search,
  Grid,
  ChevronDown,
  Layers,
  ShieldCheck,
} from "lucide-react";
import {
  getTotalToolsCount,
  getPdfToolsCount,
  getImageToolsCount,
  getToolsByCategory,
  type ToolDefinition,
} from "../registry/tools";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onOpenAllTools: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (category: "pdf" | "image") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAllTools,
  onSelectTool,
  onNavigateHome,
  onNavigateCategory,
}) => {
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);

  const totalCount = getTotalToolsCount();
  const pdfCount = getPdfToolsCount();
  const imageCount = getImageToolsCount();

  const pdfTools = getToolsByCategory("pdf");
  const imageTools = getToolsByCategory("image");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Logo & Brand Identity */}
        <div className="flex items-center space-x-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="flex items-center space-x-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)]/40 transition-colors shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)] font-sans">
                LosersPdf
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className="px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Home
            </a>

            {/* All Tools Directory Launcher */}
            <button
              onClick={onOpenAllTools}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-hover)] rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Grid className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>All Tools</span>
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] rounded">
                {totalCount}
              </span>
            </button>

            {/* PDF Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPdfDropdownOpen(true)}
              onMouseLeave={() => setPdfDropdownOpen(false)}
            >
              {/* BUTTON */}
              <a
                href="/pdf-tools"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCategory("pdf");
                }}
                className={`
      flex items-center space-x-1
      px-3 py-1.5
      text-[13px] font-medium
      rounded-lg
      cursor-pointer
      transition-all duration-200
      ${
        pdfDropdownOpen
          ? "text-[var(--text-primary)] bg-[var(--surface-hover)] border border-[var(--border)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
      }
    `}
              >
                <span>PDF Tools</span>

                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  ({pdfCount})
                </span>

                <ChevronDown
                  className={`
        w-3 h-3 ml-0.5
        text-[var(--text-muted)]
        transition-transform duration-300
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${pdfDropdownOpen ? "rotate-180" : ""}
      `}
                />
              </a>

              {/* HOVER BRIDGE + MENU */}
              {/* HOVER BRIDGE + MEGA MENU */}
              <div
                className={`
    absolute
    top-full
    left-1/2
    -translate-x-1/2
    pt-3
    z-[9999]

    transition-all
    duration-[680ms]
    ease-[cubic-bezier(0.22,1,0.36,1)]

    ${
      pdfDropdownOpen
        ? "opacity-100 translate-y-0 scale-100 visible pointer-events-auto"
        : "opacity-0 -translate-y-1 scale-[0.98] invisible pointer-events-none"
    }
  `}
              >
                <div
                  className="
      w-[min(900px,calc(100vw-32px))]
      max-h-[calc(100vh-110px)]
      overflow-y-visible

      rounded-2xl
      bg-[var(--surface)]
      border
      border-[var(--border)]

      shadow-[0_20px_60px_rgba(0,0,0,0.12)]
      dark:shadow-[0_28px_80px_rgba(0,0,0,0.45)]

      overflow-visible
    "
                >
                  {/* HEADER */}
                  <div
                    className="
        px-5
        py-3.5

        border-b
        border-[var(--border)]

        bg-[var(--surface-subtle)]

        flex
        items-center
        justify-between
      "
                  >
                    <div>
                      <div
                        className="
            text-[10px]
            font-mono
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--text-muted)]
          "
                      >
                        PDF Utilities
                      </div>

                      <div
                        className="
            mt-1
            text-[11px]
            text-[var(--text-muted)]
          "
                      >
                        Tools for working with PDF documents
                      </div>
                    </div>

                    <div
                      className="
          text-[10px]
          font-mono
          font-medium
          uppercase
          tracking-wider
          text-[var(--accent)]
        "
                    >
                      {pdfCount} tools
                    </div>
                  </div>

                  {/* TOOLS GRID */}
                  <div
                    className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3

        gap-1

        p-2.5
      "
                  >
                    {pdfTools.map((tool) => {
                      const Icon = tool.icon;

                      return (
                        <a
                          key={tool.id}
                          href={tool.route}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectTool(tool);
                            setPdfDropdownOpen(false);
                          }}
                          className="
              group
              relative

              flex
              items-center
              gap-3

              w-full
              min-w-0

              rounded-xl
              px-3
              py-3

              text-left
              cursor-pointer

              transition-all
              duration-200
              ease-[cubic-bezier(0.16,1,0.3,1)]

              hover:bg-[var(--surface-hover)]
            "
                        >
                          {/* ICON */}
                          <div
                            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-lg

                bg-[var(--surface-subtle)]

                border
                border-[var(--border)]

                text-[var(--text-secondary)]

                transition-all
                duration-200

                group-hover:border-[var(--accent)]/30
                group-hover:bg-[var(--accent-subtle)]
                group-hover:text-[var(--accent)]
                group-hover:scale-105
              "
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* TEXT */}
                          <div className="min-w-0 flex-1">
                            <p
                              className="
                  truncate

                  text-[13px]
                  font-medium
                  leading-5

                  text-[var(--text-primary)]

                  transition-colors
                  duration-200

                  group-hover:text-[var(--accent)]
                "
                            >
                              {tool.name}
                            </p>

                            <p
                              className="
                  mt-0.5

                  line-clamp-1

                  text-[10px]
                  leading-4

                  text-[var(--text-muted)]
                "
                            >
                              {tool.description}
                            </p>
                          </div>

                          {/* SUBTLE ARROW */}
                          <svg
                            className="
                h-3
                w-3
                shrink-0

                text-[var(--text-muted)]

                opacity-0
                -translate-x-1

                transition-all
                duration-200

                group-hover:translate-x-0
                group-hover:opacity-100
                group-hover:text-[var(--accent)]
              "
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setImageDropdownOpen(true)}
              onMouseLeave={() => setImageDropdownOpen(false)}
            >
              {/* Image Tools Button */}
              <a
                href="/image-tools"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCategory("image");
                }}
                className={`
      flex items-center space-x-1
      px-3 py-1.5
      text-[13px] font-medium
      rounded-lg
      cursor-pointer
      transition-all duration-200
      ${
        imageDropdownOpen
          ? "text-[var(--text-primary)] bg-[var(--surface-hover)] border border-[var(--border)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
      }
    `}
              >
                <span>Image Tools</span>

                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  ({imageCount})
                </span>

                <ChevronDown
                  className={`
        w-3 h-3 ml-0.5
        text-[var(--text-muted)]
        transition-transform duration-300
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${imageDropdownOpen ? "rotate-180" : ""}
      `}
                />
              </a>

              {/* Dropdown + invisible hover bridge */}
              <div
                className={`
      absolute
      top-full
      left-0
      pt-2
      z-[9999]

      transition-all
      duration-[280ms]
      ease-[cubic-bezier(0.22,1,0.36,1)]

      ${
        imageDropdownOpen
          ? "opacity-100 translate-y-0 scale-100 visible pointer-events-auto"
          : "opacity-0 -translate-y-1 scale-[0.98] invisible pointer-events-none"
      }
    `}
              >
                <div
                  className="
        w-84
        py-2
        bg-[var(--surface)]
        rounded-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        dark:shadow-[0_28px_80px_rgba(0,0,0,0.45)]
        border border-[var(--border)]
        grid grid-cols-1
        max-h-[calc(100vh-110px)]
        overflow-y-visible
      "
                >
                  {/* Header */}
                  <div
                    className="
          px-4 py-2.5
          text-[10px]
          font-mono
          font-medium
          text-[var(--text-muted)]
          uppercase
          tracking-wider
          border-b border-[var(--border)]
          bg-[var(--surface-subtle)]
          flex
          items-center
          justify-between
        "
                  >
                    <span>Image Utilities</span>

                    <span className="text-[var(--accent)] font-mono font-medium">
                      {imageCount} tools
                    </span>
                  </div>

                  {/* Image Tools */}
                  <div className="p-1.5 space-y-0.5">
                    {imageTools.map((tool) => {
                      const Icon = tool.icon;

                      return (
                        <a
                          key={tool.id}
                          href={tool.route}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectTool(tool);
                            setImageDropdownOpen(false);
                          }}
                          className="
                flex
                items-center
                space-x-3
                px-3
                py-2.5
                text-left
                rounded-xl
                hover:bg-[var(--surface-hover)]
                transition-all duration-150
                group
                cursor-pointer
                w-full
              "
                        >
                          <div
                            className="
                  p-2
                  rounded-lg
                  bg-[var(--surface-subtle)]
                  border border-[var(--border)]
                  text-[var(--text-secondary)]
                  group-hover:border-[var(--accent)]/30
                  group-hover:bg-[var(--accent-subtle)]
                  group-hover:text-[var(--accent)]
                  transition-all duration-150
                  shrink-0
                "
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--text-primary)]
                    group-hover:text-[var(--accent)]
                    truncate
                    transition-colors
                  "
                            >
                              {tool.name}
                            </p>

                            <p
                              className="
                    text-[10px]
                    text-[var(--text-muted)]
                    line-clamp-1
                    mt-0.5
                  "
                            >
                              {tool.description}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenAllTools}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-[var(--text-secondary)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-[var(--text-secondary)] rounded">
              Search tools..
              <span className="inline-block ml-1 drop-shadow-[0_0_4px_rgba(255,50,70,0.9)] drop-shadow-[0_0_10px_rgba(255,50,70,0.55)]">
                ❤️
              </span>
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Mobile All Tools Button */}
          <button
            onClick={onOpenAllTools}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors cursor-pointer"
            title="Open All Tools"
          >
            <Grid className="w-4 h-4 text-[var(--accent)]" />
          </button>
        </div>
      </div>
    </header>
  );
};
