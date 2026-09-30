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
      {/* Icon Badge: Deep Teal & Turquoise Flex Online Proprietary Emblem (#0F6E56 - #1D9E75) */}
      <div
        className={`${iconDimensions} relative rounded-2xl bg-gradient-to-tr from-[#0F6E56] via-[#148366] to-[#1D9E75] p-[1.5px] shadow-lg shadow-teal-950/60 flex items-center justify-center shrink-0 transition-transform hover:scale-105`}
      >
        <div className="w-full h-full bg-[#0d1815] rounded-[14px] flex items-center justify-center p-1.5 relative overflow-hidden">
          {/* Luminous teal & dark emerald ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1D9E75]/30 via-[#0F6E56]/20 to-transparent" />
          
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10"
          >
            {/* Proprietary Cybernetic Robot Head & Interlocking F Shield */}
            {/* Outer Armor Crest */}
            <path
              d="M7 8C7 6.34315 8.34315 5 10 5H26C27.6569 5 29 6.34315 29 8V18C29 25 21 30.5 18 31.5C15 30.5 7 25 7 18V8Z"
              stroke="url(#flex-teal-shield-grad)"
              strokeWidth="1.75"
              fill="#081411"
              fillOpacity="0.8"
            />
            {/* Futuristic Interlocking F Structure */}
            <path
              d="M12 9.5H24C24.8284 9.5 25.5 10.1716 25.5 11C25.5 11.8284 24.8284 12.5 24 12.5H15V16H22C22.8284 16 23.5 16.6716 23.5 17.5C23.5 18.3284 22.8284 19 22 19H15V26C15 26.8284 14.3284 27.5 13.5 27.5C12.6716 27.5 12 26.8284 12 26V9.5Z"
              fill="url(#flex-teal-grad)"
            />
            {/* Robotic Optical Visor Eye (Cyber Core) */}
            <rect
              x="17"
              y="20.5"
              width="8"
              height="3"
              rx="1.5"
              fill="#5eead4"
              className="animate-pulse"
            />
            <circle cx="21" cy="22" r="1" fill="#ffffff" />

            <defs>
              <linearGradient id="flex-teal-shield-grad" x1="7" y1="5" x2="29" y2="31.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1D9E75" />
                <stop offset="0.5" stopColor="#5eead4" />
                <stop offset="1" stopColor="#0F6E56" />
              </linearGradient>
              <linearGradient id="flex-teal-grad" x1="12" y1="9.5" x2="25.5" y2="27.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.4" stopColor="#a7f3d0" />
                <stop offset="0.8" stopColor="#1D9E75" />
                <stop offset="1" stopColor="#0F6E56" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Live Status Pulse Beacon */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-[#0d1815] shadow-xs animate-ping opacity-75" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#1D9E75] border-2 border-[#0d1815] shadow-xs" />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-black ${textSizes} tracking-tight text-white`}>
              Flex
            </span>
            <span
              className={`font-black ${textSizes} tracking-tight bg-gradient-to-r from-teal-300 via-[#1D9E75] to-emerald-400 bg-clip-text text-transparent`}
            >
              Online
            </span>
          </div>
          <span className="text-[9px] font-bold text-teal-300/80 tracking-widest uppercase mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse" />
            Réseau Officiel 5 Étoiles
          </span>
        </div>
      )}
    </div>
  );
};
