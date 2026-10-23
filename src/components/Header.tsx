import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

interface HeaderProps {
  onScrollToEditor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToEditor }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Branding with Official Mandd Sobhann Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <a 
              href="https://www.manddsobhann.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="shrink-0 group block"
              title="Mandd Sobhann Official Website"
            >
              <div className="p-0.5 sm:p-1 rounded-xl hover:bg-pink-50/60 transition-colors">
                <img 
                  src="/assets/mandd-sobhann-logo.png" 
                  alt="Mandd Sobhann" 
                  className="h-8 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>
            </a>

            <div className="hidden sm:block h-8 w-px bg-pink-200/80 shrink-0" />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A00055] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200 truncate">
                  Mandd Sobhann
                </span>
                <span className="hidden md:inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Calendar className="w-3 h-3 mr-1 text-[#D9A52E]" /> 3rd–15th Nov 2026
                </span>
              </div>
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-[#18215B] tracking-tight font-['Outfit',sans-serif] leading-tight truncate">
                Konkani Music Mega Convention 2026
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Town Hall, Mangalore • Official Photo Frame Generator
              </p>
            </div>
          </div>

          {/* Right: Quick CTA */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={onScrollToEditor}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#A00055] bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-md shadow-[#A00055]/25 hover:shadow-lg cursor-pointer min-h-[36px] sm:min-h-[40px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Frame</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
