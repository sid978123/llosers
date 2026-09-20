import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to reliable CDN worker matching installed version or fallback
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export async function getPdfDocument(file: File | ArrayBuffer) {
  const data = file instanceof File ? await file.arrayBuffer() : file;
  const loadingTask = pdfjsLib.getDocument({ data });
  return await loadingTask.promise;
}

export async function renderPdfPageToCanvas(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 1.0
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context for canvas');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext: any = {
    canvasContext: context,
    viewport: viewport,
    canvas: canvas
  };

  await page.render(renderContext).promise;
  return canvas;
}

export async function renderPdfPageAsDataUrl(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 0.5
): Promise<RenderedPage> {
  const canvas = await renderPdfPageToCanvas(pdfDoc, pageNumber, scale);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  return {
    pageNumber,
    dataUrl,
    width: canvas.width,
    height: canvas.height
  };
}

export async function renderAllPdfPages(
  file: File,
  scale: number = 0.5,
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPage[]> {
  const pdfDoc = await getPdfDocument(file);
  const totalPages = pdfDoc.numPages;
  const results: RenderedPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const rendered = await renderPdfPageAsDataUrl(pdfDoc, i, scale);
    results.push(rendered);
    if (onProgress) {
      onProgress(i, totalPages);
    }
  }

  return results;
}

export async function convertPdfToImages(
  file: File,
  format: 'jpg' | 'png' = 'jpg',
  scale: number = 1.5,
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNumber: number; blob: Blob; filename: string }[]> {
  const pdfDoc = await getPdfDocument(file);
  const totalPages = pdfDoc.numPages;
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const ext = format === 'png' ? 'png' : 'jpg';
  const baseName = file.name.replace(/\.pdf$/i, '');
  const results: { pageNumber: number; blob: Blob; filename: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const canvas = await renderPdfPageToCanvas(pdfDoc, i, scale);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        b => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert page ${i} to image`));
        },
        mimeType,
        0.92
      );
    });

    results.push({
      pageNumber: i,
      blob,
      filename: `${baseName}_page_${i}.${ext}`
    });

    if (onProgress) {
      onProgress(i, totalPages);
    }
  }

  return results;
}
