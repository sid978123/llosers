import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center h-8 px-2.5 rounded-lg text-xs font-medium bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 ${className}`}
      title={isDark ? "Switch to Light mode (Ctrl+Shift+D)" : "Switch to Dark mode (Ctrl+Shift+D)"}
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-pressed={isDark}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (shown in dark mode to switch to light) */}
        <Sun
          className={`w-3.5 h-3.5 text-amber-400 absolute transition-all duration-300 ease-out transform ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50 pointer-events-none"
          }`}
        />
        {/* Moon Icon (shown in light mode to switch to dark) */}
        <Moon
          className={`w-3.5 h-3.5 text-slate-700 absolute transition-all duration-300 ease-out transform ${
            !isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50 pointer-events-none"
          }`}
        />
      </div>

      {showLabel && (
        <span className="ml-2 font-mono text-[11px] capitalize tracking-wide select-none">
          {theme}
        </span>
      )}
    </button>
  );
};
