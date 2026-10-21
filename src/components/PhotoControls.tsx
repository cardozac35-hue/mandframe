import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  RefreshCw, 
  Move, 
  Sliders, 
  Layers,
  Sparkles,
  Type
} from 'lucide-react';
import { PhotoState } from '../types';

interface PhotoControlsProps {
  photoState: PhotoState;
  onScaleChange: (scale: number) => void;
  onRotateChange: (rotation: number) => void;
  onResetPosition: () => void;
  onResetAll: () => void;
  onCornerBackgroundChange: (bg: 'transparent' | 'white') => void;
  onToggleGoldenBorder: () => void;
  onCustomNameChange: (name: string) => void;
}

export const PhotoControls: React.FC<PhotoControlsProps> = ({
  photoState,
  onScaleChange,
  onRotateChange,
  onResetPosition,
  onResetAll,
  onCornerBackgroundChange,
  onToggleGoldenBorder,
  onCustomNameChange,
}) => {
  const hasPhoto = Boolean(photoState.imageElement);

  const handleZoomIn = () => {
    const next = Math.min(3.0, parseFloat((photoState.scale + 0.1).toFixed(2)));
    onScaleChange(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(0.5, parseFloat((photoState.scale - 0.1).toFixed(2)));
    onScaleChange(next);
  };

  const handleRotateLeft = () => {
    const next = (photoState.rotation - 90 + 360) % 360;
    onRotateChange(next);
  };

  const handleRotateRight = () => {
    const next = (photoState.rotation + 90) % 360;
    onRotateChange(next);
  };

  return (
    <div className="w-full space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-pink-100 shadow-xs">
      
      {/* 1. BEST WISHES FROM - TYPE NAME INPUT (AUTOFIT) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50/70 to-amber-50/50 border border-purple-200/80 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="custom-name-input"
            className="text-xs sm:text-sm font-bold text-[#18215B] flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-md bg-[#A00055] text-white flex items-center justify-center">
              <Type className="w-3.5 h-3.5" />
            </div>
            <span>Best Wishes From — Type Your Name:</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {photoState.customName.length}/45
          </span>
        </div>

        <div className="relative">
          <input
            id="custom-name-input"
            type="text"
            maxLength={45}
            value={photoState.customName}
            onChange={(e) => onCustomNameChange(e.target.value)}
            placeholder="e.g. Cardoza Family / Your Name"
            className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-sm font-semibold text-[#18215B] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#A00055]/30 focus:border-[#A00055] transition-all shadow-2xs"
          />
          {photoState.customName && (
            <button
              type="button"
              onClick={() => onCustomNameChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              title="Clear name"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span>Your name dynamically auto-fits inside the official event frame.</span>
        </p>
      </div>

      {/* 2. PHOTO POSITION & ZOOM CONTROLS */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Sliders className="w-4 h-4 text-[#A00055]" />
            <span>Photo Adjustments</span>
          </div>

          {hasPhoto && (
            <button
              onClick={onResetAll}
              className="text-xs font-semibold text-slate-500 hover:text-[#A00055] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Edits</span>
            </button>
          )}
        </div>

        {!hasPhoto ? (
          <div className="py-4 text-center text-xs text-slate-400">
            Upload a photo above to enable position and zoom controls.
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Zoom Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#A00055]" />
                  <span>Zoom Level</span>
                </span>
                <span className="font-mono text-[#A00055] bg-pink-50 px-2 py-0.5 rounded-md text-[11px]">
                  {Math.round(photoState.scale * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={photoState.scale <= 0.5}
                  aria-label="Zoom out"
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={photoState.scale}
                  onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                  aria-label="Zoom slider"
                  className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#A00055]"
                />

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={photoState.scale >= 3.0}
                  aria-label="Zoom in"
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Positioning & Rotation Actions */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={handleRotateLeft}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/60 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#A00055]" />
                <span>Rotate -90°</span>
              </button>

              <button
                type="button"
                onClick={handleRotateRight}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/60 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#A00055]" />
                <span>Rotate +90°</span>
              </button>

              <button
                type="button"
                onClick={onResetPosition}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/60 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Move className="w-3.5 h-3.5 text-amber-600" />
                <span>Center Photo</span>
              </button>
            </div>

            {/* Frame Presentation Options */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Corner Output Style
              </div>

              {/* Corner Background Toggle */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#18215B]" />
                  <span>Outer Corner Background:</span>
                </span>

                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => onCornerBackgroundChange('transparent')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      photoState.cornerBackground === 'transparent'
                        ? 'bg-[#A00055] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Transparent (Badge)
                  </button>
                  <button
                    type="button"
                    onClick={() => onCornerBackgroundChange('white')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      photoState.cornerBackground === 'white'
                        ? 'bg-[#A00055] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    White
                  </button>
                </div>
              </div>

              {/* Golden Rim Accent Option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A52E]" />
                  <span>Golden Circular Border Accent:</span>
                </span>

                <button
                  type="button"
                  onClick={onToggleGoldenBorder}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    photoState.showGoldenBorder ? 'bg-[#D9A52E]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      photoState.showGoldenBorder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
};
