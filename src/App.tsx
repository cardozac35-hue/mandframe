import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PhotoUploader } from './components/PhotoUploader';
import { FramePreview } from './components/FramePreview';
import { FrameSelector } from './components/FrameSelector';
import { PhotoControls } from './components/PhotoControls';
import { DownloadButton } from './components/DownloadButton';
import { WhatsAppShareButton } from './components/WhatsAppShareButton';
import { AboutEvent } from './components/AboutEvent';
import { Footer } from './components/Footer';
import { PhotoState, FrameId } from './types';
import { AVAILABLE_FRAMES, DEFAULT_FRAME, getFrameById } from './utils/imageComposition';
import { loadImageFromUrl } from './utils/imageValidation';
import { Sparkles, Eye, ShieldCheck, Check } from 'lucide-react';

export const App: React.FC = () => {
  const [overlayImages, setOverlayImages] = useState<Partial<Record<FrameId, HTMLImageElement>>>({});
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
    customName: '',
    selectedFrameId: DEFAULT_FRAME.id,
  });

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [showArtworkModal, setShowArtworkModal] = useState(false);

  // Active Frame Configuration
  const activeFrame = useMemo(() => {
    return getFrameById(photoState.selectedFrameId);
  }, [photoState.selectedFrameId]);

  const currentOverlay = overlayImages[photoState.selectedFrameId] || null;

  // Section reference for smooth scroll
  const editorSectionRef = useRef<HTMLDivElement>(null);

  const scrollToEditor = () => {
    editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Pre-load all 5 official frame overlays on app startup for instantaneous switching
  useEffect(() => {
    let isMounted = true;
    setOverlayLoading(true);

    const loadTasks = AVAILABLE_FRAMES.map((f) =>
      loadImageFromUrl(f.overlaySrc)
        .then((img) => ({ id: f.id, img }))
        .catch((err) => {
          console.warn(`Failed to preload frame ${f.id}:`, err);
          return null;
        })
    );

    Promise.all(loadTasks).then((results) => {
      if (!isMounted) return;
      const cache: Partial<Record<FrameId, HTMLImageElement>> = {};
      results.forEach((res) => {
        if (res) {
          cache[res.id] = res.img;
        }
      });
      setOverlayImages(cache);
      setOverlayLoading(false);

      if (!cache[DEFAULT_FRAME.id]) {
        setOverlayError('Failed to load default frame artwork. Please refresh the page.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Frame selection handler
  const handleFrameChange = (selectedFrameId: FrameId) => {
    setPhotoState((prev) => ({
      ...prev,
      selectedFrameId,
      // Reset pan offsets for optimal initial framing when switching aspect ratio
      panX: 0,
      panY: 0,
    }));
  };

  const handleUploadClick = () => {
    document.getElementById('main-photo-file-input')?.click();
  };

  // Handle newly selected photo
  const handlePhotoLoaded = (file: File | null, img: HTMLImageElement, url: string) => {
    if (photoState.imageUrl && photoState.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoState.imageUrl);
    }

    setPhotoState((prev) => ({
      ...prev,
      file,
      imageUrl: url,
      imageElement: img,
      naturalWidth: img.naturalWidth || img.width,
      naturalHeight: img.naturalHeight || img.height,
      scale: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
    }));
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

  const handleCustomNameChange = (customName: string) => {
    setPhotoState((prev) => ({ ...prev, customName }));
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
        className={`py-8 sm:py-16 relative bg-gradient-to-b from-white via-pink-50/20 to-white scroll-mt-20 ${
          photoState.imageElement ? 'pb-28 lg:pb-16' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A00055] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Official Frame Studio
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#18215B] font-['Outfit',sans-serif]">
              Personalize Your Event Frame
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Choose your favorite frame design, upload your picture, type your name with 2-line auto-fit, and download in high-resolution.
            </p>
          </div>

          {/* Overlay loading/error alert */}
          {overlayError && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {overlayError}
            </div>
          )}

          {/* Frame Template Selector Carousel / Grid */}
          <FrameSelector
            selectedFrameId={photoState.selectedFrameId}
            onSelectFrame={handleFrameChange}
          />

          {/* Studio Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Interactive Canvas Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="lg:sticky lg:top-28 w-full flex flex-col items-center">
                <FramePreview
                  photoState={photoState}
                  overlayImage={currentOverlay}
                  activeFrame={activeFrame}
                  onPanChange={handlePanChange}
                  onScaleChange={handleScaleChange}
                  onUploadClick={handleUploadClick}
                />

                {/* Reference Artwork Authenticity Inspector trigger */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setShowArtworkModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#A00055] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#A00055]" />
                    <span>View Official Reference Frames</span>
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
                  <span>Upload Your Photo</span>
                </div>

                <PhotoUploader
                  onPhotoLoaded={handlePhotoLoaded}
                  isLoading={isPhotoLoading}
                  setIsLoading={setIsPhotoLoading}
                  hasPhoto={Boolean(photoState.imageElement)}
                />
              </div>

              {/* 2. Photo Controls (Type Name with Autofit, Zoom, Pan, Rotate) */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A00055] px-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#A00055] text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Personalize Name & Framing</span>
                </div>

                <PhotoControls
                  photoState={photoState}
                  activeFrame={activeFrame}
                  onScaleChange={handleScaleChange}
                  onRotateChange={handleRotateChange}
                  onResetPosition={handleResetPosition}
                  onResetAll={handleResetAll}
                  onCornerBackgroundChange={handleCornerBackgroundChange}
                  onToggleGoldenBorder={handleToggleGoldenBorder}
                  onCustomNameChange={handleCustomNameChange}
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
                    overlayImage={currentOverlay}
                    activeFrame={activeFrame}
                  />

                  <WhatsAppShareButton
                    photoState={photoState}
                    overlayImage={currentOverlay}
                    activeFrame={activeFrame}
                  />
                </div>

                {/* Privacy & Trust indicator */}
                <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    Local client-side rendering • High-resolution {activeFrame.width}×{activeFrame.height} PNG
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Floating Action Bar for Mobile Phones (quick download/share when photo is ready) */}
      {photoState.imageElement && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-t border-pink-200/90 shadow-2xl flex items-center gap-2">
          <div className="flex-1">
            <DownloadButton
              photoState={photoState}
              overlayImage={currentOverlay}
              activeFrame={activeFrame}
            />
          </div>
          <div className="flex-1">
            <WhatsAppShareButton
              photoState={photoState}
              overlayImage={currentOverlay}
              activeFrame={activeFrame}
            />
          </div>
        </div>
      )}

      {/* Cultural Heritage and About Convention Section */}
      <AboutEvent />

      {/* Official Reference Artwork Modal */}
      {showArtworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif]">
                  Official Convention Frames
                </h3>
                <p className="text-xs text-slate-500">
                  5 official styles available for Konkani Music Mega Convention 2026
                </p>
              </div>
              <button
                onClick={() => setShowArtworkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVAILABLE_FRAMES.map((f) => (
                <div 
                  key={f.id} 
                  onClick={() => {
                    handleFrameChange(f.id);
                    setShowArtworkModal(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-[#A00055] hover:bg-pink-50/30 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="aspect-[4/4] rounded-xl overflow-hidden bg-white border border-slate-100 p-1 flex items-center justify-center">
                    <img 
                      src={f.thumbnailSrc} 
                      alt={f.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-center">
                    <h5 className="text-xs font-bold text-[#18215B] line-clamp-1">{f.title}</h5>
                    <p className="text-[10px] text-slate-500">{f.width}×{f.height}px</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowArtworkModal(false)}
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Close
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
