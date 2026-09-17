import React from 'react';

interface SysTestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SysTestLogo: React.FC<SysTestLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: { w: 18, h: 18 },
    md: { w: 24, h: 24 },
    lg: { w: 36, h: 36 },
    xl: { w: 48, h: 48 },
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  const currentIcon = iconSizes[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Kali / Cyber Terminal Shield Icon */}
      <div className="relative shrink-0 flex items-center justify-center p-1.5 rounded-lg bg-[#0d131f] border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.12)]">
        <svg
          width={currentIcon.w}
          height={currentIcon.h}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Outline */}
          <path
            d="M12 2L4 5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5L12 2Z"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Terminal prompt symbol >_ */}
          <path
            d="M8.5 9L11.5 12L8.5 15"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 15H16"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-mono">
          <span className={`font-black tracking-wider text-white uppercase ${textSizes[size]}`}>
            SYS<span className="text-amber-400">TEST</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#131b28] text-cyan-400 border border-cyan-800/40">
            v0.1
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase font-medium">
            Visual Security Laboratory
          </span>
        )}
      </div>
    </div>
  );
};
