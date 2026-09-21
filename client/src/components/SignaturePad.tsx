import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Type, Pen } from 'lucide-react';

interface SignaturePadProps {
  onSignatureCapture: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureCapture }) => {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [color, setColor] = useState('#0f172a');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [color]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      onSignatureCapture(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleTypeChange = (text: string) => {
    setTypedName(text);
    if (!text.trim()) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `italic 42px ${selectedFont}, "Brush Script MT", cursive`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 200, 80);

    onSignatureCapture(canvas.toDataURL('image/png'));
  };

  return (
    <div className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-4 transition-colors duration-200">
      {/* Tabs: Draw vs Type */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'draw'
                ? 'bg-[var(--surface-hover)] border border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                : 'bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            <span>Draw Signature</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'type'
                ? 'bg-[var(--surface-hover)] border border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                : 'bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type Signature</span>
          </button>
        </div>

        {/* Color Switcher */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setColor('#0f172a')}
            className={`w-5 h-5 rounded-full bg-slate-900 border-2 transition-all cursor-pointer ${
              color === '#0f172a' ? 'border-[var(--accent)] scale-110' : 'border-transparent'
            }`}
            title="Black Ink"
          />
          <button
            type="button"
            onClick={() => setColor('#1e40af')}
            className={`w-5 h-5 rounded-full bg-blue-800 border-2 transition-all cursor-pointer ${
              color === '#1e40af' ? 'border-[var(--accent)] scale-110' : 'border-transparent'
            }`}
            title="Blue Ink"
          />
        </div>
      </div>

      {mode === 'draw' ? (
        <div>
          <div className="relative border border-[var(--border)] rounded-xl bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={480}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 cursor-crosshair touch-none"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                Draw your signature here with mouse or touch...
              </div>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-red-500 px-2 py-1 rounded hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clear signature</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={typedName}
            onChange={(e) => handleTypeChange(e.target.value)}
            placeholder="Type your full name..."
            className="w-full px-3.5 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          {typedName && (
            <div className="p-4 bg-white rounded-xl text-center border border-[var(--border)] shadow-inner">
              <p
                style={{
                  fontFamily: 'cursive, "Brush Script MT"',
                  color: color,
                  fontSize: '36px',
                  fontStyle: 'italic'
                }}
              >
                {typedName}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
