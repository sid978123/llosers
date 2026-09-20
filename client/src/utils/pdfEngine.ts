import {
  PDFDocument,
  rgb,
  degrees,
  StandardFonts
} from 'pdf-lib';

export interface PageOrganization {
  originalIndex: number; // 0-based
  rotation: number; // 0, 90, 180, 270
}

export interface EditAnnotation {
  type: 'text' | 'drawing' | 'highlight' | 'rectangle';
  pageIndex: number; // 0-based
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string; // hex
  fontSize?: number;
  points?: { x: number; y: number }[];
  strokeWidth?: number;
}

// Convert hex '#aabbcc' to pdf-lib rgb(0..1, 0..1, 0..1)
function hexToPdfRgb(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

// -------------------------------------------------------------
// 1. MERGE PDF
// -------------------------------------------------------------
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const fileBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

// -------------------------------------------------------------
// 2. SPLIT PDF
// -------------------------------------------------------------
export async function splitPdf(
  file: File,
  rangesStr?: string
): Promise<{ filename: string; data: Uint8Array }[]> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const totalPages = pdf.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, '');
  const results: { filename: string; data: Uint8Array }[] = [];

  if (!rangesStr || !rangesStr.trim()) {
    // Split into each individual page
    for (let i = 0; i < totalPages; i++) {
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(pdf, [i]);
      singleDoc.addPage(copiedPage);
      const data = await singleDoc.save();
      results.push({
        filename: `${baseName}_page_${i + 1}.pdf`,
        data
      });
    }
  } else {
    // Parse ranges: e.g. "1-3, 4, 5-8"
    const parts = rangesStr.split(',').map(s => s.trim()).filter(Boolean);
    let rangeIndex = 1;

    for (const part of parts) {
      const pageIndices: number[] = [];
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = Math.max(1, parseInt(startStr, 10));
        const end = Math.min(totalPages, parseInt(endStr, 10));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let p = start; p <= end; p++) {
            pageIndices.push(p - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
          pageIndices.push(p - 1);
        }
      }

      if (pageIndices.length > 0) {
        const partDoc = await PDFDocument.create();
        const copied = await partDoc.copyPages(pdf, pageIndices);
        copied.forEach(pg => partDoc.addPage(pg));
        const data = await partDoc.save();
        results.push({
          filename: `${baseName}_part_${rangeIndex}_pages_${part.replace(/\s+/g, '')}.pdf`,
          data
        });
        rangeIndex++;
      }
    }
  }

  if (results.length === 0) {
    throw new Error('No valid pages found for splitting. Check page numbers.');
  }

  return results;
}

// -------------------------------------------------------------
// 3. REMOVE PDF PAGES
// -------------------------------------------------------------
export async function removePdfPages(
  file: File,
  pagesToRemove: number[] // 1-based page numbers
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const totalPages = pdf.getPageCount();

  const toRemoveIndices = pagesToRemove
    .map(p => p - 1)
    .filter(p => p >= 0 && p < totalPages);

  if (toRemoveIndices.length >= totalPages) {
    throw new Error('Cannot remove all pages from the PDF document.');
  }

  // Remove pages in descending index order so subsequent indices stay valid
  const sortedIndices = [...new Set(toRemoveIndices)].sort((a, b) => b - a);
  for (const idx of sortedIndices) {
    pdf.removePage(idx);
  }

  return await pdf.save();
}

// -------------------------------------------------------------
// 4. EXTRACT PDF PAGES
// -------------------------------------------------------------
export async function extractPdfPages(
  file: File,
  pagesToExtract: number[] // 1-based page numbers
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const totalPages = pdf.getPageCount();

  const indicesToKeep = pagesToExtract
    .map(p => p - 1)
    .filter(p => p >= 0 && p < totalPages);

  if (indicesToKeep.length === 0) {
    throw new Error('No valid pages selected for extraction.');
  }

  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(pdf, indicesToKeep);
  copied.forEach(pg => newDoc.addPage(pg));

  return await newDoc.save();
}

// -------------------------------------------------------------
// 5. ORGANIZE PDF PAGES
// -------------------------------------------------------------
export async function organizePdfPages(
  file: File,
  organization: PageOrganization[] // items in desired order with rotations
): Promise<Uint8Array> {
  if (organization.length === 0) {
    throw new Error('Document must have at least one page.');
  }

  const fileBytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(fileBytes);
  const newPdf = await PDFDocument.create();

  for (const item of organization) {
    const [copiedPage] = await newPdf.copyPages(srcPdf, [item.originalIndex]);
    if (item.rotation) {
      const currentRot = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRot + item.rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
}

// -------------------------------------------------------------
// 6. ROTATE PDF
// -------------------------------------------------------------
export async function rotatePdf(
  file: File,
  angleDelta: number, // e.g. 90, 180, 270
  selectedPages?: number[] // 1-based, or all if undefined
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const pages = pdf.getPages();

  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (!selectedPages || selectedPages.includes(pageNum)) {
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + angleDelta) % 360));
    }
  });

  return await pdf.save();
}

