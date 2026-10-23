import React, { useState } from 'react';
import { Download, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotoState, DownloadStatus, FrameOption } from '../types';
import { generateHighResBlob, triggerFileDownload } from '../utils/imageComposition';

interface DownloadButtonProps {
  photoState: PhotoState;
  overlayImage: HTMLImageElement | null;
  activeFrame: FrameOption;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  photoState,
  overlayImage,
  activeFrame,
}) => {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasPhoto = Boolean(photoState.imageElement);

  const handleDownload = async () => {
    if (!hasPhoto || !overlayImage) return;

    setStatus('preparing');
    setErrorMessage(null);

    try {
      // Allow UI thread to show preparing state
      await new Promise((r) => setTimeout(r, 120));

      const blob = await generateHighResBlob(photoState, overlayImage, activeFrame);
      triggerFileDownload(blob, `Konkani-Music-Convention-${activeFrame.id}.png`);

      setStatus('ready');

      // Trigger celebratory confetti burst!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#A00055', '#D41472', '#D9A52E', '#E5F6FF'],
        });
      } catch {
        // Confetti is purely decorative
      }

      // Reset back to idle after 3.5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3500);

    } catch (err) {
      console.error('Download error:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to export image.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-2 p-2 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={!hasPhoto || status === 'preparing'}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md cursor-pointer ${
          !hasPhoto
            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
            : status === 'preparing'
            ? 'bg-pink-700 text-white cursor-wait opacity-90'
            : status === 'ready'
            ? 'bg-emerald-600 text-white shadow-emerald-500/25'
            : 'bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#A00055] bg-[length:200%_auto] hover:bg-right text-white shadow-[#A00055]/30 hover:shadow-lg hover:shadow-[#A00055]/40 hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {!hasPhoto ? (
          <>
            <Download className="w-5 h-5 opacity-40" />
            <span>Upload a Photo First</span>
          </>
        ) : status === 'preparing' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Preparing Your Image…</span>
          </>
        ) : status === 'ready' ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>Your Photo Is Ready!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5 text-amber-300" />
            <span>Download My Photo</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono text-amber-200">
              PNG • {activeFrame.width}×{activeFrame.height}px
            </span>
          </>
        )}
      </button>
    </div>
  );
};
