export type FrameId =
  | 'wishes-square'
  | 'wishes-portrait'
  | 'participant-square'
  | 'participant-portrait'
  | 'invitation-square';

export type FrameOrientation = 'square' | 'portrait';

export interface FrameOption {
  readonly id: FrameId;
  readonly title: string;
  readonly subtitle: string;
  readonly badgeLabel: string;
  readonly orientation: FrameOrientation;
  readonly width: number;
  readonly height: number;
  readonly overlaySrc: string;
  readonly thumbnailSrc: string;
  readonly circleCenterX?: number;
  readonly circleCenterY?: number;
  readonly circleRadius?: number;
  readonly pillCenterX: number;
  readonly pillCenterY: number;
  readonly pillMaxWidth: number;
  readonly pillMaxHeight: number;
  readonly hasNameInput: boolean;
}

export interface PhotoState {
  file: File | null;
  imageUrl: string | null;
  imageElement: HTMLImageElement | null;
  naturalWidth: number;
  naturalHeight: number;
  scale: number;        // 0.5 to 3.0, default 1.0
  panX: number;         // pixel offset in canvas space
  panY: number;         // pixel offset in canvas space
  rotation: number;     // 0, 90, 180, 270 degrees
  cornerBackground: 'transparent' | 'white'; // Transparent PNG or clean white corners
  showGoldenBorder: boolean; // Optional full circle gold accent (for circular square frames)
  customName: string;   // Typed name for purple pill box
  selectedFrameId: FrameId; // Current frame template
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

