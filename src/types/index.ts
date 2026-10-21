export type FrameType = 'participant' | 'wishes';

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
  frameType: FrameType; // 'participant' or 'wishes'
  customName: string;   // For 'wishes' frame ("BEST WISHES FROM")
}

export interface FrameConfig {
  readonly width: number;
  readonly height: number;
  readonly circleCenterX: number;
  readonly circleCenterY: number;
  readonly circleRadius: number;
  readonly overlayParticipantSrc: string;
  readonly overlayWishesSrc: string;
  readonly originalWhiteSrc: string;
  readonly placeholderSrc: string;
}

export type DownloadStatus = 'idle' | 'preparing' | 'ready' | 'error';

export interface ShareFeedback {
  isOpen: boolean;
  type: 'native' | 'fallback';
  message: string;
}
