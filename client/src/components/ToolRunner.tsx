import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  RotateCw,
  Eye,
  Settings,
  Sparkles,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  FileCheck
} from 'lucide-react';
import type { ToolDefinition } from '../registry/tools';
import { FileUploader } from './FileUploader';
import { SignaturePad } from './SignaturePad';
import { OrganizeGrid } from './OrganizeGrid';
import { ImageCropEditor } from './ImageCropEditor';
import { PdfEditor } from './PdfEditor';
import {
  mergePdfs,
  splitPdf,
  removePdfPages,
  extractPdfPages,
  organizePdfPages,
  rotatePdf,
  addPageNumbers,
  watermarkPdf,
  signPdf,
  imagesToPdf,
  applyEditsToPdf,
  type EditAnnotation
} from '../utils/pdfEngine';
import {
  compressImage,
  resizeImage,
  cropImage,
  rotateAndFlipImage,
  convertJpgToPng,
  convertPngToJpg,
  type CropArea
} from '../utils/imageEngine';
import { convertPdfToImages } from '../utils/pdfRenderer';
import { executeServerTool } from '../utils/apiClient';
import { saveBlobToFile, createAndSaveZip, formatBytes } from '../utils/downloadHelper';

interface ToolRunnerProps {
  tool: ToolDefinition;
  onBack: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({ tool, onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    blob?: Blob;
    filename?: string;
    zipFiles?: { filename: string; blob: Blob }[];
    url?: string;
    originalSize?: number;
    newSize?: number;
    savingsPct?: number;
  } | null>(null);

  // Tool Specific States:
  // Split
  const [splitMode, setSplitMode] = useState<'all' | 'custom'>('all');
  const [splitRanges, setSplitRanges] = useState('1-2, 3');

  // Remove / Extract Pages
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageInputText, setPageInputText] = useState('2, 4');

  // Organize Pages
  const [organization, setOrganization] = useState<{ originalIndex: number; rotation: number }[]>([]);

  // Rotate PDF
  const [rotatePdfAngle, setRotatePdfAngle] = useState(90);

