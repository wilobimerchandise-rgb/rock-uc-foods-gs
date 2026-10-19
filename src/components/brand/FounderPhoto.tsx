/**
 * ROCK UC FOODS - Founder Photo Component & Sacred Image Manager
 * MASTER RULE: FOUNDER PHOTO IS SACRED - USE EXACT UPLOAD, NO AI FACE.
 *
 * Hardcodes the exact founder photo public URL with no crop, filter, or AI alterations.
 * Provides Owner direct upload / editing capabilities for future updates.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, RotateCcw, X, CheckCircle, AlertCircle } from 'lucide-react';
import {
  getActiveFounderPhotoUrl,
  saveFounderPhoto,
  removeFounderPhoto,
} from '../../lib/founderStorage';

export interface FounderPhotoProps {
  className?: string;
  allowUpload?: boolean;
}

export const EXACT_FOUNDER_URL =
  'https://visrhvtqeolqduupfckw.supabase.co/storage/v1/object/public/founders/founder-original.jpg';

export const FounderPhotoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeCustom = getActiveFounderPhotoUrl();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (JPG, PNG, WEBP).' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image size must be under 10MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      setFeedback(null);
    };
    reader.onerror = () => {
      setFeedback({ type: 'error', message: 'Failed to read image file. Please try again.' });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!preview) return;
    try {
      saveFounderPhoto(preview);
      setFeedback({ type: 'success', message: 'Preferred founder photo updated across all brand pages!' });
      setTimeout(() => {
        onClose();
      }, 900);
    } catch {
      setFeedback({ type: 'error', message: 'Storage quota exceeded. Please choose a smaller image file.' });
    }
  };

  const handleReset = () => {
    removeFounderPhoto();
    setPreview(null);
    setFeedback({ type: 'success', message: 'Reset to original sacred founder photo.' });
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="founder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-[#17120F] border border-[#D4AF37]/50 rounded-xl max-w-lg w-full p-6 text-[#F7EFD9] shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#D4AF37]" />
            <h3 id="founder-modal-title" className="font-serif font-bold text-lg text-[#F7EFD9]">
              Owner Founder Photo Editor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3 rounded mb-4 text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'error'
                ? 'bg-[#B3261E] text-white'
                : 'bg-[#6B1230] text-[#F7EFD9] border border-[#D4AF37]/50'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 text-[#D4AF37]" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Current / Preview Image Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0B0A09] p-4 rounded-lg border border-white/10">
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-[12px] border border-[#D4AF37]/50 shadow">
              <img
                src={preview || activeCustom || EXACT_FOUNDER_URL}
                alt="Founder - Rock UC Foods"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
            <div className="text-xs space-y-1 text-center sm:text-left">
              <span className="font-semibold text-[#D4AF37] block">
                {preview ? 'New Photo Preview' : activeCustom ? 'Custom Upload Active' : 'Default Sacred Photo Active'}
              </span>
              <p className="text-[#F7EFD9]/70 leading-relaxed text-[11px]">
                {preview
                  ? 'Click "Save Preferred Photo" to apply across all brand touchpoints.'
                  : 'Upload your preferred high-resolution photo. It will be preserved exactly as uploaded.'}
              </p>
              <div className="pt-1 text-[10px] text-[#F7EFD9]/40 italic">
                Rule: No AI faces, no filters, no aspect ratio distortion.
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#17120F] border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#F7EFD9] px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 flex-1 hover:bg-[#D4AF37]/10 transition-colors"
            >
              <Upload className="w-4 h-4 text-[#D4AF37]" /> Select Preferred Image
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#6B1230] border border-[#D4AF37]/60 hover:bg-[#85163C] text-[#F7EFD9] px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 flex-1 shadow"
              >
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Save Preferred Photo
              </button>
            )}

            {activeCustom && !preview && (
              <button
                type="button"
                onClick={handleReset}
                className="bg-black/40 border border-white/20 hover:border-white/40 text-white/80 px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Original
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FounderPhoto: React.FC<FounderPhotoProps> = ({ className = '', allowUpload = false }) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(() => getActiveFounderPhotoUrl() || EXACT_FOUNDER_URL);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const custom = getActiveFounderPhotoUrl();
      setCurrentUrl(custom || EXACT_FOUNDER_URL);
      setLoadFailed(false);
    };

    window.addEventListener('founder-photo-updated', handleUpdate);
    return () => window.removeEventListener('founder-photo-updated', handleUpdate);
  }, []);

  const imageSrc = loadFailed ? '/founders/founder-original.jpg' : currentUrl;

  return (
    <>
      <div className={`relative group overflow-hidden rounded-[12px] border border-[#D4AF37]/40 shadow-xl ${className}`}>
        <img
          src={imageSrc}
          alt="Founder - Rock UC Foods"
          onError={() => {
            if (!loadFailed) setLoadFailed(true);
          }}
          style={{ width: '100%', objectFit: 'cover', borderRadius: '12px' }}
        />

        {allowUpload && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            aria-label="Upload preferred founder photo"
            className="absolute bottom-2 right-2 bg-[#17120F]/90 hover:bg-[#6B1230] text-[#D4AF37] hover:text-white border border-[#D4AF37]/60 rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur shadow-lg transition-all opacity-85 hover:opacity-100"
          >
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Change Photo</span>
          </button>
        )}
      </div>

      {showModal && (
        <FounderPhotoModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
