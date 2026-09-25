import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TaizerFlowLogo } from './TaizerFlowLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'laptop'>('mobile');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          setInstallSuccess(true);
          return;
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    }
    // If prompt is not available (e.g., iOS Safari or in iframe), open the install guide modal
    setShowModal(true);
  };

  return (
    <>
      {/* Bottom Download & Install Card / Action Bar */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.18)] border border-slate-800">
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Left: Info */}
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold backdrop-blur-md border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>PWA • Install On Any Device</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Download SpeakFlow App (Phone & Laptop)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Install as a native application on your Android, iPhone, Windows PC, or Mac. Enjoy lightning-fast startup, distraction-free fullscreen practice, and active offline caching!
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 animate-bounce" />
                <span>{isInstalled ? 'App Installed • Open App' : 'Download / Install App'}</span>
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1 text-slate-300">
                  <Smartphone className="w-4 h-4" />
                  <span>/</span>
                  <Laptop className="w-4 h-4" />
                </div>
                <span>How to Install</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Modal for Phone & Laptop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 text-slate-900 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <TaizerFlowLogo size="sm" showSubtitle={false} />
              <h3 className="text-xl font-black text-slate-900 pt-2">
                Install SpeakFlow on your Device
              </h3>
              <p className="text-xs text-slate-500">
                Works instantly without App Store / Play Store login.
              </p>
            </div>

            {/* Device Switcher Tabs */}
            <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'mobile'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Phone (Android / iOS)</span>
              </button>
              <button
                onClick={() => setActiveTab('laptop')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'laptop'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Laptop className="w-4 h-4 text-indigo-600" />
                <span>Laptop & PC (Windows / Mac)</span>
              </button>
            </div>

            {/* Tab 1: Phone Instructions */}
            {activeTab === 'mobile' && (
              <div className="space-y-3.5 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/70 text-xs sm:text-sm">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Android (Chrome / Samsung Internet):</span>
                </div>
                <p className="pl-7 text-slate-600 leading-relaxed">
                  Tap the browser menu <strong className="text-slate-800">(⋮)</strong> at the top-right and select <strong className="text-emerald-700">"Install app"</strong> or <strong className="text-emerald-700">"Add to Home screen"</strong>.
                </p>

                <div className="font-bold text-slate-800 flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>iPhone / iPad (Safari):</span>
                </div>
                <p className="pl-7 text-slate-600 leading-relaxed">
                  Tap the <strong className="text-slate-800">Share icon</strong> (<Share2 className="w-3.5 h-3.5 inline text-sky-600" />), scroll down and tap <strong className="text-sky-700">"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-sky-600" />).
                </p>
              </div>
            )}

            {/* Tab 2: Laptop & Desktop Instructions */}
            {activeTab === 'laptop' && (
              <div className="space-y-3.5 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/70 text-xs sm:text-sm">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Chrome / Edge / Brave:</span>
                </div>
                <p className="pl-7 text-slate-600 leading-relaxed">
                  Look at the right side of the browser URL / address bar at the top for the <strong className="text-indigo-700">Install icon (⊕ or ⬇)</strong> and click it.
                </p>

                <div className="font-bold text-slate-800 flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Via Browser Menu:</span>
                </div>
                <p className="pl-7 text-slate-600 leading-relaxed">
                  Click the 3 dots menu <strong className="text-slate-800">(⋮)</strong> ➔ Click <strong className="text-indigo-700">"Cast, save, and share"</strong> ➔ Click <strong className="text-indigo-700">"Install SpeakFlow"</strong>.
                </p>
              </div>
            )}

            {/* Footer buttons inside modal */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fast, secure & virus-free</span>
              </div>

              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Direct Install Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
