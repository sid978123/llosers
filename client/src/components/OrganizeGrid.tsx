import React, { useEffect, useState } from 'react';
import { RotateCw, ArrowLeft, ArrowRight, Trash2, Check, Loader2 } from 'lucide-react';
import { renderAllPdfPages, type RenderedPage } from '../utils/pdfRenderer';

export interface PageItem {
  id: string;
  originalIndex: number; // 0-based
  pageNumber: number; // 1-based display
  dataUrl: string;
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
}

interface OrganizeGridProps {
  file: File;
  mode: 'organize' | 'remove' | 'extract' | 'rotate';
  onSelectionChange?: (selectedPages: number[]) => void;
  onOrganizationChange?: (items: { originalIndex: number; rotation: number }[]) => void;
}

export const OrganizeGrid: React.FC<OrganizeGridProps> = ({
  file,
  mode,
  onSelectionChange,
  onOrganizationChange
}) => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    let isMounted = true;

    async function loadPages() {
      setLoading(true);
      try {
        const rendered = await renderAllPdfPages(file, 0.45, (curr, tot) => {
          if (isMounted) setProgress({ current: curr, total: tot });
        });

        if (isMounted) {
          const items: PageItem[] = rendered.map((r, idx) => ({
            id: `page-${idx}`,
            originalIndex: idx,
            pageNumber: idx + 1,
            dataUrl: r.dataUrl,
            rotation: 0,
            selected: mode === 'remove' ? false : true
          }));
          setPages(items);
          if (onOrganizationChange) {
            onOrganizationChange(items.map(i => ({ originalIndex: i.originalIndex, rotation: i.rotation })));
          }
        }
      } catch (err) {
        console.error('Failed to render PDF thumbnails:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPages();
    return () => {
      isMounted = false;
    };
  }, [file]);

  const handleRotate = (index: number) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPages(updated);
    if (onOrganizationChange) {
      onOrganizationChange(updated.map(i => ({ originalIndex: i.originalIndex, rotation: i.rotation })));
    }
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...pages];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setPages(updated);
    if (onOrganizationChange) {
      onOrganizationChange(updated.map(i => ({ originalIndex: i.originalIndex, rotation: i.rotation })));
    }
  };

  const handleMoveRight = (index: number) => {
    if (index >= pages.length - 1) return;
    const updated = [...pages];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setPages(updated);
    if (onOrganizationChange) {
      onOrganizationChange(updated.map(i => ({ originalIndex: i.originalIndex, rotation: i.rotation })));
    }
  };

  const handleToggleSelect = (index: number) => {
    const updated = [...pages];
    updated[index].selected = !updated[index].selected;
    setPages(updated);

    if (onSelectionChange) {
      const selectedNums = updated.filter(p => p.selected).map(p => p.pageNumber);
      onSelectionChange(selectedNums);
    }
  };

  const handleDelete = (index: number) => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    if (onOrganizationChange) {
      onOrganizationChange(updated.map(i => ({ originalIndex: i.originalIndex, rotation: i.rotation })));
    }
    if (onSelectionChange) {
      onSelectionChange(updated.filter(p => p.selected).map(p => p.pageNumber));
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3 glass-panel rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          Rendering PDF thumbnails...
        </p>
        {progress.total > 0 && (
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Page {progress.current} of {progress.total}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-0.5">
        <span className="font-mono text-[11px]">{pages.length} Pages Loaded</span>
        {mode === 'remove' && (
          <span className="text-red-500 font-mono text-[11px]">Click pages to mark for deletion</span>
        )}
        {mode === 'extract' && (
          <span className="text-[var(--accent)] font-mono text-[11px]">Click pages to include in extracted document</span>
        )}
        {mode === 'organize' && (
          <span className="text-[11px]">Use arrows to reorder, or rotate / delete pages</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-0.5">
        {pages.map((page, idx) => {
          const isSelected = page.selected;
          return (
            <div
              key={page.id}
              onClick={() => (mode === 'remove' || mode === 'extract') && handleToggleSelect(idx)}
              className={`relative group rounded-xl bg-[var(--surface)] border overflow-hidden transition-all duration-150 cursor-pointer shadow-sm ${
                mode === 'remove'
                  ? isSelected
                    ? 'border-red-500 ring-1 ring-red-500/40 bg-red-500/5'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                  : mode === 'extract'
                  ? isSelected
                    ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/40 bg-[var(--accent-subtle)]'
                    : 'border-[var(--border)] opacity-40 hover:opacity-75'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              {/* Page Number Badge */}
              <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-[var(--surface)]/90 border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)] shadow-sm">
                #{page.pageNumber}
              </div>

              {/* Selection Checkmark / Cross Badge */}
              {(mode === 'remove' || mode === 'extract') && (
                <div className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                  mode === 'remove'
                    ? isSelected ? 'bg-red-500 text-white' : 'bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]'
                    : isSelected ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]'
                }`}>
                  {isSelected ? <Check className="w-3 h-3" /> : null}
                </div>
              )}

              {/* Thumbnail Image */}
              <div className="p-3 flex items-center justify-center min-h-[150px] bg-[var(--surface-subtle)]">
                <img
                  src={page.dataUrl}
                  alt={`Page ${page.pageNumber}`}
                  style={{
                    transform: `rotate(${page.rotation}deg)`,
                    transition: 'transform 0.2s ease-in-out'
                  }}
                  className="max-h-32 max-w-full rounded shadow-sm object-contain"
                />
              </div>

              {/* Controls bar for organize / rotate */}
              {(mode === 'organize' || mode === 'rotate') && (
                <div 
                  className="p-1.5 bg-[var(--surface-subtle)] border-t border-[var(--border)] flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLeft(idx)}
                      className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-25 rounded hover:bg-[var(--surface-hover)] cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === pages.length - 1}
                      onClick={() => handleMoveRight(idx)}
                      className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-25 rounded hover:bg-[var(--surface-hover)] cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleRotate(idx)}
                      className="p-1 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded hover:bg-[var(--surface-hover)] cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    {mode === 'organize' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="p-1 text-[var(--text-secondary)] hover:text-red-500 rounded hover:bg-[var(--surface-hover)] cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
