import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Move, RefreshCw } from 'lucide-react';
import { PhotoState, FrameOption } from '../types';
import { renderFrameComposition } from '../utils/imageComposition';

interface FramePreviewProps {
  photoState: PhotoState;
  overlayImage: HTMLImageElement | null;
  activeFrame: FrameOption;
  onPanChange: (panX: number, panY: number) => void;
  onScaleChange: (scale: number) => void;
}

export const FramePreview: React.FC<FramePreviewProps> = ({
  photoState,
  overlayImage,
  activeFrame,
  onPanChange,
  onScaleChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction dragging states
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Touch pinch zoom state
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(1.0);

  // Re-draw canvas whenever state or overlay changes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    renderFrameComposition(
      ctx,
      photoState,
      overlayImage,
      activeFrame,
      activeFrame.width,
      activeFrame.height
    );
  }, [photoState, overlayImage, activeFrame]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!photoState.imageElement) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: photoState.panX,
      initialPanY: photoState.panY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasScale = activeFrame.width / rect.width;

    const deltaX = (e.clientX - dragStartRef.current.x) * canvasScale;
    const deltaY = (e.clientY - dragStartRef.current.y) * canvasScale;

    onPanChange(
      Math.round(dragStartRef.current.initialPanX + deltaX),
      Math.round(dragStartRef.current.initialPanY + deltaY)
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers (pan and pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!photoState.imageElement) return;

    if (e.touches.length === 1) {
      // Single finger drag
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        initialPanX: photoState.panX,
        initialPanY: photoState.panY,
      };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      // Two finger pinch to zoom
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
      touchStartScaleRef.current = photoState.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canvasRef.current || !photoState.imageElement) return;

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasScale = activeFrame.width / rect.width;

      const deltaX = (touch.clientX - dragStartRef.current.x) * canvasScale;
      const deltaY = (touch.clientY - dragStartRef.current.y) * canvasScale;

      onPanChange(
        Math.round(dragStartRef.current.initialPanX + deltaX),
        Math.round(dragStartRef.current.initialPanY + deltaY)
      );
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const factor = currentDist / touchStartDistRef.current;
      const newScale = Math.min(3.0, Math.max(0.5, touchStartScaleRef.current * factor));
      onScaleChange(parseFloat(newScale.toFixed(2)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!photoState.imageElement) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    const newScale = Math.min(3.0, Math.max(0.5, photoState.scale + zoomDelta));
    onScaleChange(parseFloat(newScale.toFixed(2)));
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Outer Preview Container */}
      <div 
        ref={containerRef}
        className={`relative w-full ${
          activeFrame.orientation === 'portrait' 
            ? 'max-w-[360px] sm:max-w-[400px] aspect-[4/5]' 
            : 'max-w-[420px] sm:max-w-[460px] aspect-square'
        } rounded-3xl p-3 sm:p-4 bg-white shadow-xl shadow-[#A00055]/15 border border-pink-100 flex items-center justify-center select-none transition-all duration-300`}
      >
        {/* Subtle decorative background pattern for canvas container */}
        <div className={`relative w-full h-full rounded-2xl overflow-hidden ${photoState.cornerBackground === 'transparent' ? 'bg-checkerboard' : 'bg-white'}`}>
          
          <canvas
            ref={canvasRef}
            width={activeFrame.width}
            height={activeFrame.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className={`w-full h-full object-contain ${
              photoState.imageElement 
                ? isDragging ? 'cursor-grabbing' : 'cursor-grab' 
                : 'cursor-default'
            }`}
          />

          {/* Overlay Helper Badge when photo is loaded */}
          {photoState.imageElement && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#18215B] shadow-xs border border-pink-200 pointer-events-none flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <Move className="w-3 h-3 text-[#A00055]" />
              <span>Drag to position</span>
            </div>
          )}

          {/* Placeholder hint when no photo */}
          {!photoState.imageElement && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#A00055] shadow-md mb-2">
                <RefreshCw className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-[#18215B] bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs">
                {activeFrame.title} Ready
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Helpful instruction text below canvas */}
      <p className="text-xs text-slate-500 mt-2.5 text-center flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D41472]"></span>
        <span>
          {photoState.imageElement 
            ? 'Touch / Drag photo to reposition • Scroll to zoom' 
            : 'Upload a picture above to place it in the frame'}
        </span>
      </p>

    </div>
  );
};