// -------------------------------------------------------------
// 7. ADD PAGE NUMBERS
// -------------------------------------------------------------
export interface PageNumberOptions {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right';
  format: 'number-only' | 'page-x-of-y' | 'page-x';
  fontSize: number;
  startNumber: number;
  margin: number;
}

export async function addPageNumbers(
  file: File,
  options: PageNumberOptions = {
    position: 'bottom-center',
    format: 'page-x-of-y',
    fontSize: 10,
    startNumber: 1,
    margin: 25
  }
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const totalPages = pages.length;

  pages.forEach((page, idx) => {
    const currentNum = idx + options.startNumber;
    let label = `${currentNum}`;
    if (options.format === 'page-x-of-y') {
      label = `Page ${currentNum} of ${totalPages + options.startNumber - 1}`;
    } else if (options.format === 'page-x') {
      label = `Page ${currentNum}`;
    }

    const textWidth = font.widthOfTextAtSize(label, options.fontSize);
    const { width, height } = page.getSize();
    let x = width / 2 - textWidth / 2;
    let y = options.margin;

    if (options.position === 'bottom-right') {
      x = width - textWidth - options.margin;
    } else if (options.position === 'bottom-left') {
      x = options.margin;
    } else if (options.position === 'top-center') {
      y = height - options.margin;
    } else if (options.position === 'top-right') {
      x = width - textWidth - options.margin;
      y = height - options.margin;
    }

    page.drawText(label, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(0.3, 0.35, 0.4)
    });
  });

  return await pdf.save();
}

// -------------------------------------------------------------
// 8. WATERMARK PDF
// -------------------------------------------------------------
export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number; // 0..1
  angle: number; // e.g. 45 or 0
  color: string; // hex
}

export async function watermarkPdf(
  file: File,
  options: WatermarkOptions
): Promise<Uint8Array> {
  if (!options.text.trim()) {
    throw new Error('Watermark text cannot be empty.');
  }

  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();
  const drawColor = hexToPdfRgb(options.color);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
    const textHeight = font.heightAtSize(options.fontSize);

    // Center of page
    const centerX = width / 2;
    const centerY = height / 2;

    page.drawText(options.text, {
      x: centerX - (textWidth / 2) * Math.cos((options.angle * Math.PI) / 180),
      y: centerY - (textWidth / 2) * Math.sin((options.angle * Math.PI) / 180),
      size: options.fontSize,
      font,
      color: drawColor,
      opacity: options.opacity,
      rotate: degrees(options.angle)
    });
  });

  return await pdf.save();
}

// -------------------------------------------------------------
// 9. SIGN PDF
// -------------------------------------------------------------
export interface SignaturePlacement {
  pageNumber: number; // 1-based
  signatureDataUrl: string; // PNG base64
  xRatio: number; // 0..1 relative to page width
  yRatio: number; // 0..1 relative to page height
  widthRatio: number; // 0..1 relative to page width
  heightRatio: number;
}

export async function signPdf(
  file: File,
  placement: SignaturePlacement
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const pages = pdf.getPages();
  const targetIndex = placement.pageNumber - 1;

  if (targetIndex < 0 || targetIndex >= pages.length) {
    throw new Error(`Page ${placement.pageNumber} does not exist in the PDF.`);
  }

  const page = pages[targetIndex];
  const { width, height } = page.getSize();

  // Load signature image
  const signatureBytes = await fetch(placement.signatureDataUrl).then(res => res.arrayBuffer());
  const sigImage = await pdf.embedPng(signatureBytes);

  const sigWidth = placement.widthRatio * width;
  const sigHeight = placement.heightRatio * height;
  const sigX = placement.xRatio * width;
  // PDF coordinate system origin (0,0) is bottom-left
  const sigY = height - (placement.yRatio * height) - sigHeight;

  page.drawImage(sigImage, {
    x: sigX,
    y: Math.max(0, sigY),
    width: sigWidth,
    height: sigHeight
  });

  return await pdf.save();
}