  // Page Numbers
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pageNumberFormat, setPageNumberFormat] = useState<'page-x-of-y' | 'number-only' | 'page-x'>('page-x-of-y');
  const [pageNumberFontSize, setPageNumberFontSize] = useState(10);

  // Watermark
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkColor, setWatermarkColor] = useState('#ef4444');
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);

  // Passwords (Protect / Unlock)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sign PDF
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
  const [signPageNum, setSignPageNum] = useState<number>(1);

  // Edit PDF
  const [pdfEdits, setPdfEdits] = useState<EditAnnotation[]>([]);

  // Image to PDF / JPG to PDF / PNG to PDF
  const [imgPdfOrientation, setImgPdfOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [imgPdfMargin, setImgPdfMargin] = useState(20);

  // PDF to Image / JPG / PNG
  const [pdfImgFormat, setPdfImgFormat] = useState<'jpg' | 'png'>('jpg');
  const [pdfImgScale, setPdfImgScale] = useState(1.5);

  // Compress Image
  const [compressQuality, setCompressQuality] = useState(75);

  // Resize Image
  const [resizeWidth, setResizeWidth] = useState<number>(1200);
  const [resizeHeight, setResizeHeight] = useState<number>(800);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1.5);

  // Crop Image
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });

  // Rotate Image
  const [rotateImgAngle, setRotateImgAngle] = useState(90);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // PNG to JPG
  const [pngToJpgBgColor, setPngToJpgBgColor] = useState('#ffffff');
  const [pngToJpgQuality, setPngToJpgQuality] = useState(92);

  // Reset states when tool changes
  useEffect(() => {
    setFiles([]);
    setProcessing(false);
    setError(null);
    setResult(null);
    setPassword('');
    setConfirmPassword('');
    setSignatureDataUrl('');
  }, [tool.id]);

  // Load image dimensions when single image selected for resize
  useEffect(() => {
    if (tool.id === 'resize-image' && files.length === 1) {
      const img = new Image();
      const url = URL.createObjectURL(files[0]);
      img.onload = () => {
        setResizeWidth(img.naturalWidth);
        setResizeHeight(img.naturalHeight);
        setImageAspectRatio(img.naturalWidth / img.naturalHeight);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [tool.id, files]);

  // Main Processing Handler
  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    setProgressText('Processing your document...');

    try {
      const file = files[0];
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      // -------------------------------------------------------
      // 1. MERGE PDF
      // -------------------------------------------------------
      if (tool.id === 'merge-pdf') {
        setProgressText(`Merging ${files.length} PDF files...`);
        const bytes = await mergePdfs(files);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `merged_${Date.now()}.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 2. SPLIT PDF
      // -------------------------------------------------------
      else if (tool.id === 'split-pdf') {
        setProgressText('Splitting document pages...');
        const parts = await splitPdf(file, splitMode === 'all' ? undefined : splitRanges);
        if (parts.length === 1) {
          const blob = new Blob([parts[0].data as any], { type: 'application/pdf' });
          setResult({
            blob,
            filename: parts[0].filename,
            newSize: blob.size
          });
        } else {
          const zipFiles = parts.map(p => ({
            filename: p.filename,
            blob: new Blob([p.data as any], { type: 'application/pdf' })
          }));
          setResult({
            zipFiles,
            filename: `${baseName}_split_pages.zip`
          });
        }
      }

      // -------------------------------------------------------
      // 3. REMOVE PDF PAGES
      // -------------------------------------------------------
      else if (tool.id === 'remove-pdf-pages') {
        setProgressText('Removing selected pages...');
        let toRemove = selectedPages;
        if (toRemove.length === 0 && pageInputText.trim()) {
          toRemove = pageInputText.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        }
        if (toRemove.length === 0) throw new Error('Please select at least one page to remove.');
        const bytes = await removePdfPages(file, toRemove);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_cleaned.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 4. EXTRACT PDF PAGES
      // -------------------------------------------------------
      else if (tool.id === 'extract-pdf-pages') {
        setProgressText('Extracting chosen pages...');
        let toExtract = selectedPages;
        if (toExtract.length === 0 && pageInputText.trim()) {
          toExtract = pageInputText.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        }
        if (toExtract.length === 0) throw new Error('Please select at least one page to extract.');
        const bytes = await extractPdfPages(file, toExtract);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_extracted.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 5. ORGANIZE PDF PAGES
      // -------------------------------------------------------
      else if (tool.id === 'organize-pdf-pages') {
        setProgressText('Building reorganized PDF...');
        const bytes = await organizePdfPages(file, organization);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_organized.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 6. ROTATE PDF
      // -------------------------------------------------------
      else if (tool.id === 'rotate-pdf') {
        setProgressText('Rotating PDF document...');
        const bytes = await rotatePdf(file, rotatePdfAngle);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_rotated_${rotatePdfAngle}deg.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 7. JPG TO PDF, 8. PNG TO PDF, 28. IMAGE TO PDF
      // -------------------------------------------------------
      else if (tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf' || tool.id === 'image-to-pdf') {
        setProgressText(`Converting ${files.length} images to PDF...`);
        const bytes = await imagesToPdf(files, {
          orientation: imgPdfOrientation,
          margin: imgPdfMargin,
          pageSize: 'A4'
        });
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_images.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 9. PDF TO JPG, 10. PDF TO PNG, 29. PDF TO IMAGE
      // -------------------------------------------------------
      else if (tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png' || tool.id === 'pdf-to-image') {
        const fmt = tool.id === 'pdf-to-png' ? 'png' : tool.id === 'pdf-to-jpg' ? 'jpg' : pdfImgFormat;
        setProgressText(`Rendering PDF pages to high-res ${fmt.toUpperCase()} images...`);
        const imgs = await convertPdfToImages(file, fmt, pdfImgScale, (curr, tot) => {
          setProgressText(`Rendering page ${curr} of ${tot}...`);
        });

        if (imgs.length === 1) {
          setResult({
            blob: imgs[0].blob,
            filename: imgs[0].filename,
            newSize: imgs[0].blob.size
          });
        } else {
          setResult({
            zipFiles: imgs.map(i => ({ filename: i.filename, blob: i.blob })),
            filename: `${baseName}_${fmt}_pages.zip`
          });
        }
      }

      // -------------------------------------------------------
      // 11. WORD TO PDF (.docx -> .pdf)
      // -------------------------------------------------------
      else if (tool.id === 'word-to-pdf') {
        setProgressText('Converting Word formatting to standard PDF...');
        const { blob, filename } = await executeServerTool('/api/word-to-pdf', file);
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 12. EXCEL TO PDF (.xlsx -> .pdf)
      // -------------------------------------------------------
      else if (tool.id === 'excel-to-pdf') {
        setProgressText('Rendering spreadsheet sheets to landscape PDF...');
        const { blob, filename } = await executeServerTool('/api/excel-to-pdf', file);
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 13. POWERPOINT TO PDF (.pptx -> .pdf)
      // -------------------------------------------------------
      else if (tool.id === 'powerpoint-to-pdf') {
        setProgressText('Converting presentation slides to PDF...');
        const { blob, filename } = await executeServerTool('/api/powerpoint-to-pdf', file);
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 14. PDF TO WORD (.pdf -> .docx)
      // -------------------------------------------------------
      else if (tool.id === 'pdf-to-word') {
        setProgressText('Extracting structure and generating Word (.docx)...');
        const { blob, filename } = await executeServerTool('/api/pdf-to-word', file);
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 15. PDF TO POWERPOINT (.pdf -> .pptx)
      // -------------------------------------------------------
      else if (tool.id === 'pdf-to-powerpoint') {
        setProgressText('Extracting pages to PowerPoint (.pptx) slides...');
        const { blob, filename } = await executeServerTool('/api/pdf-to-powerpoint', file);
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 16. EDIT PDF
      // -------------------------------------------------------
      else if (tool.id === 'edit-pdf') {
        setProgressText('Burning text and annotations into PDF pages...');
        const bytes = await applyEditsToPdf(file, pdfEdits);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_edited.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 17. ADD PAGE NUMBERS
      // -------------------------------------------------------
      else if (tool.id === 'add-page-numbers') {
        setProgressText('Stamping page numbers onto all pages...');
        const bytes = await addPageNumbers(file, {
          position: pageNumberPos,
          format: pageNumberFormat,
          fontSize: pageNumberFontSize,
          startNumber: 1,
          margin: 24
        });
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_numbered.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 18. WATERMARK PDF
      // -------------------------------------------------------
      else if (tool.id === 'watermark-pdf') {
        setProgressText('Applying watermark stamp across pages...');
        const bytes = await watermarkPdf(file, {
          text: watermarkText,
          fontSize: watermarkFontSize,
          opacity: watermarkOpacity,
          angle: watermarkAngle,
          color: watermarkColor
        });
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_watermarked.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 19. PROTECT PDF
      // -------------------------------------------------------
      else if (tool.id === 'protect-pdf') {
        if (!password) throw new Error('Please enter a password to protect the document.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        setProgressText('Encrypting PDF with AES-256...');
        const { blob, filename } = await executeServerTool('/api/protect-pdf', file, { password });
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 20. UNLOCK PDF
      // -------------------------------------------------------
      else if (tool.id === 'unlock-pdf') {
        if (!password) throw new Error('Please enter the current password to unlock.');
        setProgressText('Decrypting and removing password restrictions...');
        const { blob, filename } = await executeServerTool('/api/unlock-pdf', file, { password });
        setResult({ blob, filename, newSize: blob.size });
      }

      // -------------------------------------------------------
      // 21. SIGN PDF
      // -------------------------------------------------------
      else if (tool.id === 'sign-pdf') {
        if (!signatureDataUrl) throw new Error('Please draw or type your signature before applying.');
        setProgressText(`Applying digital signature to page ${signPageNum}...`);
        const bytes = await signPdf(file, {
          pageNumber: signPageNum,
          signatureDataUrl: signatureDataUrl,
          xRatio: 0.55,
          yRatio: 0.75,
          widthRatio: 0.35,
          heightRatio: 0.12
        });
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setResult({
          blob,
          filename: `${baseName}_signed.pdf`,
          newSize: blob.size
        });
      }

      // -------------------------------------------------------
      // 22. COMPRESS IMAGE
      // -------------------------------------------------------
      else if (tool.id === 'compress-image') {
        setProgressText('Compressing image data...');
        const comp = await compressImage(file, compressQuality / 100);
        setResult({
          blob: comp.blob,
          url: comp.url,
          filename: `${baseName}_compressed.jpg`,
          originalSize: comp.originalSize,
          newSize: comp.newSize,
          savingsPct: comp.savingsPct
        });
      }

      // -------------------------------------------------------
      // 23. RESIZE IMAGE
      // -------------------------------------------------------
      else if (tool.id === 'resize-image') {
        setProgressText('Rescaling image pixels...');
        const res = await resizeImage(file, resizeWidth, resizeHeight);
        setResult({
          blob: res.blob,
          url: res.url,
          filename: `${baseName}_resized_${resizeWidth}x${resizeHeight}.jpg`,
          newSize: res.blob.size
        });
      }

      // -------------------------------------------------------
      // 24. CROP IMAGE
      // -------------------------------------------------------
      else if (tool.id === 'crop-image') {
        setProgressText('Cropping selected region...');
        const crp = await cropImage(file, cropArea);
        setResult({
          blob: crp.blob,
          url: crp.url,
          filename: `${baseName}_cropped.png`,
          newSize: crp.blob.size
        });
      }

      // -------------------------------------------------------
      // 25. ROTATE IMAGE
      // -------------------------------------------------------
      else if (tool.id === 'rotate-image') {
        setProgressText('Applying rotation and flips...');
        const rot = await rotateAndFlipImage(file, rotateImgAngle, flipH, flipV);
        setResult({
          blob: rot.blob,
          url: rot.url,
          filename: `${baseName}_rotated.jpg`,
          newSize: rot.blob.size
        });
      }

      // -------------------------------------------------------
      // 26. JPG TO PNG
      // -------------------------------------------------------
      else if (tool.id === 'jpg-to-png') {
        setProgressText('Converting JPEG to lossless PNG...');
        const png = await convertJpgToPng(file);
        setResult({
          blob: png.blob,
          url: png.url,
          filename: `${baseName}.png`,
          newSize: png.blob.size
        });
      }

      // -------------------------------------------------------
      // 27. PNG TO JPG
      // -------------------------------------------------------
      else if (tool.id === 'png-to-jpg') {
        setProgressText('Flattening background and exporting JPEG...');
        const jpg = await convertPngToJpg(file, pngToJpgQuality / 100, pngToJpgBgColor);
        setResult({
          blob: jpg.blob,
          url: jpg.url,
          filename: `${baseName}.jpg`,
          newSize: jpg.blob.size
        });
      }

    } catch (err: any) {
      console.error(`Error executing ${tool.name}:`, err);
      setError(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    if (result.blob && result.filename) {
      saveBlobToFile(result.blob, result.filename);
    } else if (result.zipFiles && result.filename) {
      createAndSaveZip(result.zipFiles, result.filename);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  const Icon = tool.icon;
  const isPdf = tool.category === 'pdf';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3.5">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all tools</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-7 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] transition-colors duration-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                  {tool.name}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface-subtle)] border border-[var(--border)] rounded-md">
                  {tool.subcategoryLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
                {tool.detailedDescription}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-[var(--text-secondary)] space-y-2 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[10px] font-mono">{tool.processingMethod === 'client' ? 'In-Browser (Private)' : 'Ephemeral Server'}</span>
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              Output: .{tool.outputFormat}
            </span>
          </div>
        </div>
      </div>

      {/* Main Execution Container */}
      {!result ? (
        <div className="space-y-6">
          {/* File Upload Zone */}
          <FileUploader
            acceptedFormats={tool.acceptedFormats}
            multiple={tool.multipleFiles}
            files={files}
            onFilesChange={setFiles}
            title={tool.multipleFiles ? `Upload files to ${tool.name}` : `Select a ${tool.acceptedFormats.join('/')} file`}
          />

          {/* Contextual Tool Options / Interactive Config Panels */}
          {files.length > 0 && (
            <div className="p-6 sm:p-7 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] space-y-6 animate-in fade-in duration-150 transition-colors duration-200">
              <div className="flex items-center space-x-2 border-b border-[var(--border)] pb-3.5">
                <Settings className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                  Tool Settings & Preview
                </h3>
              </div>

              {/* 1. SPLIT PDF CONTROLS */}
              {tool.id === 'split-pdf' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSplitMode('all')}
                      className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                        splitMode === 'all'
                          ? 'bg-[var(--surface-hover)] border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                          : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      Extract all pages into separate files (ZIP)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode('custom')}
                      className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                        splitMode === 'custom'
                          ? 'bg-[var(--surface-hover)] border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                          : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      Split by page ranges
                    </button>
                  </div>
                  {splitMode === 'custom' && (
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">
                        Page Ranges (e.g. "1-3, 4, 5-8"):
                      </label>
                      <input
                        type="text"
                        value={splitRanges}
                        onChange={(e) => setSplitRanges(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15"
                        placeholder="1-2, 3-5"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 2. REMOVE PDF PAGES / EXTRACT PDF PAGES GRID */}
              {(tool.id === 'remove-pdf-pages' || tool.id === 'extract-pdf-pages') && (
                <div className="space-y-4">
                  <OrganizeGrid
                    file={files[0]}
                    mode={tool.id === 'remove-pdf-pages' ? 'remove' : 'extract'}
                    onSelectionChange={setSelectedPages}
                  />
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">
                      Or type comma-separated page numbers:
                    </label>
                    <input
                      type="text"
                      value={pageInputText}
                      onChange={(e) => setPageInputText(e.target.value)}
                      placeholder="e.g. 1, 3, 5"
                      className="w-full px-3.5 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </div>
              )}

              {/* 3. ORGANIZE PDF PAGES GRID */}
              {tool.id === 'organize-pdf-pages' && (
                <OrganizeGrid
                  file={files[0]}
                  mode="organize"
                  onOrganizationChange={setOrganization}
                />
              )}

              {/* 4. ROTATE PDF CONTROLS */}
              {tool.id === 'rotate-pdf' && (
                <div className="space-y-3">
                  <label className="text-xs text-[var(--text-secondary)] block font-medium">Rotate All Pages By:</label>
                  <div className="flex flex-wrap gap-2">
                    {[90, 180, 270].map(deg => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotatePdfAngle(deg)}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          rotatePdfAngle === deg
                            ? 'bg-[var(--surface-hover)] border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                            : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>{deg}° Clockwise</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ADD PAGE NUMBERS */}
              {tool.id === 'add-page-numbers' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Position</label>
                    <select
                      value={pageNumberPos}
                      onChange={(e) => setPageNumberPos(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-xs focus:border-[var(--accent)] focus:outline-none"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Format</label>
                    <select
                      value={pageNumberFormat}
                      onChange={(e) => setPageNumberFormat(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-xs focus:border-[var(--accent)] focus:outline-none"
                    >
                      <option value="page-x-of-y">Page X of Y</option>
                      <option value="number-only">Page Number Only (X)</option>
                      <option value="page-x">Page X</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Font Size ({pageNumberFontSize}pt)</label>
                    <input
                      type="range"
                      min={8}
                      max={18}
                      value={pageNumberFontSize}
                      onChange={(e) => setPageNumberFontSize(parseInt(e.target.value, 10))}
                      className="w-full accent-[#00AB80] mt-2"
                    />
                  </div>
                </div>
              )}

              {/* 6. WATERMARK PDF */}
              {tool.id === 'watermark-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs focus:border-[var(--accent)] focus:outline-none"
                      placeholder="CONFIDENTIAL"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Angle ({watermarkAngle}°)</label>
                    <select
                      value={watermarkAngle}
                      onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-xs focus:border-[var(--accent)] focus:outline-none"
                    >
                      <option value={45}>45° Diagonal</option>
                      <option value={0}>0° Horizontal</option>
                      <option value={-45}>-45° Reverse Diagonal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Opacity ({Math.round(watermarkOpacity * 100)}%)</label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={Math.round(watermarkOpacity * 100)}
                      onChange={(e) => setWatermarkOpacity(parseInt(e.target.value, 10) / 100)}
                      className="w-full accent-[#00AB80] mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-[var(--text-secondary)]">{watermarkColor}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. PROTECT PDF */}
              {tool.id === 'protect-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Set Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter strong password..."
                      className="w-full px-3.5 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password..."
                      className="w-full px-3.5 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </div>
              )}

              {/* 8. UNLOCK PDF */}
              {tool.id === 'unlock-pdf' && (
                <div className="max-w-md">
                  <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">PDF Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter existing password to decrypt..."
                    className="w-full px-3.5 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15"
                  />
                </div>
              )}

              {/* 9. SIGN PDF */}
              {tool.id === 'sign-pdf' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-medium">Page to sign:</span>
                    <input
                      type="number"
                      min={1}
                      value={signPageNum}
                      onChange={(e) => setSignPageNum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-20 px-2 py-1 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] font-mono focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>
                  <SignaturePad onSignatureCapture={setSignatureDataUrl} />
                </div>
              )}

              {/* 10. EDIT PDF */}
              {tool.id === 'edit-pdf' && (
                <PdfEditor file={files[0]} onEditsChange={setPdfEdits} />
              )}

              {/* 11. COMPRESS IMAGE */}
              {tool.id === 'compress-image' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)] font-medium">
                    <span>Compression Quality: {compressQuality}%</span>
                    <span className="text-[var(--accent)] font-semibold">Estimated savings: ~{100 - compressQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={95}
                    value={compressQuality}
                    onChange={(e) => setCompressQuality(parseInt(e.target.value, 10))}
                    className="w-full accent-[#00AB80]"
                  />
                  <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                    <span>Smaller File Size (10%)</span>
                    <span>High Quality (95%)</span>
                  </div>
                </div>
              )}

              {/* 12. RESIZE IMAGE */}
              {tool.id === 'resize-image' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Width (px)</label>
                      <input
                        type="number"
                        value={resizeWidth}
                        onChange={(e) => {
                          const w = parseInt(e.target.value, 10) || 0;
                          setResizeWidth(w);
                          if (maintainAspectRatio && imageAspectRatio > 0) {
                            setResizeHeight(Math.round(w / imageAspectRatio));
                          }
                        }}
                        className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] font-mono text-sm focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Height (px)</label>
                      <input
                        type="number"
                        value={resizeHeight}
                        onChange={(e) => {
                          const h = parseInt(e.target.value, 10) || 0;
                          setResizeHeight(h);
                          if (maintainAspectRatio && imageAspectRatio > 0) {
                            setResizeWidth(Math.round(h * imageAspectRatio));
                          }
                        }}
                        className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] font-mono text-sm focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ratio-check"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="rounded border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--accent)] focus:ring-[var(--accent)] accent-[#00AB80]"
                    />
                    <label htmlFor="ratio-check" className="text-xs text-[var(--text-secondary)] cursor-pointer select-none">
                      Lock aspect ratio
                    </label>
                  </div>
                </div>
              )}

              {/* 13. CROP IMAGE */}
              {tool.id === 'crop-image' && (
                <ImageCropEditor file={files[0]} onCropChange={setCropArea} />
              )}

              {/* 14. ROTATE IMAGE */}
              {tool.id === 'rotate-image' && (
                <div className="space-y-3">
                  <label className="text-xs text-[var(--text-secondary)] block font-medium">Orientation & Mirror:</label>
                  <div className="flex flex-wrap gap-2">
                    {[90, 180, 270].map(deg => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotateImgAngle(deg)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          rotateImgAngle === deg
                            ? 'bg-[var(--surface-hover)] border-[var(--accent)]/50 text-[var(--accent)] shadow-sm'
                            : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        Rotate {deg}°
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFlipH(!flipH)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        flipH ? 'bg-[var(--surface-hover)] border-[var(--accent)]/50 text-[var(--accent)] shadow-sm' : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      Flip Horizontal
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipV(!flipV)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        flipV ? 'bg-[var(--surface-hover)] border-[var(--accent)]/50 text-[var(--accent)] shadow-sm' : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      Flip Vertical
                    </button>
                  </div>
                </div>
              )}

              {/* 15. PNG TO JPG */}
              {tool.id === 'png-to-jpg' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Quality ({pngToJpgQuality}%)</label>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={pngToJpgQuality}
                      onChange={(e) => setPngToJpgQuality(parseInt(e.target.value, 10))}
                      className="w-full accent-[#00AB80] mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1 font-medium">Background Fill for Transparency</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={pngToJpgBgColor}
                        onChange={(e) => setPngToJpgBgColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-[var(--text-secondary)]">{pngToJpgBgColor}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors cursor-pointer shadow-sm"
                >
                  Clear & Choose other file
                </button>

                <button
                  type="button"
                  disabled={processing}
                  onClick={handleProcess}
                  className="flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{progressText || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <Icon className="w-4 h-4" />
                      <span>Process & Convert Document</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300">Operation failed</p>
                <p className="mt-0.5 text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Result / Success View */
        <div className="p-8 sm:p-12 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)] text-center space-y-6 animate-in zoom-in-95 duration-150 transition-colors duration-200">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center mx-auto text-[var(--accent)]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Ready for Download
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Your file has been processed in memory and is ready for immediate retrieval.
            </p>
          </div>

          {/* File summary badge */}
          <div className="inline-flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 px-5 py-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] shadow-sm">
            <span className="font-medium text-[var(--text-primary)] truncate max-w-xs">
              {result.filename}
            </span>
            {result.newSize && (
              <span>Size: {formatBytes(result.newSize)}</span>
            )}
            {result.savingsPct !== undefined && result.savingsPct > 0 && (
              <span className="text-[var(--accent)] font-semibold">
                ({result.savingsPct}% reduction)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-md transition-all w-full sm:w-auto cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {result.filename?.endsWith('.zip') ? 'ZIP Archive' : 'File'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors w-full sm:w-auto cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Process Another Document</span>
            </button>
          </div>

          <p className="text-[10px] font-mono text-[var(--text-muted)] pt-2">
            🔒 Ephemeral Guarantee: Buffer memory freed immediately following download.
          </p>
        </div>
      )}

    </div>
  );
};
