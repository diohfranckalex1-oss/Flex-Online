import React from 'react';

interface FlexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const FlexLogo: React.FC<FlexLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div id="flex-online-logo" className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Badge: Royal Violet Flex Online Emblem */}
      <div
        className={`${iconDimensions} relative rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-600 p-[1.5px] shadow-lg shadow-violet-600/35 flex items-center justify-center shrink-0 transition-transform hover:scale-105`}
      >
        <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center p-1.5 relative overflow-hidden">
          {/* Luminous violet glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/40 via-fuchsia-600/20 to-transparent" />
          
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10"
          >
            {/* Elegant F monogram with interlocking pulse ribbons */}
            <path
              d="M10 8C10 6.89543 10.8954 6 12 6H26C27.1046 6 28 6.89543 28 8C28 9.10457 27.1046 10 26 10H16V15H24C25.1046 15 26 15.8954 26 17C26 18.1046 25.1046 19 24 19H16V28C16 29.1046 15.1046 30 14 30C12.8954 30 12 29.1046 12 28V8Z"
              fill="url(#flex-grad-f)"
            />
            {/* Dynamic Energy Wave Node */}
            <circle cx="25.5" cy="25.5" r="3.5" fill="#a855f7" className="animate-pulse" />
            <path
              d="M19 25.5C19 22 22 19 25.5 19"
              stroke="#c084fc"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="flex-grad-f" x1="10" y1="6" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#e9d5ff" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Live Status Pulse Beacon */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-violet-400 border-2 border-neutral-900 shadow-xs animate-ping opacity-75" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-neutral-900 shadow-xs" />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-black ${textSizes} tracking-tight text-white`}>
              Flex
            </span>
            <span
              className={`font-black ${textSizes} tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent`}
            >
              Online
            </span>
          </div>
          <span className="text-[9px] font-bold text-violet-300/80 tracking-widest uppercase mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block animate-pulse" />
            Réseau Officiel 5 Étoiles
          </span>
        </div>
      )}
    </div>
  );
};