// -------------------------------------------------------------
// 10. IMAGES TO PDF (JPG / PNG / WebP to PDF)
// -------------------------------------------------------------
export interface ImagesToPdfOptions {
  orientation: 'auto' | 'portrait' | 'landscape';
  margin: number; // points
  pageSize: 'A4' | 'fit';
}

export async function imagesToPdf(
  files: File[],
  options: ImagesToPdfOptions = { orientation: 'auto', margin: 20, pageSize: 'A4' }
): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error('Please select at least one image file.');
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    let img;
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    if (isPng) {
      img = await pdfDoc.embedPng(bytes);
    } else {
      // JPEG or WebP converted
      try {
        img = await pdfDoc.embedJpg(bytes);
      } catch {
        // If webp or non-standard jpg, convert via canvas to PNG bytes
        const blobUrl = URL.createObjectURL(file);
        const canvas = document.createElement('canvas');
        const imageObj = new Image();
        await new Promise((res, rej) => {
          imageObj.onload = () => res(null);
          imageObj.onerror = rej;
          imageObj.src = blobUrl;
        });
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(imageObj, 0, 0);
        URL.revokeObjectURL(blobUrl);

        const pngBlob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), 'image/png'));
        const pngBytes = await pngBlob.arrayBuffer();
        img = await pdfDoc.embedPng(pngBytes);
      }
    }

    const imgWidth = img.width;
    const imgHeight = img.height;

    if (options.pageSize === 'fit') {
      const page = pdfDoc.addPage([imgWidth + options.margin * 2, imgHeight + options.margin * 2]);
      page.drawImage(img, {
        x: options.margin,
        y: options.margin,
        width: imgWidth,
        height: imgHeight
      });
    } else {
      // Standard A4 is 595.28 x 841.89 points
      let pageW = 595.28;
      let pageH = 841.89;

      if (options.orientation === 'landscape' || (options.orientation === 'auto' && imgWidth > imgHeight)) {
        pageW = 841.89;
        pageH = 595.28;
      }

      const availableW = pageW - options.margin * 2;
      const availableH = pageH - options.margin * 2;
      const scale = Math.min(availableW / imgWidth, availableH / imgHeight, 1);

      const drawW = imgWidth * scale;
      const drawH = imgHeight * scale;
      const drawX = options.margin + (availableW - drawW) / 2;
      const drawY = options.margin + (availableH - drawH) / 2;

      const page = pdfDoc.addPage([pageW, pageH]);
      page.drawImage(img, {
        x: drawX,
        y: drawY,
        width: drawW,
        height: drawH
      });
    }
  }

  return await pdfDoc.save();
}

// -------------------------------------------------------------
// 11. EDIT PDF (Apply canvas drawings/text directly to PDF)
// -------------------------------------------------------------
export async function applyEditsToPdf(
  file: File,
  edits: EditAnnotation[]
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(fileBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  for (const edit of edits) {
    if (edit.pageIndex < 0 || edit.pageIndex >= pages.length) continue;
    const page = pages[edit.pageIndex];
    const { width, height } = page.getSize();
    const drawColor = hexToPdfRgb(edit.color || '#000000');

    if (edit.type === 'text' && edit.text) {
      const fontSize = edit.fontSize || 16;
      // Convert browser top-left coordinates to PDF bottom-left coordinates
      const pdfX = (edit.x / 100) * width;
      const pdfY = height - ((edit.y / 100) * height) - fontSize;
      page.drawText(edit.text, {
        x: pdfX,
        y: Math.max(0, pdfY),
        size: fontSize,
        font,
        color: drawColor
      });
    } else if (edit.type === 'highlight' && edit.width && edit.height) {
      const pdfX = (edit.x / 100) * width;
      const rectW = (edit.width / 100) * width;
      const rectH = (edit.height / 100) * height;
      const pdfY = height - ((edit.y / 100) * height) - rectH;

      page.drawRectangle({
        x: pdfX,
        y: Math.max(0, pdfY),
        width: rectW,
        height: rectH,
        color: hexToPdfRgb(edit.color || '#fef08a'),
        opacity: 0.4
      });
    } else if (edit.type === 'rectangle' && edit.width && edit.height) {
      const pdfX = (edit.x / 100) * width;
      const rectW = (edit.width / 100) * width;
      const rectH = (edit.height / 100) * height;
      const pdfY = height - ((edit.y / 100) * height) - rectH;

      page.drawRectangle({
        x: pdfX,
        y: Math.max(0, pdfY),
        width: rectW,
        height: rectH,
        borderColor: drawColor,
        borderWidth: edit.strokeWidth || 2,
        opacity: 1
      });
    }
  }

  return await pdf.save();
}
