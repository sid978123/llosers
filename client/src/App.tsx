import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ToolRunner } from "./components/ToolRunner";
import { AllToolsModal } from "./components/AllToolsModal";
import { Footer } from "./components/Footer";
import {
  TOOLS_REGISTRY,
  getToolByRoute,
  type ToolDefinition,
  type ToolCategory,
} from "./registry/tools";

export function App() {
  const [currentTool, setCurrentTool] = useState<ToolDefinition | null>(null);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState<boolean>(false);
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<
    ToolCategory | "all"
  >("all");

  // Handle URL route synchronization
  useEffect(() => {
    const handleLocation = () => {
      const pathname = window.location.pathname;
      if (pathname && pathname !== "/") {
        const found = getToolByRoute(pathname);
        if (found) {
          setCurrentTool(found);
          document.title = `${found.name} — Lloserr PDF & Image Suite`;
          return;
        }
      }
      setCurrentTool(null);
      document.title = "Lloserr — Modern PDF & Image Utility Platform";
    };

    handleLocation();
    window.addEventListener("popstate", handleLocation);
    return () => window.removeEventListener("popstate", handleLocation);
  }, []);

  // Global Ctrl+K / Cmd+K shortcut to open All Tools
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAllToolsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectTool = (tool: ToolDefinition) => {
    setCurrentTool(tool);
    window.history.pushState(null, "", tool.route);
    document.title = `${tool.name} — Lloserr PDF & Image Suite`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setCurrentTool(null);
    setHomeCategoryFilter("all");
    window.history.pushState(null, "", "/");
    document.title = "Lloserr — Modern PDF & Image Utility Platform";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateCategory = (category: ToolCategory) => {
    setCurrentTool(null);
    setHomeCategoryFilter(category);
    window.history.pushState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#171717] text-[#F8FAFC] selection:bg-[#00AB80]/25 selection:text-[#E6FFFA] font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenAllTools={() => setIsAllToolsOpen(true)}
        onSelectTool={handleSelectTool}
        onNavigateHome={handleNavigateHome}
        onNavigateCategory={handleNavigateCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTool ? (
          <ToolRunner tool={currentTool} onBack={handleNavigateHome} />
        ) : (
          <HomePage
            key={homeCategoryFilter}
            onSelectTool={handleSelectTool}
            onOpenAllTools={() => setIsAllToolsOpen(true)}
            initialCategoryFilter={homeCategoryFilter}
          />
        )}
      </main>

      {/* Central Discovery Menu (All Tools Modal) */}
      <AllToolsModal
        isOpen={isAllToolsOpen}
        onClose={() => setIsAllToolsOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onOpenAllTools={() => setIsAllToolsOpen(true)}
        onNavigateHome={handleNavigateHome}
      />
    </div>
  );
}

export default App;
