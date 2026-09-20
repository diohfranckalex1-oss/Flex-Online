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
      {/* Icon Badge */}
      <div
        className={`${iconDimensions} relative rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/25 flex items-center justify-center shrink-0 transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Stylized Modern 'F' with Speech Network Loop */}
          <path
            d="M9 8C9 6.89543 9.89543 6 11 6H25C26.1046 6 27 6.89543 27 8V9.5C27 10.6046 26.1046 11.5 25 11.5H15V16H22.5C23.6046 16 24.5 16.8954 24.5 18V19.5C24.5 20.6046 23.6046 21.5 22.5 21.5H15V28C15 29.1046 14.1046 30 13 30H11C9.89543 30 9 29.1046 9 28V8Z"
            fill="white"
          />
          {/* Dynamic Connected Node / Pulse Arc */}
          <circle cx="26.5" cy="25.5" r="3.5" fill="#a7f3d0" />
          <path
            d="M20 25.5C20 22 22 20 25 20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Live Status Pulse Beacon */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-xs animate-pulse" />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black ${textSizes} tracking-tight text-neutral-900`}>
              Flex
            </span>
            <span
              className={`font-black ${textSizes} tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}
            >
              Online
            </span>
          </div>
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mt-0.5">
            Social & Messagerie
          </span>
        </div>
      )}
    </div>
  );
};
