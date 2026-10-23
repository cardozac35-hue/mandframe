import React, { useState } from 'react';
import { Share2, MessageCircle, Download, Check, AlertCircle, X } from 'lucide-react';
import { PhotoState, FrameOption } from '../types';
import { generateHighResBlob, triggerFileDownload } from '../utils/imageComposition';

interface WhatsAppShareButtonProps {
  photoState: PhotoState;
  overlayImage: HTMLImageElement | null;
  activeFrame: FrameOption;
}

export const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({
  photoState,
  overlayImage,
  activeFrame,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'fallback' | 'info'>('fallback');

  const hasPhoto = Boolean(photoState.imageElement);

  const shareText =
    'I am proud to be part of the First World Konkani Music Mega Convention 2026! Join the celebration of Konkani music, culture, and heritage.';

  const handleShare = async () => {
    if (!hasPhoto || !overlayImage) return;

    setIsProcessing(true);

    try {
      const filename = `Konkani-Music-Convention-${activeFrame.id}.png`;
      const blob = await generateHighResBlob(photoState, overlayImage, activeFrame);
      const file = new File([blob], filename, { type: 'image/png' });

      // Check if Web Share API with files is supported
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        try {
          await navigator.share({
            files: [file],
            title: 'Konkani Music Mega Convention 2026',
            text: shareText,
          });
          setIsProcessing(false);
          return;
        } catch (shareErr: unknown) {
          // If user aborted/cancelled share dialog, do nothing
          if (shareErr instanceof Error && shareErr.name === 'AbortError') {
            setIsProcessing(false);
            return;
          }
          // Otherwise fall back to WhatsApp URL + Download
        }
      }

      // Fallback: Download completed image and open WhatsApp web/app
      triggerFileDownload(blob, filename);

      const encodedMsg = encodeURIComponent(shareText);
      const waUrl = `https://wa.me/?text=${encodedMsg}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Show explanatory modal to inform visitor to attach the downloaded picture
      setModalType('fallback');
      setShowModal(true);

    } catch (err) {
      console.error('WhatsApp share error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        disabled={!hasPhoto || isProcessing}
        className={`w-full py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 border cursor-pointer ${
          !hasPhoto
            ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
            : isProcessing
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 cursor-wait'
            : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white border-emerald-600 shadow-sm hover:shadow-md hover:shadow-emerald-500/25'
        }`}
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>
          {isProcessing ? 'Preparing WhatsApp Share…' : 'Share on WhatsApp'}
        </span>
      </button>

      {/* Helpful Fallback Instruction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-pink-100 space-y-4 animate-scale-up relative">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#18215B] font-['Outfit',sans-serif]">
                Your Photo Frame Is Saved!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                We have downloaded <strong className="text-[#A00055]">Konkani-Music-Convention-{activeFrame.id}.png</strong> to your device and opened WhatsApp.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Check className="w-4 h-4" /> Next Step in WhatsApp:
              </div>
              <p>
                Simply click the paperclip / camera icon inside your WhatsApp chat or status and select the downloaded photo from your downloads folder.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#A00055] to-[#D41472] text-white hover:opacity-95 transition-opacity cursor-pointer shadow-md"
            >
              Got it, thanks!
            </button>

          </div>
        </div>
      )}
    </>
  );
};
