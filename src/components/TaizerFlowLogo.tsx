import React from 'react';

interface SpeakFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  glow?: boolean;
}

export const SpeakFlowLogo: React.FC<SpeakFlowLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  glow = true,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 rounded-3xl',
  }[size];

  const titleSizes = {
    sm: 'text-sm sm:text-base font-extrabold',
    md: 'text-base sm:text-xl font-extrabold sm:font-black',
    lg: 'text-xl sm:text-3xl font-black',
    xl: 'text-2xl sm:text-4xl font-black',
  }[size];

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Visual Logo Mark */}
      <div
        className={`relative ${iconDimensions} bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-1.5 sm:p-2 shadow-[0_4px_18px_rgba(15,23,42,0.2)] ring-1 ring-slate-800/80 shrink-0 overflow-hidden group`}
      >
        {/* Ambient Glow */}
        {glow && (
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/25 via-cyan-500/25 to-indigo-500/25 rounded-full blur-md pointer-events-none" />
        )}

        {/* SVG SpeakFlow Fluid Mark (S-Wave + Acoustic Resonance) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(6,182,212,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sf-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="sf-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* Fluid S-Curve Sound Wave */}
          <path
            d="M 68 22 C 48 18 26 28 26 44 C 26 58 44 60 56 64 C 68 68 74 74 74 82 C 74 92 58 96 42 92 C 34 90 28 85 24 80"
            stroke="url(#sf-wave-grad)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Audio Resonance / Voice Waves */}
          <line
            x1="71"
            y1="39"
            x2="71"
            y2="57"
            stroke="url(#sf-wave-grad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="82"
            y1="33"
            x2="82"
            y2="63"
            stroke="url(#sf-pulse-grad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="92"
            y1="41"
            x2="92"
            y2="55"
            stroke="url(#sf-pulse-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Voice Core Nodes */}
          <circle cx="26" cy="44" r="4.5" fill="#ffffff" />
          <circle cx="70" cy="22" r="4" fill="#ffffff" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="leading-tight shrink min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`${titleSizes} tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent whitespace-nowrap`}
            >
              Speak<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Flow</span>
            </span>
            <span className="text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-md hidden md:inline-block">
              Fluency
            </span>
          </div>
          {showSubtitle && (
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block whitespace-nowrap">
              Active English Learning
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const TaizerFlowLogo = SpeakFlowLogo;
