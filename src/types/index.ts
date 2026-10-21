export interface PhotoState {
  file: File | null;
  imageUrl: string | null;
  imageElement: HTMLImageElement | null;
  naturalWidth: number;
  naturalHeight: number;
  scale: number;        // 0.5 to 3.0, default 1.0
  panX: number;         // pixel offset in 1024x1024 canvas space
  panY: number;         // pixel offset in 1024x1024 canvas space
  rotation: number;     // 0, 90, 180, 270 degrees
  cornerBackground: 'transparent' | 'white'; // Transparent PNG or clean white corners
  showGoldenBorder: boolean; // Optional full circle gold accent
  customName: string;   // Typed name for "BEST WISHES FROM" box
}

export interface FrameConfig {
  readonly width: number;
  readonly height: number;
  readonly circleCenterX: number;
  readonly circleCenterY: number;
  readonly circleRadius: number;
  readonly overlaySrc: string;
}

export type DownloadStatus = 'idle' | 'preparing' | 'ready' | 'error';

export interface ShareFeedback {
  isOpen: boolean;
  type: 'native' | 'fallback';
  message: string;
}
