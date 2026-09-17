import React from 'react';

interface WatsonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const WatsonLogo: React.FC<WatsonLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
}) => {
  const hatSizes = {
    sm: { w: 22, h: 14 },
    md: { w: 32, h: 20 },
    lg: { w: 48, h: 30 },
    xl: { w: 64, h: 40 },
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const currentHat = hatSizes[size];

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Fedora Hat Icon */}
      <svg
        width={currentHat.w}
        height={currentHat.h}
        viewBox="0 0 64 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white drop-shadow-sm mb-1"
      >
        {/* Crown with fedora crease */}
        <path
          d="M17 25C17 25 18 10 24 9C29 8 32 14 35 14C38 14 40 8 45 9C50 10 51 25 51 25H17Z"
          fill="currentColor"
        />
        {/* Ribbon / Band */}
        <path
          d="M16.5 24H51.5C51.8 25.8 51 27.5 50.5 28H17C16.5 27.5 15.8 25.8 16.5 24Z"
          fill="#18181b"
        />
        {/* Curved Brim */}
        <path
          d="M4 29C14 26 22 28 32 28C42 28 50 26 60 29C62 29.6 63 31.5 61 32.5C54 35.5 44 36.5 32 36.5C20 36.5 10 35.5 3 32.5C1 31.5 2 29.6 4 29Z"
          fill="currentColor"
        />
      </svg>

      {/* Brand Text */}
      <div className="flex items-center tracking-tight font-black text-white font-sans">
        <span className="text-[0.65em] font-bold mr-1 tracking-normal text-zinc-400">SR</span>
        <span className={`${textSizes[size]} tracking-wider font-extrabold uppercase`}>
          WATSON
        </span>
      </div>

      {showSubtitle && (
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.28em] text-zinc-400 uppercase mt-1">
          INVESTIGAÇÃO CORPORATIVA
        </span>
      )}
    </div>
  );
};
