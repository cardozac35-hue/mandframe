export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file was selected.' };
  }

  // Validate MIME type or file extension
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const hasValidExt = /\.(jpe?g|png|webp)$/i.test(fileName);
  const hasValidMime = ALLOWED_MIME_TYPES.includes(fileType);

  if (!hasValidMime && !hasValidExt) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.'
    };
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `The selected image is ${sizeInMB} MB. Maximum allowed file size is 10 MB.`
    };
  }

  return { valid: true };
}

export function loadImageFromFile(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve({ img, url });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('The image file appears to be corrupted or cannot be decoded.'));
    };

    img.src = url;
  });
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load asset from ${url}`));

    img.src = url;
  });
}
