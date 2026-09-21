import React from 'react';
import {
  ChevronRight,
  Shield,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { ToolRunner } from './ToolRunner';
import { TOOL_SEO_DATA } from '../utils/seo';
import {
  TOOLS_REGISTRY,
  type ToolDefinition,
  type ToolCategory,
} from '../registry/tools';

interface ToolPageProps {
  tool: ToolDefinition;
  onBack: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
  onNavigateCategory: (category: ToolCategory) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({
  tool,
  onBack,
  onSelectTool,
  onNavigateCategory,
}) => {
  const seo = TOOL_SEO_DATA[tool.id];
  const isPdf = tool.category === 'pdf';
  const categoryLabel = isPdf ? 'PDF Tools' : 'Image Tools';
  const categoryRoute = isPdf ? '/pdf-tools' : '/image-tools';

  // Get related tools from same category
  const relatedTools = TOOLS_REGISTRY.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-4xl mx-auto px-4 sm:px-6 pt-6"
      >
        <ol className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          </li>
          <li>
            <a
              href={categoryRoute}
              onClick={(e) => {
                e.preventDefault();
                onNavigateCategory(tool.category);
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              {categoryLabel}
            </a>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          </li>
          <li className="text-[var(--accent)] font-semibold truncate">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* Main Interactive Tool Workspace */}
      <ToolRunner tool={tool} onBack={onBack} />

      {/* SEO Content Container */}
      {seo && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          {/* How It Works (3 Steps) */}
          <div className="p-6 sm:p-8 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simple 3-Step Process</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                How to Use {tool.name} Online
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {seo.howTo.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2 relative"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)]">
                    {idx + 1}
                  </div>
                  <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Advantages / Security */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Complete Data Privacy Guarantee
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {tool.processingMethod === 'client'
                  ? 'Processed 100% inside your browser memory using WebAssembly & JavaScript. Your files never leave your device.'
                  : 'Executed in isolated ephemeral memory buffers. Zero permanent storage, zero database logs, and buffers are wiped immediately.'}
              </p>
            </div>

            <div className="p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Zero Fees & No Limits
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Free forever with no email registrations, subscriptions, or watermarks. Built for engineers and professionals who prioritize speed.
              </p>
            </div>
          </div>

          {/* Features Checklist */}
          {seo.features && seo.features.length > 0 && (
            <div className="p-6 sm:p-7 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                {tool.name} Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
                {seo.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Frequently Asked Questions (FAQ) */}
          {seo.faqs && seo.faqs.length > 0 && (
            <div className="p-6 sm:p-8 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-5">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {seo.faqs.map((faq, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Tools Crawlable Graph */}
          {relatedTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
                  Related {categoryLabel}
                </h2>
                <a
                  href={categoryRoute}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateCategory(tool.category);
                  }}
                  className="text-xs text-[var(--accent)] hover:underline flex items-center space-x-1"
                >
                  <span>View all {categoryLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {relatedTools.map((relTool) => {
                  const RelIcon = relTool.icon;
                  return (
                    <a
                      key={relTool.id}
                      href={relTool.route}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectTool(relTool);
                      }}
                      className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all group flex flex-col justify-between shadow-sm cursor-pointer"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] mb-2.5 transition-colors">
                          <RelIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                          {relTool.name}
                        </h3>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {relTool.description}
                        </p>
                      </div>
                      <div className="mt-3 text-[10px] font-mono text-[var(--accent)] flex items-center space-x-1">
                        <span>Open tool</span>
                        <span>→</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
