import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PhotoUploader } from './components/PhotoUploader';
import { FramePreview } from './components/FramePreview';
import { PhotoControls } from './components/PhotoControls';
import { DownloadButton } from './components/DownloadButton';
import { WhatsAppShareButton } from './components/WhatsAppShareButton';
import { AboutEvent } from './components/AboutEvent';
import { Footer } from './components/Footer';
import { PhotoState } from './types';
import { FRAME_CONFIG } from './utils/imageComposition';
import { loadImageFromUrl } from './utils/imageValidation';
import { Sparkles, Info, ShieldCheck, CheckCircle2, Eye } from 'lucide-react';

export const App: React.FC = () => {
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(null);
  const [overlayLoading, setOverlayLoading] = useState(true);
  const [overlayError, setOverlayError] = useState<string | null>(null);

  // Photo State
  const [photoState, setPhotoState] = useState<PhotoState>({
    file: null,
    imageUrl: null,
    imageElement: null,
    naturalWidth: 0,
    naturalHeight: 0,
    scale: 1.0,
    panX: 0,
    panY: 0,
    rotation: 0,
    cornerBackground: 'transparent',
    showGoldenBorder: false,
  });

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [showArtworkModal, setShowArtworkModal] = useState(false);

  // Section reference for smooth scroll
  const editorSectionRef = useRef<HTMLDivElement>(null);

  const scrollToEditor = () => {
    editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load foreground event frame overlay on startup
  useEffect(() => {
    let isMounted = true;
    setOverlayLoading(true);

    loadImageFromUrl(FRAME_CONFIG.overlaySrc)
      .then((img) => {
        if (isMounted) {
          setOverlayImage(img);
          setOverlayLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load frame overlay:', err);
          setOverlayError('Failed to load official frame artwork. Please refresh the page.');
          setOverlayLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle newly selected photo
  const handlePhotoLoaded = (file: File | null, img: HTMLImageElement, url: string) => {
    // Revoke previous blob URL if exists to avoid memory leak
    if (photoState.imageUrl && photoState.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoState.imageUrl);
    }

    setPhotoState({
      file,
      imageUrl: url,
      imageElement: img,
      naturalWidth: img.naturalWidth || img.width,
      naturalHeight: img.naturalHeight || img.height,
      scale: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
      cornerBackground: photoState.cornerBackground,
      showGoldenBorder: photoState.showGoldenBorder,
    });
  };

  // Transformation handlers
  const handlePanChange = (panX: number, panY: number) => {
    setPhotoState((prev) => ({ ...prev, panX, panY }));
  };

  const handleScaleChange = (scale: number) => {
    setPhotoState((prev) => ({ ...prev, scale }));
  };

  const handleRotateChange = (rotation: number) => {
    setPhotoState((prev) => ({ ...prev, rotation }));
  };

  const handleResetPosition = () => {
    setPhotoState((prev) => ({ ...prev, panX: 0, panY: 0 }));
  };

  const handleResetAll = () => {
    setPhotoState((prev) => ({
      ...prev,
      scale: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
    }));
  };

  const handleCornerBackgroundChange = (cornerBackground: 'transparent' | 'white') => {
    setPhotoState((prev) => ({ ...prev, cornerBackground }));
  };

  const handleToggleGoldenBorder = () => {
    setPhotoState((prev) => ({ ...prev, showGoldenBorder: !prev.showGoldenBorder }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9FC] text-slate-800">
      
      {/* Navigation Header */}
      <Header onScrollToEditor={scrollToEditor} />

      {/* Hero Section */}
      <Hero onScrollToEditor={scrollToEditor} />

      {/* How it works 3 steps */}
      <HowItWorks />

      {/* Main Interactive Photo Studio Section */}
      <section 
        id="photo-studio" 
        ref={editorSectionRef}
        className="py-12 sm:py-20 relative bg-gradient-to-b from-white via-pink-50/20 to-white scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A00055] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Official Frame Studio
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#18215B] font-['Outfit',sans-serif]">
              Personalize Your Event Badge
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Place your photo inside the circular window, fine-tune your zoom and position, and download your 1024×1024 high-resolution image.
            </p>
          </div>

          {/* Overlay loading/error alert */}
          {overlayError && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {overlayError}
            </div>
          )}

          {/* Studio Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Interactive Canvas Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="sticky top-28 w-full flex flex-col items-center">
                <FramePreview
                  photoState={photoState}
                  overlayImage={overlayImage}
                  onPanChange={handlePanChange}
                  onScaleChange={handleScaleChange}
                />

                {/* Reference Artwork Authenticity Inspector trigger */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setShowArtworkModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#A00055] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#A00055]" />
                    <span>View Official Reference Artwork</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Upload, Adjust, and Export Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* 1. Uploader */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pink-100 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A00055] mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#A00055] text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Choose Your Photo</span>
                </div>

                <PhotoUploader
                  onPhotoLoaded={handlePhotoLoaded}
                  isLoading={isPhotoLoading}
                  setIsLoading={setIsPhotoLoading}
                  hasPhoto={Boolean(photoState.imageElement)}
                />
              </div>

              {/* 2. Photo Controls (Zoom, Pan, Rotate, Styling) */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A00055] px-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#A00055] text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Adjust Position & Scale</span>
                </div>

                <PhotoControls
                  photoState={photoState}
                  onScaleChange={handleScaleChange}
                  onRotateChange={handleRotateChange}
                  onResetPosition={handleResetPosition}
                  onResetAll={handleResetAll}
                  onCornerBackgroundChange={handleCornerBackgroundChange}
                  onToggleGoldenBorder={handleToggleGoldenBorder}
                />
              </div>

              {/* 3. Download & Share Actions */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A00055] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#A00055] text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Export Your Event Frame</span>
                </div>

                <div className="space-y-3">
                  <DownloadButton
                    photoState={photoState}
                    overlayImage={overlayImage}
                  />

                  <WhatsAppShareButton
                    photoState={photoState}
                    overlayImage={overlayImage}
                  />
                </div>

                {/* Privacy & Trust indicator */}
                <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Local client-side rendering • High-resolution 1024×1024 PNG</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Cultural Heritage and About Convention Section */}
      <AboutEvent />

      {/* Official Reference Artwork Modal */}
      {showArtworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif]">
                  Supplied Official Reference Artwork
                </h3>
                <p className="text-xs text-slate-500">
                  Preserved authentic Mandd Sobhann design assets
                </p>
              </div>
              <button
                onClick={() => setShowArtworkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Reference 1: Original Event Frame</div>
                <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white p-1">
                  <img 
                    src="/assets/event-frame-white.jpg" 
                    alt="Original White Background Reference"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Official artwork with original Mandd Sobhann logo, text, ribbons, church, and treble clef.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Reference 2: Cloud Photo Placeholder</div>
                <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white p-1">
                  <img 
                    src="/assets/event-frame-placeholder.jpg" 
                    alt="Cloud Placeholder Reference"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Template reference defining the circular photo window geometry (center 512, 512; radius 512).
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowArtworkModal(false)}
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Website Footer with Mandd Sobhann and TechHarmonix Developer Credit */}
      <Footer />

    </div>
  );
};

export default App;
