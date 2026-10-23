import { PhotoState, FrameConfig, FrameOption, FrameId } from '../types';

export const AVAILABLE_FRAMES: FrameOption[] = [
  {
    id: 'wishes-square',
    title: 'Best Wishes (Square)',
    subtitle: 'Classic 1:1 circular badge for WhatsApp DP & Profile',
    badgeLabel: 'Best Wishes From',
    orientation: 'square',
    width: 1024,
    height: 1024,
    circleCenterX: 512,
    circleCenterY: 512,
    circleRadius: 512,
    pillCenterX: 512,
    pillCenterY: 936.5,
    pillMaxWidth: 440,
    pillMaxHeight: 76,
    overlaySrc: '/assets/frame-wishes-square.png',
    thumbnailSrc: '/assets/thumb-wishes-square.png',
    hasNameInput: true,
  },
  {
    id: 'wishes-portrait',
    title: 'Best Wishes (Portrait 4:5)',
    subtitle: 'Full-height 4:5 vertical poster for Instagram & WhatsApp Status',
    badgeLabel: 'Best Wishes From',
    orientation: 'portrait',
    width: 1024,
    height: 1280,
    pillCenterX: 512,
    pillCenterY: 1206.5,
    pillMaxWidth: 560,
    pillMaxHeight: 68,
    overlaySrc: '/assets/frame-wishes-portrait.png',
    thumbnailSrc: '/assets/thumb-wishes-portrait.png',
    hasNameInput: true,
  },
  {
    id: 'participant-square',
    title: 'Proud Participant (Square)',
    subtitle: 'Official 1:1 circular badge with Proud Participant banner',
    badgeLabel: 'Proud Participant',
    orientation: 'square',
    width: 1024,
    height: 1024,
    circleCenterX: 512,
    circleCenterY: 512,
    circleRadius: 512,
    pillCenterX: 512,
    pillCenterY: 936.5,
    pillMaxWidth: 440,
    pillMaxHeight: 76,
    overlaySrc: '/assets/frame-participant-square.png',
    thumbnailSrc: '/assets/thumb-participant-square.png',
    hasNameInput: true,
  },
  {
    id: 'participant-portrait',
    title: 'Proud Participant (Portrait 4:5)',
    subtitle: 'Full-height 4:5 vertical poster with Proud Participant banner',
    badgeLabel: 'Proud Participant',
    orientation: 'portrait',
    width: 1024,
    height: 1280,
    pillCenterX: 512,
    pillCenterY: 1206.5,
    pillMaxWidth: 560,
    pillMaxHeight: 68,
    overlaySrc: '/assets/frame-participant-portrait.png',
    thumbnailSrc: '/assets/thumb-participant-portrait.png',
    hasNameInput: true,
  },
  {
    id: 'invitation-square',
    title: 'All Are Cordially Invited',
    subtitle: 'Official convention invitation frame with St. Aloysius chapel',
    badgeLabel: 'All Are Cordially Invited',
    orientation: 'square',
    width: 1024,
    height: 1024,
    circleCenterX: 512,
    circleCenterY: 512,
    circleRadius: 512,
    pillCenterX: 512,
    pillCenterY: 936.5,
    pillMaxWidth: 440,
    pillMaxHeight: 76,
    overlaySrc: '/assets/event-frame-overlay.png',
    thumbnailSrc: '/assets/thumb-invitation-square.png',
    hasNameInput: false,
  },
];

export const DEFAULT_FRAME = AVAILABLE_FRAMES[0];

export function getFrameById(id: FrameId): FrameOption {
  return AVAILABLE_FRAMES.find((f) => f.id === id) || DEFAULT_FRAME;
}

