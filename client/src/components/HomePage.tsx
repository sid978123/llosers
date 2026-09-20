import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
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

interface HomePageProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenAllTools: () => void;
  initialCategoryFilter?: ToolCategory | "all";
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onOpenAllTools,
  initialCategoryFilter = "all",
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
  }, []);

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
      overflow-hidden
      rounded-2xl sm:rounded-3xl
      border border-white/[0.08]
      bg-[#0D0D0D]
      min-h-[560px] lg:min-h-[620px]
    "
        >
          {/* Subtle background atmosphere */}
          <div
            className="
        absolute inset-0
        bg-[radial-gradient(circle_at_20%_50%,rgba(0,171,128,0.07),transparent_35%)]
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
            bg-white/[0.045]
            border border-white/[0.08]
            text-[10px] sm:text-[11px]
            font-mono
            tracking-wide
            text-[#94A3B8]
            mb-6
          "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AB80]" />

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
            text-[#F8FAFC]
            max-w-[680px]
          "
              >
                Everything you need
                <br />
                to work with <span className="text-[#00AB80]">PDFs.</span>
              </h1>

              {/* Description */}
              <p
                className="
            mt-6
            text-base
            sm:text-lg
            leading-relaxed
            text-[#94A3B8]
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
              text-[#64748B]
              group-focus-within:text-[#00AB80]
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

              bg-[#171717]
              hover:bg-[#1A1A1A]
              focus:bg-[#181818]

              border
              border-white/[0.10]
              focus:border-[#00AB80]/50

              text-[#F8FAFC]
              placeholder:text-[#64748B]

              text-sm
              sm:text-base

              outline-none

              focus:ring-4
              focus:ring-[#00AB80]/[0.07]

              transition-all

              shadow-[0_15px_40px_rgba(0,0,0,0.25)]
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

                bg-white/[0.06]
                hover:bg-white/[0.12]

                text-[10px]
                font-mono
                text-[#94A3B8]
                hover:text-white

                transition-all
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

                border border-white/[0.08]
                bg-white/[0.035]

                text-[10px]
                font-mono
                text-[#64748B]
              "
                  >
                    ⌘K
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
              text-[#64748B]
            "
                >
                  Popular:
                </span>

                {popularTools.slice(0, 5).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    className="
                px-3
                py-1.5

                rounded-full

                bg-white/[0.045]
                hover:bg-white/[0.09]

                border border-white/[0.07]
                hover:border-white/[0.14]

                text-xs
                text-[#94A3B8]
                hover:text-white

                transition-all
                cursor-pointer
              "
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            {/* =========================================================
          RIGHT VISUAL AREA
      ========================================================= */}
            {/* =========================================================
    PREMIUM HOVER CARD STACK
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
              {/* =====================================================
      FRONT CARD
  ===================================================== */}
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

      border border-white/[0.10]

      shadow-[0_30px_80px_rgba(0,0,0,0.45)]

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
      group-hover/front:shadow-[0_45px_100px_rgba(0,0,0,0.65)]

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
          text-white/65
          mb-2
        "
                  >
                    {heroSlides[heroSlide].label}
                  </div>

                  <h2
                    className="
          text-2xl
          sm:text-3xl
          font-semibold
          tracking-[-0.03em]
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
          text-white/65
          max-w-[320px]
        "
                  >
                    {heroSlides[heroSlide].description}
                  </p>

                  <button
                    className="
          mt-4
          text-sm
          text-white
          hover:text-[#00AB80]
          transition-colors
        "
                  >
                    Explore →
                  </button>
                </div>
              </div>

              {/* =====================================================
      BACK CARD
  ===================================================== */}
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

      border border-white/[0.08]

      shadow-[0_20px_60px_rgba(0,0,0,0.35)]

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
      group-hover/back:shadow-[0_45px_100px_rgba(0,0,0,0.65)]

      [transform-style:preserve-3d]
    "
              >
                <img
                  src={heroSlides[(heroSlide + 1) % heroSlides.length].image}
                  alt=""
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
          tracking-[0.18em]
          text-white/60
          mb-2
        "
                  >
                    PDF CONVERSION
                  </div>

                  <h3
                    className="
          text-xl
          sm:text-2xl
          font-semibold
          tracking-[-0.025em]
          text-white
        "
                  >
                    Convert Documents
                  </h3>

                  <p
                    className="
          mt-2
          text-xs
          sm:text-sm
          leading-relaxed
          text-white/60
        "
                  >
                    Turn your files into the format you need.
                  </p>

                  <button
                    className="
          mt-4
          text-sm
          text-white
          hover:text-[#00AB80]
          transition-colors
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#172030] pb-4 mb-8">
          <div className="flex items-center p-1 bg-[#0D121A] border border-[#1C2536] rounded-xl">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#151D29] text-[#EDEDEE] shadow-sm border border-[#2B384E]"
                  : "text-[#94A3B8] hover:text-[#EDEDEE] hover:bg-[#111827]"
              }`}
            >
              All Tools{" "}
              <span className="ml-1 text-[10px] font-mono text-[#64748B]">
                ({totalCount})
              </span>
            </button>

            <button
              onClick={() => setActiveCategory("pdf")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === "pdf"
                  ? "bg-[#151D29] text-[#EDEDEE] shadow-sm border border-[#2B384E]"
                  : "text-[#94A3B8] hover:text-[#EDEDEE] hover:bg-[#111827]"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>PDF Tools</span>
              <span className="text-[10px] font-mono text-[#64748B]">
                ({pdfCount})
              </span>
            </button>

            <button
              onClick={() => setActiveCategory("image")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === "image"
                  ? "bg-[#151D29] text-[#EDEDEE] shadow-sm border border-[#2B384E]"
                  : "text-[#94A3B8] hover:text-[#EDEDEE] hover:bg-[#111827]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Image Tools</span>
              <span className="text-[10px] font-mono text-[#64748B]">
                ({imageCount})
              </span>
            </button>
          </div>

          <button
            onClick={onOpenAllTools}
            className="flex items-center space-x-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Open All Tools Directory</span>
          </button>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isPdf = tool.category === "pdf";

            return (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className="tool-card group text-left p-5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    {/* Quiet Icon Container */}
                    <div className="w-9 h-9 rounded-lg bg-[#0D121A] border border-[#1C2536] group-hover:border-[#2B384E] flex items-center justify-center text-[#94A3B8] group-hover:text-[#0EA5E9] transition-colors duration-150">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {tool.badge && (
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded border ${
                            tool.badge === "Popular"
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                              : "bg-[#0EA5E9]/10 text-[#38BDF8] border-[#0EA5E9]/20"
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#0D121A] text-[#64748B] border border-[#1C2536]">
                        {tool.processingMethod === "client"
                          ? "In-Browser"
                          : "Server"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[#EDEDEE] group-hover:text-[#38BDF8] transition-colors flex items-center justify-between">
                    <span>{tool.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0EA5E9] transition-colors" />
                  </h3>

                  <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#172030] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#64748B] text-[10px]">
                    {tool.acceptedFormats.join(", ")}
                  </span>
                  <span className="font-mono text-[#94A3B8] group-hover:text-[#0EA5E9] font-medium text-[10px] uppercase transition-colors">
                    → {tool.outputFormat}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Value Proposition / Guarantee Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-xl bg-[#0D121A] border border-[#1C2536] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1C2536] flex items-center justify-center text-[#0EA5E9]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#EDEDEE]">
              No Database • 100% Ephemeral
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Files are never indexed, stored, or permanently retained.
              Temporary conversion buffers are strictly cleared immediately
              following processing.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0D121A] border border-[#1C2536] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1C2536] flex items-center justify-center text-[#14B8A6]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#EDEDEE]">
              Client-First Performance
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Merge, organize, compress, crop, rotate, and sign directly inside
              your web browser without network roundtrip lag or upload
              bottlenecks.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0D121A] border border-[#1C2536] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1C2536] flex items-center justify-center text-[#38BDF8]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#EDEDEE]">
              Genuine Standard Outputs
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              No placeholder mockups or fake extensions. Every utility compiles
              authentic, ISO-standardized PDF and Office documents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
