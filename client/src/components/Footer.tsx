import React from "react";
import { Layers, ShieldCheck } from "lucide-react";
import {
  getTotalToolsCount,
  getPdfToolsCount,
  getImageToolsCount,
  getToolsByCategory,
  type ToolDefinition,
} from "../registry/tools";

interface FooterProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenAllTools: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTool,
  onOpenAllTools,
  onNavigateHome,
}) => {
  const totalCount = getTotalToolsCount();
  const pdfTools = getToolsByCategory("pdf");
  const imageTools = getToolsByCategory("image");

  return (
    <footer className="border-t border-white/[0.08] bg-[#07090E] text-[#94A3B8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#111622] border border-white/[0.08] flex items-center justify-center text-[#00AB80] group-hover:border-[#00AB80]/40 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white tracking-tight leading-none">
                  llosers
                </span>
                <span className="text-[10px] text-[#64748B] tracking-wider uppercase font-mono mt-0.5">
                  Document Studio
                </span>
              </div>
            </button>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              Professional, minimalist PDF and image processing suite.
              Engineered with zero-knowledge ephemerality, strict privacy
              standards, and instant client-side execution.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-[#00AB80] shadow-[0_0_8px_rgba(0,171,128,0.4)]" />
              <span>Zero Retention Guarantee • Complete Ephemerality</span>
            </div>
          </div>

          {/* Popular PDF Tools Col */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-white">
              PDF Suite ({getPdfToolsCount()})
            </h4>
            <ul className="space-y-2 pt-1 text-xs">
              {pdfTools.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onSelectTool(tool)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
              <li className="pt-1.5">
                <button
                  onClick={onOpenAllTools}
                  className="text-[#00AB80] hover:text-[#00C997] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>View all PDF tools</span>
                  <span>→</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Image Tools Col */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-white">
              Image Suite ({getImageToolsCount()})
            </h4>
            <ul className="space-y-2 pt-1 text-xs">
              {imageTools.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onSelectTool(tool)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
              <li className="pt-1.5">
                <button
                  onClick={onOpenAllTools}
                  className="text-[#00AB80] hover:text-[#00C997] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>View all Image tools</span>
                  <span>→</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B] font-mono">
          <p>
            © {new Date().getFullYear()} llosers Document Studio. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Registry: {totalCount} Active Utilities</span>
            <span>•</span>
            <span>Client & Cloud In-Memory Compute</span>
            <span>•</span>
            <span>Zero Data Footprint</span>
          </div>
        </div>
      </div>

      {/* Ambient Bird Animation */}
      <div className="relative h-24 overflow-hidden border-t border-white/[0.04]">
        {/* Flight path */}
        <div
          className="
      absolute
      left-0
      right-0
      bottom-7
      h-px
      bg-gradient-to-r
      from-transparent
      via-white/[0.06]
      to-transparent
    "
        />

        {/* Bird */}
        <div className="footer-bird absolute bottom-8 left-[-40px]">
          <svg
            width="34"
            height="24"
            viewBox="0 0 34 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="footer-bird-svg"
          >
            {/* Body */}
            <path
              d="M7 13.5C8.5 9.5 12 7 17 7C21.5 7 25 9.5 27 13
           C24.5 12 22 12 20 13.5
           C18 15 14 16 10.5 15.5
           C9 15.3 7.8 14.6 7 13.5Z"
              fill="currentColor"
            />

            {/* Head */}
            <circle cx="23" cy="8" r="4" fill="currentColor" />

            {/* Beak */}
            <path d="M27 8L32 10L27 11Z" fill="currentColor" />

            {/* Wing */}
            <path
              className="footer-bird-wing"
              d="M15 10C12 5 13 2 17 1
           C18 5 18 8 16.5 11Z"
              fill="currentColor"
            />

            {/* Eye */}
            <circle cx="24.5" cy="7" r="0.7" fill="#070A0F" />
          </svg>
        </div>

        {/* Tiny particles */}
        <span className="footer-bird-particle particle-1" />
        <span className="footer-bird-particle particle-2" />
        <span className="footer-bird-particle particle-3" />
      </div>
    </footer>
  );
};
