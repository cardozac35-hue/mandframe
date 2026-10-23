import React from 'react';
import { UploadCloud, Sliders, Share2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Photo',
      description: 'Choose any picture from your phone, computer, or capture a quick selfie.',
      icon: UploadCloud,
      color: 'from-[#A00055] to-[#D41472]',
      bgColor: 'bg-pink-50',
      textColor: 'text-[#A00055]',
    },
    {
      step: '02',
      title: 'Pick Frame & Personalize',
      description: 'Choose from 5 official designs (square or 4:5 poster), type your name with 2-line auto-fit, and pinch/drag to position.',
      icon: Sliders,
      color: 'from-[#D41472] to-[#D9A52E]',
      bgColor: 'bg-amber-50',
      textColor: 'text-[#D9A52E]',
    },
    {
      step: '03',
      title: 'Download & Share',
      description: 'Save your completed high-resolution event badge PNG and share it directly on WhatsApp.',
      icon: Share2,
      color: 'from-[#D9A52E] to-[#18215B]',
      bgColor: 'bg-blue-50',
      textColor: 'text-[#18215B]',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-pink-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A00055] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Simple 3-Step Process
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#18215B] font-['Outfit',sans-serif]">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Create your personalized First World Konkani Music Mega Convention badge in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-white to-pink-50/30 border border-pink-100 shadow-xs hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black font-['Outfit',sans-serif] text-slate-200 group-hover:text-[#A00055]/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
