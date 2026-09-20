export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  type: string;
  name: string;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// -------------------------------------------------------------
// 1. COMPRESS IMAGE
// -------------------------------------------------------------
export async function compressImage(
  file: File,
  quality: number = 0.75 // 0.1 to 1.0
): Promise<{ blob: Blob; url: string; originalSize: number; newSize: number; savingsPct: number }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  // If PNG or has transparent pixels, fill background white for JPG compression
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    ctx.drawImage(img, 0, 0);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }

  // Compress to JPEG or WebP
  const targetMime = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('Compression failed'))),
      targetMime,
      quality
    );
  });

  const url = URL.createObjectURL(blob);
  const savingsPct = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

  return {
    blob,
    url,
    originalSize: file.size,
    newSize: blob.size,
    savingsPct
  };
}

// -------------------------------------------------------------
// 2. RESIZE IMAGE
// -------------------------------------------------------------
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality: number = 0.92
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);
  const ctx = canvas.getContext('2d')!;

  // Smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const mimeType = file.type || 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('Resize failed'))),
      mimeType,
      quality
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height
  };
}

// -------------------------------------------------------------
// 3. CROP IMAGE
// -------------------------------------------------------------
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function cropImage(
  file: File,
  cropArea: CropArea
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(cropArea.width));
  canvas.height = Math.max(1, Math.round(cropArea.height));
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const mimeType = file.type || 'image/png';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('Crop failed'))),
      mimeType,
      0.95
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob)
  };
}

// -------------------------------------------------------------
// 4. ROTATE IMAGE
// -------------------------------------------------------------
export async function rotateAndFlipImage(
  file: File,
  angleDegrees: number, // 0, 90, 180, 270
  flipHorizontal: boolean = false,
  flipVertical: boolean = false
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const rad = (angleDegrees * Math.PI) / 180;
  const isPerpendicular = angleDegrees === 90 || angleDegrees === 270;

  canvas.width = isPerpendicular ? img.naturalHeight : img.naturalWidth;
  canvas.height = isPerpendicular ? img.naturalWidth : img.naturalHeight;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const mimeType = file.type || 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('Rotation failed'))),
      mimeType,
      0.95
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob)
  };
}

// -------------------------------------------------------------
// 5. JPG TO PNG
// -------------------------------------------------------------
export async function convertJpgToPng(file: File): Promise<{ blob: Blob; url: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('Conversion to PNG failed'))),
      'image/png'
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob)
  };
}

// -------------------------------------------------------------
// 6. PNG TO JPG
// -------------------------------------------------------------
export async function convertPngToJpg(
  file: File,
  quality: number = 0.92,
  bgColor: string = '#ffffff'
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  // Fill opaque background for transparent PNGs
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error('Conversion to JPG failed'))),
      'image/jpeg',
      quality
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob)
  };
}
