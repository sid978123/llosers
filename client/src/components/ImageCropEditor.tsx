import React, { useEffect, useRef, useState } from 'react';
import { Crop, Check, RefreshCw } from 'lucide-react';
import type { CropArea } from '../utils/imageEngine';

interface ImageCropEditorProps {
  file: File;
  onCropChange: (cropArea: CropArea) => void;
}

export const ImageCropEditor: React.FC<ImageCropEditorProps> = ({ file, onCropChange }) => {
  const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      // Default crop: center 80%
      const defaultCrop = {
        x: Math.round(img.naturalWidth * 0.1),
        y: Math.round(img.naturalHeight * 0.1),
        width: Math.round(img.naturalWidth * 0.8),
        height: Math.round(img.naturalHeight * 0.8)
      };
      setCrop(defaultCrop);
      onCropChange(defaultCrop);
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handlePresetChange = (preset: 'free' | '1:1' | '16:9' | '4:3') => {
    setAspectPreset(preset);
    if (!naturalSize.width || !naturalSize.height) return;

    let newWidth = naturalSize.width * 0.75;
    let newHeight = naturalSize.height * 0.75;

    if (preset === '1:1') {
      const minDim = Math.min(newWidth, newHeight);
      newWidth = minDim;
      newHeight = minDim;
    } else if (preset === '16:9') {
      newHeight = (newWidth * 9) / 16;
      if (newHeight > naturalSize.height) {
        newHeight = naturalSize.height * 0.75;
        newWidth = (newHeight * 16) / 9;
      }
    } else if (preset === '4:3') {
      newHeight = (newWidth * 3) / 4;
      if (newHeight > naturalSize.height) {
        newHeight = naturalSize.height * 0.75;
        newWidth = (newHeight * 4) / 3;
      }
    }

    const newCrop: CropArea = {
      x: Math.round((naturalSize.width - newWidth) / 2),
      y: Math.round((naturalSize.height - newHeight) / 2),
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    };

    setCrop(newCrop);
    onCropChange(newCrop);
  };

  const handleWidthChange = (val: number) => {
    const w = Math.min(naturalSize.width - crop.x, Math.max(20, val));
    let h = crop.height;
    if (aspectPreset === '1:1') h = w;
    else if (aspectPreset === '16:9') h = Math.round((w * 9) / 16);
    else if (aspectPreset === '4:3') h = Math.round((w * 3) / 4);

    const updated = { ...crop, width: w, height: Math.min(naturalSize.height - crop.y, h) };
    setCrop(updated);
    onCropChange(updated);
  };

  const handleHeightChange = (val: number) => {
    const h = Math.min(naturalSize.height - crop.y, Math.max(20, val));
    let w = crop.width;
    if (aspectPreset === '1:1') w = h;
    else if (aspectPreset === '16:9') w = Math.round((h * 16) / 9);
    else if (aspectPreset === '4:3') w = Math.round((h * 4) / 3);

    const updated = { ...crop, width: Math.min(naturalSize.width - crop.x, w), height: h };
    setCrop(updated);
    onCropChange(updated);
  };

  return (
    <div className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-4 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">Aspect:</span>
          {(['free', '1:1', '16:9', '4:3'] as const).map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetChange(preset)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                aspectPreset === preset
                  ? 'bg-[var(--surface-hover)] border border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                  : 'bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {preset === 'free' ? 'Freeform' : preset}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2.5 text-[11px] font-mono text-[var(--text-muted)]">
          <span>Crop: {Math.round(crop.width)} × {Math.round(crop.height)} px</span>
          <span>•</span>
          <span>Original: {naturalSize.width} × {naturalSize.height} px</span>
        </div>
      </div>

      {/* Preview Container */}
      <div 
        ref={containerRef}
        className="relative bg-[var(--surface-subtle)] rounded-xl overflow-hidden border border-[var(--border)] flex items-center justify-center p-4 min-h-[280px]"
      >
        {imageSrc && (
          <div className="relative max-w-full max-h-[360px] inline-block">
            <img
              src={imageSrc}
              alt="To Crop"
              className="max-h-[360px] max-w-full object-contain rounded"
            />
            
            {/* Visual Crop Overlay representation */}
            {naturalSize.width > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(crop.x / naturalSize.width) * 100}%`,
                  top: `${(crop.y / naturalSize.height) * 100}%`,
                  width: `${(crop.width / naturalSize.width) * 100}%`,
                  height: `${(crop.height / naturalSize.height) * 100}%`,
                  border: '2px solid #00AB80',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
                  pointerEvents: 'none'
                }}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
                  <div className="border-r border-b border-[#00AB80]" />
                  <div className="border-r border-b border-[#00AB80]" />
                  <div className="border-b border-[#00AB80]" />
                  <div className="border-r border-b border-[#00AB80]" />
                  <div className="border-r border-b border-[#00AB80]" />
                  <div className="border-b border-[#00AB80]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Coordinate Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-[var(--text-secondary)] block mb-1 font-medium">X Offset ({Math.round(crop.x)}px)</label>
          <input
            type="range"
            min={0}
            max={Math.max(0, naturalSize.width - crop.width)}
            value={crop.x}
            onChange={(e) => {
              const x = parseInt(e.target.value, 10);
              const u = { ...crop, x };
              setCrop(u);
              onCropChange(u);
            }}
            className="w-full accent-[#00AB80]"
          />
        </div>
        <div>
          <label className="text-[var(--text-secondary)] block mb-1 font-medium">Y Offset ({Math.round(crop.y)}px)</label>
          <input
            type="range"
            min={0}
            max={Math.max(0, naturalSize.height - crop.height)}
            value={crop.y}
            onChange={(e) => {
              const y = parseInt(e.target.value, 10);
              const u = { ...crop, y };
              setCrop(u);
              onCropChange(u);
            }}
            className="w-full accent-[#00AB80]"
          />
        </div>
        <div>
          <label className="text-[var(--text-secondary)] block mb-1 font-medium">Width ({Math.round(crop.width)}px)</label>
          <input
            type="range"
            min={20}
            max={naturalSize.width}
            value={crop.width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value, 10))}
            className="w-full accent-[#00AB80]"
          />
        </div>
        <div>
          <label className="text-[var(--text-secondary)] block mb-1 font-medium">Height ({Math.round(crop.height)}px)</label>
          <input
            type="range"
            min={20}
            max={naturalSize.height}
            value={crop.height}
            onChange={(e) => handleHeightChange(parseInt(e.target.value, 10))}
            className="w-full accent-[#00AB80]"
          />
        </div>
      </div>
    </div>
  );
};
