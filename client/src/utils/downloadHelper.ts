import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function saveBlobToFile(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

export async function createAndSaveZip(
  files: { filename: string; blob: Blob }[],
  zipFilename: string
) {
  const zip = new JSZip();
  files.forEach(f => {
    zip.file(f.filename, f.blob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipFilename);
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