export const FRAME_CONFIG: FrameConfig = {
  width: DEFAULT_FRAME.width,
  height: DEFAULT_FRAME.height,
  circleCenterX: DEFAULT_FRAME.circleCenterX ?? 512,
  circleCenterY: DEFAULT_FRAME.circleCenterY ?? 512,
  circleRadius: DEFAULT_FRAME.circleRadius ?? 512,
  overlaySrc: DEFAULT_FRAME.overlaySrc,
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
 * Renders dynamically auto-fitted text centered inside the purple pill.
 * Supports 1 or 2 lines with precision horizontal and vertical centering.
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
    const targetMaxWidth = maxWidth * 0.88; // Extra margin for curves of pill

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
  activeFrame: FrameOption = DEFAULT_FRAME,
  canvasWidth: number = activeFrame.width,
  canvasHeight: number = activeFrame.height
): void {
  const scaleRatio = canvasWidth / activeFrame.width;

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

    const img = photoState.imageElement;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    if (activeFrame.orientation === 'square') {
      const cx = (activeFrame.circleCenterX ?? 512) * scaleRatio;
      const cy = (activeFrame.circleCenterY ?? 512) * scaleRatio;
      const radius = (activeFrame.circleRadius ?? 512) * scaleRatio;

      // 1. Clip to circular frame area
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // 2. Clip upper photo window region
      ctx.beginPath();
      ctx.rect(0, 0, canvasWidth, cy + (230 * scaleRatio));
      ctx.closePath();
      ctx.clip();

      // Subtle dark backdrop behind photo in case user zooms way out
      ctx.fillStyle = '#1A0C22';
      ctx.fill();

      // 3. Object-fit cover scaling
      const baseScale = Math.max((radius * 2) / imgW, (radius * 2) / imgH);
      const finalScale = baseScale * photoState.scale;
      const drawW = imgW * finalScale;
      const drawH = imgH * finalScale;

      const renderCenterX = cx + (photoState.panX * scaleRatio);
      const renderCenterY = (cy - (30 * scaleRatio)) + (photoState.panY * scaleRatio);

      ctx.translate(renderCenterX, renderCenterY);
      if (photoState.rotation !== 0) {
        ctx.rotate((photoState.rotation * Math.PI) / 180);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    } else {
      // PORTRAIT 4:5 MODE
      const photoAreaHeight = 980 * scaleRatio;

      // Clip upper rectangular window
      ctx.beginPath();
      ctx.rect(0, 0, canvasWidth, photoAreaHeight);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = '#1A0C22';
      ctx.fill();

      // Base scale to cover portrait window
      const baseScale = Math.max(canvasWidth / imgW, photoAreaHeight / imgH);
      const finalScale = baseScale * photoState.scale;
      const drawW = imgW * finalScale;
      const drawH = imgH * finalScale;

      const cx = canvasWidth / 2;
      const cy = (photoAreaHeight / 2) - (20 * scaleRatio);
      const renderCenterX = cx + (photoState.panX * scaleRatio);
      const renderCenterY = cy + (photoState.panY * scaleRatio);

      ctx.translate(renderCenterX, renderCenterY);
      if (photoState.rotation !== 0) {
        ctx.rotate((photoState.rotation * Math.PI) / 180);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    }

    ctx.restore();
  } else {
    // Empty state on canvas: Draw gentle placeholder hint
    ctx.save();
    if (activeFrame.orientation === 'square') {
      const cx = (activeFrame.circleCenterX ?? 512) * scaleRatio;
      const cy = (activeFrame.circleCenterY ?? 512) * scaleRatio;
      const radius = (activeFrame.circleRadius ?? 512) * scaleRatio;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(0, 0, canvasWidth, 980 * scaleRatio);
      ctx.closePath();
      ctx.clip();
    }

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

  // 5. Render auto-fitting Custom Name inside purple pill (if supported by active frame)
  if (activeFrame.hasNameInput && photoState.customName && photoState.customName.trim()) {
    const boxCenterX = activeFrame.pillCenterX * scaleRatio;
    const boxCenterY = activeFrame.pillCenterY * scaleRatio;
    const boxMaxWidth = activeFrame.pillMaxWidth * scaleRatio;
    const boxMaxHeight = activeFrame.pillMaxHeight * scaleRatio;

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

  // 6. Optional full golden circular border if enabled by user (for square frames)
  if (photoState.showGoldenBorder && activeFrame.orientation === 'square') {
    const cx = (activeFrame.circleCenterX ?? 512) * scaleRatio;
    const cy = (activeFrame.circleCenterY ?? 512) * scaleRatio;
    const radius = (activeFrame.circleRadius ?? 512) * scaleRatio;

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
 * Creates high-resolution PNG blob from the current photo state and active frame.
 */
export async function generateHighResBlob(
  photoState: PhotoState,
  overlayImage: HTMLImageElement,
  activeFrame: FrameOption = getFrameById(photoState.selectedFrameId)
): Promise<Blob> {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = activeFrame.width;
  offscreenCanvas.height = activeFrame.height;

  const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) {
    throw new Error('Unable to create canvas rendering context.');
  }

  renderFrameComposition(
    ctx,
    photoState,
    overlayImage,
    activeFrame,
    activeFrame.width,
    activeFrame.height
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

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 2000);
}
