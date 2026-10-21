import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, Calendar } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#18215B] text-white border-t border-pink-900/40 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top row: Event details & Privacy badge */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-white/10">
          
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="https://www.manddsobhann.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white px-3.5 py-1.5 rounded-xl shadow-sm hover:opacity-95 transition-opacity"
                title="Mandd Sobhann"
              >
                <img 
                  src="/assets/mandd-sobhann-logo.png" 
                  alt="Mandd Sobhann" 
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </a>

              <div>
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                  First World Konkani Music Mega Convention 2026
                </h3>
                <p className="text-xs text-pink-200">
                  Organized by Mandd Sobhann • Town Hall, Mangalore
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              An official community celebration badge tool created to allow delegates, music lovers, and patrons worldwide to show their proud participation in the historic Konkani Music Mega Convention.
            </p>
          </div>

          <div className="md:col-span-5 bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Privacy Protection</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your photographs are processed entirely within your web browser. No photos are ever uploaded to any server, stored in a database, or tracked by external services.
            </p>
          </div>

        </div>

        {/* Bottom row: Copyright & Developer Credit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div>
            © 2026 First World Konkani Music Mega Convention. All rights reserved.
          </div>

          {/* Developer Credit - TechHarmonix Consulting Pvt. Ltd. */}
          <div className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
            <span>Developed by</span>
            <span className="font-semibold text-amber-300 tracking-wide">
              TechHarmonix Consulting Pvt. Ltd.
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};
