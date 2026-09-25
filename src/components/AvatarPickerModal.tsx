import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Camera,
  Trash2,
  Check,
  Sparkles,
  User,
  Link as LinkIcon,
  AlertCircle,
} from 'lucide-react';
import { AVATAR_PRESETS, processAvatarImage } from '../utils/avatarUtils';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  onSelectAvatar: (avatarUrl: string | undefined) => void;
  title?: string;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSelectAvatar,
  title = 'Student Profile Photo',
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>(currentAvatarUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock background body scroll while Avatar Picker is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const compressedDataUrl = await processAvatarImage(file, 256);
      setSelectedUrl(compressedDataUrl);
      onSelectAvatar(compressedDataUrl);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to process photo.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePresetSelect = (url: string) => {
    setSelectedUrl(url);
    onSelectAvatar(url);
    onClose();
  };

  const handleRemovePhoto = () => {
    setSelectedUrl(undefined);
    onSelectAvatar(undefined);
    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedUrl(customUrl.trim());
    onSelectAvatar(customUrl.trim());
    onClose();
  };

  return (
    <div
      id="avatar-picker-backdrop"
      className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Upload your picture or pick a student avatar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto overscroll-contain flex-1 touch-pan-y">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Avatar Preview & Quick Actions */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-sm bg-indigo-50 flex items-center justify-center shrink-0">
              {selectedUrl ? (
                <img
                  src={selectedUrl}
                  alt="Student Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-9 h-9 text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold text-slate-800">
                {selectedUrl ? 'Selected Photo / Avatar' : 'No photo uploaded yet'}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Processing...' : 'Upload from Device'}</span>
                </button>

                {selectedUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preset Avatars Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Choose Preset Student Avatar (තෝරන්න)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">10 options</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url)}
                    className={`group relative rounded-2xl p-1.5 border-2 transition-all cursor-pointer flex flex-col items-center justify-center bg-white shadow-2xs hover:shadow-sm ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 mt-1 truncate max-w-full text-center">
                      {preset.name.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Web URL Option */}
          <div className="pt-2 border-t border-slate-100">
            {!showUrlInput ? (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Or use photo web link (URL මගින් photo එක් කරන්න)</span>
              </button>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Paste Photo Link (Image URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-black text-white font-bold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Done (අවසන්)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
