import React from 'react';
import { Sparkles, Check, Image as ImageIcon, Smartphone, Square, ChevronRight } from 'lucide-react';
import { FrameId, FrameOption } from '../types';
import { AVAILABLE_FRAMES } from '../utils/imageComposition';

interface FrameSelectorProps {
  selectedFrameId: FrameId;
  onSelectFrame: (frameId: FrameId) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrameId,
  onSelectFrame,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl p-3.5 sm:p-5 border border-pink-100 shadow-xs space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A00055] to-[#D41472] text-white flex items-center justify-center shadow-xs shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#18215B] font-['Outfit',sans-serif]">
              Select Event Frame
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              5 official convention designs
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] font-semibold text-[#A00055] bg-pink-50 border border-pink-100 px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{AVAILABLE_FRAMES.length} Styles</span>
        </span>
      </div>

      {/* Frame Cards: Smooth Horizontal Scroll on Mobile, Responsive Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 -mx-1 px-1 sm:mx-0 sm:px-0">
        {AVAILABLE_FRAMES.map((frame: FrameOption) => {
          const isSelected = frame.id === selectedFrameId;

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => onSelectFrame(frame.id)}
              className={`group relative text-left p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 w-[130px] sm:w-auto snap-start ${
                isSelected
                  ? 'border-[#A00055] bg-gradient-to-b from-pink-50/90 to-purple-50/40 ring-2 ring-[#A00055]/30 shadow-sm shadow-[#A00055]/10 -translate-y-0.5'
                  : 'border-slate-200/80 bg-white hover:border-pink-300 hover:bg-pink-50/30'
              }`}
            >
              {/* Active Checkmark Pill */}
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 w-4 h-4 rounded-full bg-[#A00055] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Thumbnail Container */}
              <div className="w-full aspect-[4/4] rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-[1.02] transition-transform">
                <img
                  src={frame.thumbnailSrc}
                  alt={frame.title}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
              </div>

              {/* Title & Format Badge */}
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1">
                  {frame.orientation === 'portrait' ? (
                    <Smartphone className="w-3 h-3 text-[#D41472] shrink-0" />
                  ) : (
                    <Square className="w-3 h-3 text-amber-600 shrink-0" />
                  )}
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {frame.orientation === 'portrait' ? '4:5 Poster' : '1:1 Square'}
                  </span>
                </div>

                <h4 className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 ${
                  isSelected ? 'text-[#A00055]' : 'text-slate-800'
                }`}>
                  {frame.title}
                </h4>
              </div>

            </button>
          );
        })}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden flex items-center justify-between text-[10px] text-slate-400 pt-0.5 px-0.5">
        <span>← Swipe horizontally to view all designs</span>
        <ChevronRight className="w-3 h-3 text-slate-400 animate-pulse" />
      </div>

    </div>
  );
};
