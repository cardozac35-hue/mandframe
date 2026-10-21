import React from 'react';
import { Calendar, MapPin, Music, Heart, Sparkles, Users, Award } from 'lucide-react';

export const AboutEvent: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FFF9FC] via-white to-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A00055] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            About The Mega Convention
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#18215B] font-['Outfit',sans-serif]">
            A Historic Milestone in Konkani Cultural History
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Organized by the prestigious <strong className="text-[#A00055]">Mandd Sobhann</strong>, the premier organization preserving and nurturing Konkani language and art, the <strong className="text-[#18215B]">First World Konkani Music Mega Convention</strong> is an unprecedented 13-day musical extravaganza.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#A00055] flex items-center justify-center mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif] mb-2">
              Uniting Global Artists
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bringing together over hundreds of Konkani musicians, vocalists, bands, composers, and lyricists from Goa, Karnataka, Maharashtra, Kerala, and across the globe.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D9A52E] flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif] mb-2">
              13 Days of Music & Harmony
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From <strong>3rd to 15th November 2026</strong> at the historic <strong>Town Hall in Mangalore</strong>. Daily concerts, symposiums, folk renditions, and youth competitions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif] mb-2">
              Free & Open to Everyone
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In true spirit of cultural heritage, all are cordially invited to celebrate the timeless melodies, rich folklore, and vibrant future of Konkani music.
            </p>
          </div>

        </div>

        {/* Convention Banner Strip */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#18215B] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Official Invitation
            </div>
            <h4 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif]">
              "All Are Cordially Invited"
            </h4>
            <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
              Town Hall, Mangalore • 3rd to 15th November 2026. Join as a proud supporter and download your official participation badge today!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-xs uppercase font-medium text-pink-200">Dates</div>
              <div className="text-base font-extrabold text-amber-300">Nov 3–15, 2026</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
