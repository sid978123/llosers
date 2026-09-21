import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ToolPage } from "./components/ToolPage";
import { AllToolsModal } from "./components/AllToolsModal";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import {
  getToolByRoute,
  type ToolDefinition,
  type ToolCategory,
} from "./registry/tools";
import {
  HOME_SEO_DATA,
  CATEGORY_SEO_DATA,
  TOOL_SEO_DATA,
  updateSeoMetadata,
  generateHomeJsonLd,
  generateCategoryJsonLd,
  generateToolJsonLd,
} from "./utils/seo";
import { trackPageView } from "./utils/analytics";

function AppContent() {
  const [currentTool, setCurrentTool] = useState<ToolDefinition | null>(null);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState<boolean>(false);
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<
    ToolCategory | "all"
  >("all");
  const isFirstLoad = useRef(true);

  // Handle URL route synchronization (initial load and browser back/forward)
  useEffect(() => {
    const handleLocation = () => {
      const pathname = window.location.pathname;
      const origin = window.location.origin;

      if (pathname === "/pdf-tools") {
        setCurrentTool(null);
        setHomeCategoryFilter("pdf");
        updateSeoMetadata({
          ...CATEGORY_SEO_DATA.pdf,
          jsonLd: generateCategoryJsonLd("pdf", origin),
        });
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
        } else {
          trackPageView("/pdf-tools", CATEGORY_SEO_DATA.pdf.title);
        }
        return;
      }

      if (pathname === "/image-tools") {
        setCurrentTool(null);
        setHomeCategoryFilter("image");
        updateSeoMetadata({
          ...CATEGORY_SEO_DATA.image,
          jsonLd: generateCategoryJsonLd("image", origin),
        });
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
        } else {
          trackPageView("/image-tools", CATEGORY_SEO_DATA.image.title);
        }
        return;
      }

      if (pathname && pathname !== "/") {
        const found = getToolByRoute(pathname);
        if (found) {
          setCurrentTool(found);
          const seo = TOOL_SEO_DATA[found.id];
          const pageTitle = seo ? seo.title : `${found.name} — LosersPdf`;
          if (seo) {
            updateSeoMetadata({
              title: seo.title,
              description: seo.description,
              keywords: seo.keywords,
              canonical: found.route,
              jsonLd: generateToolJsonLd(found, seo, origin),
            });
          }
          if (isFirstLoad.current) {
            isFirstLoad.current = false;
          } else {
            trackPageView(found.route, pageTitle);
          }
          return;
        }
      }

      setCurrentTool(null);
      setHomeCategoryFilter("all");
      updateSeoMetadata({
        ...HOME_SEO_DATA,
        jsonLd: generateHomeJsonLd(origin),
      });
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      } else {
        trackPageView("/", HOME_SEO_DATA.title);
      }
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
    const seo = TOOL_SEO_DATA[tool.id];
    const pageTitle = seo ? seo.title : `${tool.name} — LosersPdf`;
    if (seo) {
      updateSeoMetadata({
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        canonical: tool.route,
        jsonLd: generateToolJsonLd(tool, seo, window.location.origin),
      });
    }
    trackPageView(tool.route, pageTitle);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setCurrentTool(null);
    setHomeCategoryFilter("all");
    window.history.pushState(null, "", "/");
    updateSeoMetadata({
      ...HOME_SEO_DATA,
      jsonLd: generateHomeJsonLd(window.location.origin),
    });
    trackPageView("/", HOME_SEO_DATA.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateCategory = (category: ToolCategory) => {
    setCurrentTool(null);
    setHomeCategoryFilter(category);
    const targetRoute = category === "pdf" ? "/pdf-tools" : "/image-tools";
    window.history.pushState(null, "", targetRoute);
    const seo = CATEGORY_SEO_DATA[category];
    updateSeoMetadata({
      ...seo,
      jsonLd: generateCategoryJsonLd(category, window.location.origin),
    });
    trackPageView(targetRoute, seo.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] selection:bg-[#00AB80]/25 selection:text-[#008765] font-sans antialiased transition-colors duration-200 flex flex-col">
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
          <ToolPage
            tool={currentTool}
            onBack={handleNavigateHome}
            onSelectTool={handleSelectTool}
            onNavigateCategory={handleNavigateCategory}
          />
        ) : (
          <HomePage
            key={homeCategoryFilter}
            onSelectTool={handleSelectTool}
            onOpenAllTools={() => setIsAllToolsOpen(true)}
            initialCategoryFilter={homeCategoryFilter}
            onNavigateCategory={handleNavigateCategory}
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

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
