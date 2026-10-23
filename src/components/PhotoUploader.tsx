import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { validateImageFile, loadImageFromFile } from '../utils/imageValidation';

interface PhotoUploaderProps {
  onPhotoLoaded: (file: File | null, img: HTMLImageElement, url: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  hasPhoto: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotoLoaded,
  isLoading,
  setIsLoading,
  hasPhoto,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    setIsLoading(true);
    try {
      const { img, url } = await loadImageFromFile(file);
      onPhotoLoaded(file, img, url);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to process the photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // Reset input value so re-uploading the same file still triggers onChange
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs accessible via ref or ID */}
      <input
        id="main-photo-file-input"
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Error message banner */}
      {errorMessage && (
        <div className="mb-4 p-3 sm:p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Upload Error: </span>
            {errorMessage}
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-600 font-bold px-1"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {!hasPhoto ? (
        /* Empty State Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-8 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-[#A00055] bg-pink-50/80 scale-[1.01]'
              : 'border-pink-200 bg-white hover:border-[#D41472]/60 hover:bg-pink-50/20'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3.5 sm:space-y-4">
            
            {/* Animated Upload Icon */}
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#A00055]/10 via-[#D41472]/15 to-[#D9A52E]/10 flex items-center justify-center text-[#A00055] shadow-xs">
              <Upload className={`w-7 h-7 sm:w-8 sm:h-8 ${isLoading ? 'animate-bounce' : ''}`} />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#18215B] font-['Outfit',sans-serif]">
                Upload Your Picture
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose a portrait photo or take a selfie to place in the frame.
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                Supports JPG, PNG, WEBP (Max 10 MB) • 100% Client-Side Privacy
              </p>
            </div>

            {/* Mobile-Friendly Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-1 w-full max-w-xs sm:max-w-none mx-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#A00055] via-[#D41472] to-[#A00055] bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-md shadow-[#A00055]/25 hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose from Gallery</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl font-semibold text-sm text-[#18215B] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                <Camera className="w-4 h-4" />
                <span>Take Selfie / Camera</span>
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* Re-upload bar when photo already exists */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-pink-50/70 border border-pink-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#18215B]">
              Photo loaded in event frame
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#A00055] bg-white border border-pink-200 hover:bg-pink-50 active:bg-pink-100 transition-colors cursor-pointer shadow-xs min-h-[38px]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer shadow-xs min-h-[38px]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>New Selfie</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
