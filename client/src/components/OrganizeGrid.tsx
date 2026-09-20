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
      <div className="py-12 flex flex-col items-center justify-center space-y-3 glass-panel rounded-2xl border border-white/10">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm font-medium text-slate-300">
          Rendering PDF thumbnails...
        </p>
        {progress.total > 0 && (
          <p className="text-xs text-slate-400 font-mono">
            Page {progress.current} of {progress.total}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[#94A3B8] px-0.5">
        <span className="font-mono text-[11px]">{pages.length} Pages Loaded</span>
        {mode === 'remove' && (
          <span className="text-[#F87171] font-mono text-[11px]">Click pages to mark for deletion</span>
        )}
        {mode === 'extract' && (
          <span className="text-[#00AB80] font-mono text-[11px]">Click pages to include in extracted document</span>
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
              className={`relative group rounded-xl bg-[#0E131F] border overflow-hidden transition-all duration-150 cursor-pointer ${
                mode === 'remove'
                  ? isSelected
                    ? 'border-[#EF4444] ring-1 ring-[#EF4444]/40 bg-[#EF4444]/5'
                    : 'border-white/[0.08] hover:border-white/[0.16]'
                  : mode === 'extract'
                  ? isSelected
                    ? 'border-[#00AB80] ring-1 ring-[#00AB80]/40 bg-[#00AB80]/5'
                    : 'border-white/[0.08] opacity-40 hover:opacity-75'
                  : 'border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              {/* Page Number Badge */}
              <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-[#0A0D14]/90 border border-white/[0.08] text-[10px] font-mono text-[#94A3B8]">
                #{page.pageNumber}
              </div>

              {/* Selection Checkmark / Cross Badge */}
              {(mode === 'remove' || mode === 'extract') && (
                <div className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                  mode === 'remove'
                    ? isSelected ? 'bg-[#EF4444] text-white' : 'bg-[#111622] border border-white/[0.08] text-[#64748B]'
                    : isSelected ? 'bg-[#00AB80] text-white' : 'bg-[#111622] border border-white/[0.08] text-[#64748B]'
                }`}>
                  {isSelected ? <Check className="w-3 h-3" /> : null}
                </div>
              )}

              {/* Thumbnail Image */}
              <div className="p-3 flex items-center justify-center min-h-[150px] bg-[#0A0D14]/50">
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
                  className="p-1.5 bg-[#0A0D14] border-t border-white/[0.08] flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLeft(idx)}
                      className="p-1 text-[#94A3B8] hover:text-white disabled:opacity-25 rounded hover:bg-white/[0.05] cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === pages.length - 1}
                      onClick={() => handleMoveRight(idx)}
                      className="p-1 text-[#94A3B8] hover:text-white disabled:opacity-25 rounded hover:bg-white/[0.05] cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleRotate(idx)}
                      className="p-1 text-[#94A3B8] hover:text-[#00AB80] rounded hover:bg-white/[0.05] cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    {mode === 'organize' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="p-1 text-[#94A3B8] hover:text-[#EF4444] rounded hover:bg-white/[0.05] cursor-pointer"
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
