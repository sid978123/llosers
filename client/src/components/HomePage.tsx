import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Zap,
  Shield,
  Layers,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  TOOLS_REGISTRY,
  searchTools,
  getTotalToolsCount,
  getPdfToolsCount,
  getImageToolsCount,
  getPopularTools,
  type ToolDefinition,
  type ToolCategory,
} from "../registry/tools";
import heroBackground from "../assets/hero-night-runner.png";
import roboGirlPdf from "../assets/robo-girl-pdf.png";

interface HomePageProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenAllTools: () => void;
  initialCategoryFilter?: ToolCategory | "all";
  onNavigateCategory?: (category: ToolCategory) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onOpenAllTools,
  initialCategoryFilter = "all",
  onNavigateCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(
    initialCategoryFilter,
  );
  const totalCount = getTotalToolsCount();
  const pdfCount = getPdfToolsCount();
  const imageCount = getImageToolsCount();
  const popularTools = getPopularTools();

  // Dynamically filter tools strictly from central registry
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    {
      image: heroBackground,
      label: "PDF CONVERSION",
      title: "Convert Documents",
      description: "Transform your files into the format you need.",
    },
    {
      image: heroBackground,
      label: "PDF PRODUCTIVITY",
      title: "Work With PDFs",
      description: "Compress, merge, split and manage your documents.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const filteredTools = useMemo(() => {
    let list = searchQuery ? searchTools(searchQuery) : TOOLS_REGISTRY;

    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }

    return list;
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Hero Section */}
      <section className="w-full pt-4 sm:pt-6">
        <div
          className="
            relative
            mx-3 sm:mx-6 md:mx-[38px]
            overflow-auto
            rounded-2xl sm:rounded-3xl
            border border-[var(--border)]
            bg-[var(--hero-card-bg)]
            shadow-[var(--card-shadow)]
            min-h-[560px] lg:min-h-[620px]
            transition-colors duration-200
          "
        >
          {/* Subtle background atmosphere */}
          <div
            className="
              absolute inset-0
              bg-[var(--hero-glow)]
              pointer-events-none
            "
          />

          {/* Main Hero Layout */}
          <div
            className="
              relative z-10
              min-h-[560px] lg:min-h-[620px]
              grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]
              gap-8 lg:gap-10
              items-center
              px-5 sm:px-8 md:px-12 lg:px-14
              py-12 sm:py-14 lg:py-16
            "
          >
            {/* =========================================================
                LEFT CONTENT
            ========================================================= */}
            <div className="relative z-20 max-w-[650px]">
              {/* Status Tag */}
              <div
                className="
                  inline-flex items-center gap-2
                  px-3.5 py-1.5
                  rounded-full
                  bg-[var(--surface)]
                  border border-[var(--border)]
                  text-[10px] sm:text-[11px]
                  font-mono
                  tracking-1.00px
                  text-[var(--text-secondary)]
                  mb-6
                  shadow-sm
                "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span>{totalCount} Real Productivity Tools</span>
              </div>

              {/* Main Heading */}
              <h1
                className="
                  text-[42px]
                  sm:text-[52px]
                  lg:text-[60px]
                  xl:text-[66px]
                  font-bold
                  tracking-[-0.045em]
                  leading-[0.98]
                  text-[var(--text-primary)]
                  max-w-[680px]
                "
              >
                Everything you need
                <br />
                to work with <span className="text-[var(--accent)]">PDFs.</span>
              </h1>

              {/* Description */}
              <p
                className="
                  mt-6
                  text-base
                  sm:text-lg
                  leading-relaxed
                  text-[var(--text-secondary)]
                  max-w-[590px]
                "
              >
                Convert, compress, merge and manage your files with simple tools
                built for speed and privacy.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-[620px] relative group">
                <Search
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    w-5 h-5
                    text-[var(--text-muted)]
                    group-focus-within:text-[var(--accent)]
                    transition-colors
                    z-10
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search all ${totalCount} tools...`}
                  className="
                    w-full
                    h-[58px]
                    pl-14
                    pr-20
                    rounded-2xl
                    bg-[var(--surface)]
                    hover:bg-[var(--surface-hover)]
                    focus:bg-[var(--surface)]
                    border
                    border-[var(--border)]
                    focus:border-[var(--accent)]
                    text-[var(--text-primary)]
                    placeholder:text-[var(--text-muted)]
                    text-sm
                    sm:text-base
                    outline-none
                    focus:ring-4
                    focus:ring-[var(--accent)]/10
                    transition-all
                    shadow-[var(--card-shadow)]
                    focus:shadow-[var(--card-shadow-hover)]
                  "
                />

                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      px-2.5
                      py-1
                      rounded-lg
                      bg-[var(--surface-subtle)]
                      hover:bg-[var(--surface-hover)]
                      border
                      border-[var(--border)]
                      text-[10px]
                      font-mono
                      text-[var(--text-secondary)]
                      hover:text-[var(--text-primary)]
                      transition-all
                      cursor-pointer
                    "
                  >
                    CLEAR
                  </button>
                ) : (
                  <div
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      hidden sm:flex
                      items-center
                      px-2
                      py-1
                      rounded-md
                      border border-[var(--border)]
                      bg-[var(--surface-subtle)]
                      text-[10px]
                      font-mono
                      text-[var(--text-muted)]
                    "
                  >
                    <span
                      className="
                        inline-block
                        cursor-pointer
                        transition-all duration-500
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        drop-shadow-[0_0_10px_rgba(255,50,70,0.9)]
                        hover:scale-110
                        hover:rotate-[12deg]
                        hover:-translate-y-[1px]
                      "
                    >
                      ❤️
                    </span>
                  </div>
                )}
              </div>

              {/* Popular Tools */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    mr-1
                    text-[11px]
                    font-mono
                    text-[var(--text-muted)]
                  "
                >
                  Popular:
                </span>

                {popularTools.slice(0, 5).map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.route}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectTool(tool);
                    }}
                    className="
                      px-3
                      py-1.5
                      rounded-full
                      bg-[var(--surface)]
                      hover:bg-[var(--surface-hover)]
                      border border-[var(--border)]
                      hover:border-[var(--border-hover)]
                      text-xs
                      text-[var(--text-secondary)]
                      hover:text-[var(--text-primary)]
                      transition-all
                      cursor-pointer
                      shadow-sm
                    "
                  >
                    {tool.name}
                  </a>
                ))}
              </div>
            </div>

            {/* =========================================================
                RIGHT VISUAL AREA (Cinematic Hero Card Stack)
            ========================================================= */}
            <div
              className="
                hidden
                lg:flex
                group/cards 
                relative 
                w-full 
                h-[420px] 
                sm:h-[460px] 
                lg:h-[500px] 
                items-center 
                justify-center 
                [perspective:1400px] 
              "
            >
              {/* FRONT CARD */}
              <div
                className="
                  group/front
                  absolute
                  left-[5%]
                  top-0
                  w-[58%]
                  h-full
                  rounded-[28px]
                  overflow-hidden
                  border border-white/[0.12]
                  shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]
                  z-20
                  transform-gpu
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/cards:translate-x-[-2%]
                  group-hover/cards:scale-[0.97]
                  group-hover/front:!z-40
                  group-hover/front:!translate-x-[-2%]
                  group-hover/front:!translate-y-[-8px]
                  group-hover/front:!scale-[1.025]
                  group-hover/front:!rotate-y-[-2deg]
                  group-hover/front:shadow-[0_45px_100px_rgba(0,0,0,0.55)]
                  [transform-style:preserve-3d]
                "
              >
                <img
                  src={heroSlides[heroSlide].image}
                  alt=""
                  className="
                    absolute inset-0
                    w-full h-full
                    object-cover
                    transform-gpu
                    transition-transform
                    duration-1000
                    ease-out
                    group-hover/front:scale-[1.04]
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/95
                    via-black/30
                    to-black/5
                    transition-opacity
                    duration-700
                    group-hover/front:from-black/90
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    left-6
                    right-6
                    bottom-6
                    sm:left-7
                    sm:right-7
                    sm:bottom-7
                  "
                >
                  <div
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-mono
                      tracking-[0.2em]
                      text-white/70
                      mb-2
                    "
                  >
                    {heroSlides[heroSlide].label}
                  </div>

                  <h2
                    className="
                      text-[17px]
                      sm:text-[24px]
                      font-semibold
                      tracking-[0.50rem]
                      leading-tight
                      text-white
                    "
                  >
                    {heroSlides[heroSlide].title}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-relaxed
                      text-white/70
                      max-w-[320px]
                    "
                  >
                    {heroSlides[heroSlide].description}
                  </p>

                  <button
                    onClick={() => onOpenAllTools()}
                    className="
                      mt-4
                      text-sm
                      font-medium
                      text-white
                      hover:text-[var(--accent)]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    Explore →
                  </button>
                </div>
              </div>

              {/* BACK CARD */}
              <div
                className="
                  group/back
                  absolute
                  right-0
                  top-8
                  w-[43%]
                  h-[calc(100%-64px)]
                  rounded-[28px]
                  overflow-hidden
                  border border-white/[0.10]
                  shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                  dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  z-10
                  transform-gpu
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/cards:translate-x-[2%]
                  group-hover/back:z-40!
                  group-hover/back:!translate-x-[4%]
                  group-hover/back:!translate-y-[-8px]
                  group-hover/back:scale-[1.025]!
                  group-hover/back:!rotate-y-[2deg]
                  group-hover/back:shadow-[0_45px_100px_rgba(0,0,0,0.55)]
                  [transform-style:preserve-3d]
                "
              >
                <img
                  src={roboGirlPdf}
                  alt="Productivity documents workspace illustration"
                  className="
                    absolute inset-0
                    w-full h-full
                    object-cover
                    transform-gpu
                    transition-transform
                    duration-1000
                    ease-out
                    group-hover/back:scale-[1.05]
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/95
                    via-black/35
                    to-black/10
                    transition-all
                    duration-700
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    left-5
                    right-5
                    bottom-6
                    sm:left-6
                    sm:right-6
                    sm:bottom-7
                  "
                >
                  <div
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-mono
                      tracking-[0.50rem]
                      text-white/65
                      mb-2
                    "
                  >
                    PDF CONVERSION
                  </div>

                  <h3
                    className="
                      text-[18px]
                      sm:text-[20px]
                      font-semibold
                      tracking-[0.50rem]
                      leading-tight
                      text-white
                    "
                  >
                    Convert Effortlessly.
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      sm:text-sm
                      leading-relaxed
                      text-white/70
                    "
                  >
                    Turn your files into the format you need.
                  </p>

                  <button
                    onClick={() => onOpenAllTools()}
                    className="
                      mt-4
                      text-sm
                      font-medium
                      text-white
                      hover:text-[var(--accent)]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tools Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Selector Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border)] pb-4 mb-8">
          <div className="flex items-center p-1 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl">
            <button
              onClick={() => {
                setActiveCategory("all");
                window.history.pushState(null, "", "/");
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-hover)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              All Tools{" "}
              <span className="ml-1 text-[10px] font-mono text-[var(--text-muted)]">
                ({totalCount})
              </span>
            </button>

            <button
              onClick={() => {
                setActiveCategory("pdf");
                if (onNavigateCategory) {
                  onNavigateCategory("pdf");
                } else {
                  window.history.pushState(null, "", "/pdf-tools");
                }
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === "pdf"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-hover)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>PDF Tools</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                ({pdfCount})
              </span>
            </button>

            <button
              onClick={() => {
                setActiveCategory("image");
                if (onNavigateCategory) {
                  onNavigateCategory("image");
                } else {
                  window.history.pushState(null, "", "/image-tools");
                }
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === "image"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-hover)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Image Tools</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                ({imageCount})
              </span>
            </button>
          </div>

          <button
            onClick={onOpenAllTools}
            className="flex items-center space-x-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Open All Tools Directory</span>
          </button>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <a
                key={tool.id}
                href={tool.route}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTool(tool);
                }}
                className="tool-card group text-left p-5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    {/* Quiet Icon Container */}
                    <div className="w-9 h-9 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-150">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {tool.badge && (
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded border ${
                            tool.badge === "Popular"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)]"
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--border)]">
                        {tool.processingMethod === "client"
                          ? "In-Browser"
                          : "Server"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                    <span>{tool.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[var(--text-muted)] text-[10px]">
                    {tool.acceptedFormats.join(", ")}
                  </span>
                  <span className="font-mono text-[var(--text-secondary)] group-hover:text-[var(--accent)] font-medium text-[10px] uppercase transition-colors">
                    → {tool.outputFormat}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Value Proposition / Guarantee Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              No Database • 100% Ephemeral
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Files are never indexed, stored, or permanently retained.
              Temporary conversion buffers are strictly cleared immediately
              following processing.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Client-First Performance
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Merge, organize, compress, crop, rotate, and sign directly inside
              your web browser without network roundtrip lag or upload
              bottlenecks.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Genuine Standard Outputs
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              No placeholder mockups or fake extensions. Every utility compiles
              authentic, ISO-standardized PDF and Office documents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
