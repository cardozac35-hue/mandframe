import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

interface HeaderProps {
  onScrollToEditor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToEditor }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Left: Branding with Official Mandd Sobhann Logo */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a 
              href="https://www.manddsobhann.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="shrink-0 group block"
              title="Mandd Sobhann Official Website"
            >
              <div className="p-1 rounded-xl hover:bg-pink-50/60 transition-colors">
                <img 
                  src="/assets/mandd-sobhann-logo.png" 
                  alt="Mandd Sobhann" 
                  className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>
            </a>

            <div className="hidden sm:block h-10 w-px bg-pink-200/80" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A00055] bg-pink-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-pink-200">
                  Mandd Sobhann Presents
                </span>
                <span className="hidden md:inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Calendar className="w-3 h-3 mr-1 text-[#D9A52E]" /> 3rd–15th Nov 2026
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#18215B] tracking-tight font-['Outfit',sans-serif] leading-tight">
                First World Konkani Music Mega Convention 2026
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Official Photo Frame Generator • Town Hall, Mangalore
              </p>
            </div>
          </div>

          {/* Right: Quick CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onScrollToEditor}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#A00055] bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-md shadow-[#A00055]/25 hover:shadow-lg hover:shadow-[#A00055]/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Frame</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
