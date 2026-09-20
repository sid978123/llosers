import React, { useState, useEffect, useRef } from 'react';
import { Type, Highlighter, Square, Trash2, Plus, Loader2 } from 'lucide-react';
import { renderAllPdfPages, type RenderedPage } from '../utils/pdfRenderer';
import type { EditAnnotation } from '../utils/pdfEngine';

interface PdfEditorProps {
  file: File;
  onEditsChange: (edits: EditAnnotation[]) => void;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({ file, onEditsChange }) => {
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [toolMode, setToolMode] = useState<'text' | 'highlight' | 'rectangle'>('text');
  const [edits, setEdits] = useState<EditAnnotation[]>([]);

  // Text options
  const [textInput, setTextInput] = useState('Important Note');
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState('#ef4444');

  const pageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const rendered = await renderAllPdfPages(file, 0.85);
        if (active) setPages(rendered);
      } catch (err) {
        console.error('Failed to load PDF pages for editor:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [file]);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pageContainerRef.current) return;
    const rect = pageContainerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    let newEdit: EditAnnotation;

    if (toolMode === 'text') {
      newEdit = {
        type: 'text',
        pageIndex: selectedPageIndex,
        text: textInput,
        x: xPct,
        y: yPct,
        fontSize: fontSize,
        color: color
      };
    } else if (toolMode === 'highlight') {
      newEdit = {
        type: 'highlight',
        pageIndex: selectedPageIndex,
        x: xPct - 5,
        y: yPct - 2,
        width: 25,
        height: 4,
        color: '#fef08a'
      };
    } else {
      newEdit = {
        type: 'rectangle',
        pageIndex: selectedPageIndex,
        x: xPct - 5,
        y: yPct - 5,
        width: 20,
        height: 15,
        color: color,
        strokeWidth: 2
      };
    }

    const updated = [...edits, newEdit];
    setEdits(updated);
    onEditsChange(updated);
  };

  const handleRemoveEdit = (index: number) => {
    const updated = edits.filter((_, i) => i !== index);
    setEdits(updated);
    onEditsChange(updated);
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3 glass-panel rounded-2xl border border-white/10">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-300">Loading document pages into canvas editor...</p>
      </div>
    );
  }

  const currentPage = pages[selectedPageIndex];

  return (
    <div className="space-y-4">
      {/* Editor Toolbar */}
      <div className="p-3 bg-[#0E131F] rounded-xl border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setToolMode('text')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              toolMode === 'text' ? 'bg-[#161D2B] border border-[#00AB80]/50 text-[#00AB80]' : 'bg-[#111622] border border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Add Text</span>
          </button>
          <button
            type="button"
            onClick={() => setToolMode('highlight')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              toolMode === 'highlight' ? 'bg-[#161D2B] border border-[#00AB80]/50 text-[#00AB80]' : 'bg-[#111622] border border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Highlight</span>
          </button>
          <button
            type="button"
            onClick={() => setToolMode('rectangle')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              toolMode === 'rectangle' ? 'bg-[#161D2B] border border-[#00AB80]/50 text-[#00AB80]' : 'bg-[#111622] border border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>Box / Border</span>
          </button>
        </div>

        {toolMode === 'text' && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Text to stamp..."
              className="px-2.5 py-1 text-xs bg-[#111622] border border-white/[0.08] rounded-lg text-[#F8FAFC] w-36"
            />
            <div className="flex items-center space-x-1">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer"
                title="Text Color"
              />
              <span className="text-[11px] text-[#64748B] font-mono">{fontSize}pt</span>
            </div>
          </div>
        )}

        {/* Page Selector */}
        {pages.length > 1 && (
          <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
            <span className="text-[11px]">Page:</span>
            <select
              value={selectedPageIndex}
              onChange={(e) => setSelectedPageIndex(parseInt(e.target.value, 10))}
              className="bg-[#111622] text-[#F8FAFC] border border-white/[0.08] rounded-lg px-2 py-1 text-xs"
            >
              {pages.map((p, idx) => (
                <option key={idx} value={idx} className="bg-[#0A0D14] text-[#F8FAFC]">
                  Page {p.pageNumber} of {pages.length}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Interactive Page Canvas View */}
      <div className="relative flex justify-center bg-[#0A0D14] p-6 rounded-2xl border border-white/[0.08] overflow-auto min-h-[400px]">
        {currentPage && (
          <div
            ref={pageContainerRef}
            onClick={handlePageClick}
            className="relative shadow-2xl rounded cursor-crosshair inline-block select-none"
          >
            <img
              src={currentPage.dataUrl}
              alt={`Page ${currentPage.pageNumber}`}
              className="max-h-[600px] w-auto pointer-events-none rounded"
            />

            {/* Rendered Annotations for current page */}
            {edits
              .filter(e => e.pageIndex === selectedPageIndex)
              .map((edit, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${edit.x}%`,
                    top: `${edit.y}%`,
                    width: edit.width ? `${edit.width}%` : 'auto',
                    height: edit.height ? `${edit.height}%` : 'auto',
                    color: edit.color,
                    fontSize: edit.fontSize ? `${edit.fontSize}px` : '14px',
                    backgroundColor: edit.type === 'highlight' ? edit.color : 'transparent',
                    border: edit.type === 'rectangle' ? `2px solid ${edit.color}` : 'none',
                    opacity: edit.type === 'highlight' ? 0.45 : 1
                  }}
                  className="font-sans font-bold flex items-center group cursor-pointer"
                >
                  {edit.type === 'text' && <span>{edit.text}</span>}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveEdit(idx);
                    }}
                    className="ml-1 opacity-0 group-hover:opacity-100 p-0.5 bg-rose-600 text-white rounded text-[10px]"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        Click anywhere on the document page above to place your selected {toolMode}.
      </p>
    </div>
  );
};
