import { PhotoState, FrameConfig } from '../types';

export const FRAME_CONFIG: FrameConfig = {
  width: 1024,
  height: 1024,
  circleCenterX: 512,
  circleCenterY: 512,
  circleRadius: 512,
  overlaySrc: '/assets/event-frame-overlay.png',
  originalWhiteSrc: '/assets/event-frame-white.jpg',
  placeholderSrc: '/assets/event-frame-placeholder.jpg',
};

/**
 * Draws the personalized event photo frame onto any 2D canvas context.
 * Used identically for real-time live preview and high-resolution PNG export.
 */
export function renderFrameComposition(
  ctx: CanvasRenderingContext2D,
  photoState: PhotoState,
  overlayImage: HTMLImageElement | null,
  canvasWidth: number = FRAME_CONFIG.width,
  canvasHeight: number = FRAME_CONFIG.height
): void {
  const scaleRatio = canvasWidth / FRAME_CONFIG.width;
  const cx = FRAME_CONFIG.circleCenterX * scaleRatio;
  const cy = FRAME_CONFIG.circleCenterY * scaleRatio;
  const radius = FRAME_CONFIG.circleRadius * scaleRatio;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // If user selected white background for square export/print
  if (photoState.cornerBackground === 'white') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Draw user photograph if loaded
  if (photoState.imageElement && photoState.imageElement.complete) {
    ctx.save();

    // 1. Clip to circular frame area
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // 2. Clip upper photo window region (ensuring photo tucks under banner but never bleeds past bottom rim)
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, cy + (230 * scaleRatio));
    ctx.closePath();
    ctx.clip();

    // Subtle dark backdrop behind photo in case user zooms way out
    ctx.fillStyle = '#1A0C22';
    ctx.fill();

    // 3. Calculate object-fit: cover scaling
    const img = photoState.imageElement;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    // Base scale to cover the diameter of the circular photo window
    const baseScale = Math.max((radius * 2) / imgW, (radius * 2) / imgH);
    const finalScale = baseScale * photoState.scale;

    const drawW = imgW * finalScale;
    const drawH = imgH * finalScale;

    // Apply translation, rotation, and drawing
    const renderCenterX = cx + (photoState.panX * scaleRatio);
    const renderCenterY = (cy - (30 * scaleRatio)) + (photoState.panY * scaleRatio); // slight natural offset towards upper circular window

    ctx.translate(renderCenterX, renderCenterY);

    if (photoState.rotation !== 0) {
      ctx.rotate((photoState.rotation * Math.PI) / 180);
    }

    // High quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  } else {
    // Empty state on canvas: Draw gentle circular placeholder hint
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Light subtle gradient placeholder
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, '#E5F6FF');
    grad.addColorStop(0.65, '#D5EDFF');
    grad.addColorStop(1, '#FFF5FA');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  }

  // 4. Draw foreground event artwork overlay
  if (overlayImage && overlayImage.complete) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(overlayImage, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }

  // 5. Optional full golden circular border if enabled by user
  if (photoState.showGoldenBorder) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - (3 * scaleRatio), 0, Math.PI * 2);
    ctx.strokeStyle = '#D9A52E';
    ctx.lineWidth = 6 * scaleRatio;
    ctx.shadowColor = 'rgba(217, 165, 46, 0.4)';
    ctx.shadowBlur = 8 * scaleRatio;
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Creates high-resolution 1024x1024 PNG blob from the current photo state.
 */
export async function generateHighResBlob(
  photoState: PhotoState,
  overlayImage: HTMLImageElement
): Promise<Blob> {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = FRAME_CONFIG.width;
  offscreenCanvas.height = FRAME_CONFIG.height;

  const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) {
    throw new Error('Unable to create canvas rendering context.');
  }

  renderFrameComposition(
    ctx,
    photoState,
    overlayImage,
    FRAME_CONFIG.width,
    FRAME_CONFIG.height
  );

  return new Promise((resolve, reject) => {
    offscreenCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export to PNG failed.'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Initiates native browser file download of the completed PNG.
 */
export function triggerFileDownload(blob: Blob, filename = 'Konkani-Music-Convention-2026.png'): void {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Clean up object URL after a brief delay
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 2000);
}
