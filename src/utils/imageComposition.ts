import { PhotoState, FrameConfig } from '../types';

export const FRAME_CONFIG: FrameConfig = {
  width: 1024,
  height: 1024,
  circleCenterX: 512,
  circleCenterY: 512,
  circleRadius: 512,
  overlaySrc: '/assets/event-frame-wishes-overlay.png',
};

/**
 * Splits a text into two balanced lines at the optimal word boundary.
 */
function splitIntoTwoBalancedLines(text: string): [string, string] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [text, ''];

  let bestDiff = Infinity;
  let bestSplit = 1;

  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(' ');
    const l2 = words.slice(i).join(' ');
    const diff = Math.abs(l1.length - l2.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i;
    }
  }

  return [
    words.slice(0, bestSplit).join(' '),
    words.slice(bestSplit).join(' ')
  ];
}

/**
 * Renders dynamically auto-fitted text centered inside the "BEST WISHES FROM" purple pill.
 * Supports 1 or 2 lines with precision horizontal and vertical centering at Y = 936.5.
 */
function renderCustomNameText(
  ctx: CanvasRenderingContext2D,
  rawName: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  maxHeight: number,
  scaleRatio: number
): void {
  const trimmed = rawName.trim();
  if (!trimmed) return;

  // 1. Determine line structure: respect explicit newlines or auto-split long text
  const explicitLines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let lines: string[] = [];

  if (explicitLines.length >= 2) {
    // User explicitly broke into 2 lines
    lines = explicitLines.slice(0, 2);
  } else if (explicitLines.length === 1) {
    const single = explicitLines[0];
    // Check if single line fits comfortably at a legible font size (>= 25px)
    ctx.save();
    ctx.font = `bold ${25 * scaleRatio}px 'Outfit', 'Poppins', sans-serif`;
    const singleWidth = ctx.measureText(single).width;
    ctx.restore();

    const targetMaxWidth = maxWidth * 0.92;
    if (singleWidth <= targetMaxWidth) {
      lines = [single];
    } else {
      // If too long for a single line at >= 25px, auto-split into 2 balanced lines if multi-word
      const words = single.split(/\s+/).filter(Boolean);
      if (words.length > 1) {
        lines = splitIntoTwoBalancedLines(single);
      } else {
        lines = [single];
      }
    }
  }

  if (lines.length === 0) return;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Crisp high-contrast drop shadow for maximum legibility on dark purple background
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 4 * scaleRatio;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2 * scaleRatio;
  ctx.fillStyle = '#FFFFFF';

  if (lines.length === 1) {
    // SINGLE LINE MODE
    let fontSize = 38 * scaleRatio;
    const minFontSize = 14 * scaleRatio;
    const targetMaxWidth = maxWidth * 0.92;

    ctx.font = `bold ${fontSize}px 'Outfit', 'Poppins', sans-serif`;
    let measuredWidth = ctx.measureText(lines[0]).width;

    while (
      (measuredWidth > targetMaxWidth || fontSize > maxHeight * 0.75) &&
      fontSize > minFontSize
    ) {
      fontSize -= 0.5 * scaleRatio;
      ctx.font = `bold ${fontSize}px 'Outfit', 'Poppins', sans-serif`;
      measuredWidth = ctx.measureText(lines[0]).width;
    }

    // Exactly centered horizontally at centerX and vertically at centerY
    ctx.fillText(lines[0], centerX, centerY);
  } else {
    // TWO LINES MODE
    let fontSize = 24 * scaleRatio;
    const minFontSize = 12 * scaleRatio;
    const targetMaxWidth = maxWidth * 0.88; // Extra margin for top/bottom curves of pill

    ctx.font = `bold ${fontSize}px 'Outfit', 'Poppins', sans-serif`;
    let w1 = ctx.measureText(lines[0]).width;
    let w2 = ctx.measureText(lines[1]).width;
    let lineHeight = fontSize * 1.22;

    while (
      (w1 > targetMaxWidth || w2 > targetMaxWidth || (lineHeight + fontSize) > maxHeight * 0.92) &&
      fontSize > minFontSize
    ) {
      fontSize -= 0.5 * scaleRatio;
      ctx.font = `bold ${fontSize}px 'Outfit', 'Poppins', sans-serif`;
      w1 = ctx.measureText(lines[0]).width;
      w2 = ctx.measureText(lines[1]).width;
      lineHeight = fontSize * 1.22;
    }

    // Both lines vertically centered around centerY
    const y1 = centerY - (lineHeight / 2);
    const y2 = centerY + (lineHeight / 2);

    ctx.fillText(lines[0], centerX, y1);
    ctx.fillText(lines[1], centerX, y2);
  }

  ctx.restore();
}

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
    const renderCenterY = (cy - (30 * scaleRatio)) + (photoState.panY * scaleRatio);

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

  // 4. Draw foreground event artwork overlay ("Best Wishes From" frame)
  if (overlayImage && overlayImage.complete) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(overlayImage, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }

  // 5. Render auto-fitting Custom Name exactly centered inside "BEST WISHES FROM" purple pill
  const boxCenterX = 512 * scaleRatio; // Exact horizontal center of pill and canvas
  const boxCenterY = 936.5 * scaleRatio; // Exact vertical center of purple pill (bounds: y=896 to y=975)
  const boxMaxWidth = 440 * scaleRatio; // Usable width between ribbon ends (x=295 to x=735)
  const boxMaxHeight = 76 * scaleRatio; // Usable height inside purple pill

  if (photoState.customName && photoState.customName.trim()) {
    renderCustomNameText(
      ctx,
      photoState.customName,
      boxCenterX,
      boxCenterY,
      boxMaxWidth,
      boxMaxHeight,
      scaleRatio
    );
  }

  // 6. Optional full golden circular border if enabled by user
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
