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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Logo & Brand Identity */}
        <div className="flex items-center space-x-8">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#111622] border border-white/[0.08] flex items-center justify-center text-[#00AB80] group-hover:border-[#00AB80]/40 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                llosers
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 text-[13px] font-medium text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Home
            </button>

            {/* All Tools Directory Launcher */}
            <button
              onClick={onOpenAllTools}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-[#111622] hover:bg-[#161D2B] border border-white/[0.08] hover:border-white/[0.16] rounded-lg transition-all cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-[#00AB80]" />
              <span>All Tools</span>
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#0A0D14] border border-white/[0.08] rounded">
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
              <button
                onClick={() => onNavigateCategory("pdf")}
                className={`
      flex items-center space-x-1
      px-3 py-1.5
      text-[13px] font-medium
      rounded-lg
      cursor-pointer
      transition-all duration-200
      ${
        pdfDropdownOpen
          ? "text-white bg-white/[0.06]"
          : "text-[#94A3B8] hover:text-white hover:bg-white/[0.05]"
      }
    `}
              >
                <span>PDF Tools</span>

                <span className="text-[10px] text-[#64748B] font-mono">
                  ({pdfCount})
                </span>

                <ChevronDown
                  className={`
        w-3 h-3 ml-0.5
        text-[#64748B]
        transition-transform duration-600
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${pdfDropdownOpen ? "rotate-180" : ""}
      `}
                />
              </button>

              {/* HOVER BRIDGE + MENU */}
              <div
                className={`
      absolute
      top-full
      left-0
      pt-2
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
        w-80
        py-1.5
        bg-[#0E131F]
        rounded-xl
        shadow-[0_24px_70px_rgba(0,0,0,0.45)]
        border border-white/[0.08]
        overflow-hidden
      "
                >
                  {/* HEADER */}
                  <div
                    className="
          px-3.5 py-1.5
          text-[10px]
          font-mono
          font-medium
          text-[#64748B]
          uppercase
          tracking-wider
          border-b border-white/[0.06]
          flex items-center justify-between
        "
                  >
                    <span>PDF Utilities</span>

                    <span className="text-[#00AB80] font-mono">
                      {pdfCount} tools
                    </span>
                  </div>

                  {/* TOOLS */}
                  {pdfTools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTool(tool);
                          setPdfDropdownOpen(false);
                        }}
                        className="
              flex items-start
              space-x-2.5
              px-3 py-2
              text-left
              hover:bg-[#161D2B]
              transition-colors
              group
              cursor-pointer
              w-full
            "
                      >
                        <div
                          className="
                p-1
                rounded
                bg-[#111622]
                border border-white/[0.08]
                text-[#94A3B8]
                group-hover:text-[#00AB80]
                transition-colors
                mt-0.5
                shrink-0
              "
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                  text-xs
                  font-medium
                  text-[#F8FAFC]
                  group-hover:text-[#00AB80]
                  truncate
                "
                          >
                            {tool.name}
                          </p>

                          <p className="text-[10px] text-[#64748B] line-clamp-1">
                            {tool.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
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
              <button
                onClick={() => onNavigateCategory("image")}
                className={`
      flex items-center space-x-1
      px-3 py-1.5
      text-[13px] font-medium
      rounded-lg
      cursor-pointer
      transition-all duration-200
      ${
        imageDropdownOpen
          ? "text-white bg-white/[0.06]"
          : "text-[#94A3B8] hover:text-white hover:bg-white/[0.05]"
      }
    `}
              >
                <span>Image Tools</span>

                <span className="text-[10px] text-[#64748B] font-mono">
                  ({imageCount})
                </span>

                <ChevronDown
                  className={`
        w-3 h-3 ml-0.5
        text-[#64748B]
        transition-transform duration-[280ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${imageDropdownOpen ? "rotate-180" : ""}
      `}
                />
              </button>

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
        w-80
        py-1.5
        bg-[#0E131F]
        rounded-xl
        shadow-[0_24px_70px_rgba(0,0,0,0.45)]
        border border-white/[0.08]
        grid grid-cols-1
        max-h-96
        overflow-y-auto
      "
                >
                  {/* Header */}
                  <div
                    className="
          px-3.5 py-1.5
          text-[10px]
          font-mono
          font-medium
          text-[#64748B]
          uppercase
          tracking-wider
          border-b border-white/[0.06]
          flex
          items-center
          justify-between
        "
                  >
                    <span>Image Utilities</span>

                    <span className="text-[#00AB80] font-mono">
                      {imageCount} tools
                    </span>
                  </div>

                  {/* Image Tools */}
                  {imageTools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTool(tool);
                          setImageDropdownOpen(false);
                        }}
                        className="
              flex
              items-start
              space-x-2.5
              px-3
              py-2
              text-left
              hover:bg-[#161D2B]
              transition-colors
              group
              cursor-pointer
              w-full
            "
                      >
                        <div
                          className="
                p-1
                rounded
                bg-[#111622]
                border border-white/[0.08]
                text-[#94A3B8]
                group-hover:text-[#00AB80]
                transition-colors
                mt-0.5
                shrink-0
              "
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                  text-xs
                  font-medium
                  text-[#F8FAFC]
                  group-hover:text-[#00AB80]
                  truncate
                "
                          >
                            {tool.name}
                          </p>

                          <p
                            className="
                  text-[10px]
                  text-[#64748B]
                  line-clamp-1
                "
                          >
                            {tool.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenAllTools}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-[#94A3B8] bg-[#111622] hover:bg-[#161D2B] hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#64748B]" />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono  text-[#94A3B8] rounded">
              Search tools..
              <span className="inline-block drop-shadow-[0_0_4px_rgba(255,50,70,0.9)] drop-shadow-[0_0_10px_rgba(255,50,70,0.55)]">
                ❤️
              </span>
            </kbd>
          </button>

          {/* Ephemeral Privacy Badge */}
          {/* Mobile All Tools Button */}
          <button
            onClick={onOpenAllTools}
            className="md:hidden p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/[0.05]"
            title="Open All Tools"
          >
            <Grid className="w-4 h-4 text-[#00AB80]" />
          </button>
        </div>
      </div>
    </header>
  );
};
