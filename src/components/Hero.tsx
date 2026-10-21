import React from 'react';
import { Sparkles, Calendar, MapPin, Music, Award, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollToEditor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToEditor }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-pink-50/40 to-[#FFF9FC]">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-80 h-80 bg-[#D41472]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#D9A52E]/15 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Event Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 shadow-xs text-xs font-semibold text-[#A00055]">
              <span className="flex h-2 w-2 rounded-full bg-[#D41472] animate-ping" />
              <span>Official Event Frame Generator</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#D9A52E] flex items-center font-bold">
                <Music className="w-3.5 h-3.5 mr-1" /> Historic Celebration
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#18215B] font-['Outfit',sans-serif] tracking-tight leading-[1.15]">
                Create Your <span className="bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#D9A52E] bg-clip-text text-transparent">Event Photo Frame</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Celebrate Konkani music and be part of history! Add your photo to the official event frame and share your participation with the world.
              </p>
            </div>

            {/* Quick Event Info Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 border border-pink-100 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center text-[#A00055]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</div>
                  <div className="text-xs font-bold text-[#18215B]">3rd–15th Nov 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 border border-pink-100 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-[#D9A52E]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Venue</div>
                  <div className="text-xs font-bold text-[#18215B]">Town Hall, Mangalore</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 border border-pink-100 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#18215B]">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Organizer</div>
                  <div className="text-xs font-bold text-[#18215B]">Mandd Sobhann</div>
                </div>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onScrollToEditor}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#A00055] bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-lg shadow-[#A00055]/30 hover:shadow-xl hover:shadow-[#A00055]/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Create My Photo Frame</span>
                <ArrowDown className="w-4 h-4 opacity-80" />
              </button>

              <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Free • No Sign-up Needed • Instant Download</span>
              </div>
            </div>

          </div>

          {/* Right Column: Official Event Frame Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              {/* Outer decorative glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#A00055] via-[#D41472] to-[#D9A52E] rounded-full blur-xl opacity-25 group-hover:opacity-40 transition duration-700"></div>
              
              <div className="relative rounded-full p-2 bg-white shadow-2xl shadow-[#A00055]/20 border-4 border-amber-200/80">
                <div className="rounded-full overflow-hidden aspect-square relative flex items-center justify-center bg-white">
                  
                  {/* Official Event Frame Artwork */}
                  <img 
                    src="/assets/event-logo.png" 
                    alt="Official First World Konkani Music Mega Convention Frame"
                    className="w-full h-full object-contain pointer-events-none"
                  />

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
