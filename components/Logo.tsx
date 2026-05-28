import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom stylized gradient logo icon */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_2px_4px_rgba(240,80,35,0.15)]"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F25B2A" />
            <stop offset="40%" stopColor="#DE421B" />
            <stop offset="100%" stopColor="#7E1715" />
          </linearGradient>
        </defs>
        {/* Rounded square container */}
        <rect width="38" height="38" rx="10" fill="url(#logoGrad)" />
        {/* Stylized white 'V' */}
        <path
          d="M10.5 11.5H16.2L19 19.5L21.8 11.5H27.5L21.8 26.5H16.2L10.5 11.5Z"
          fill="white"
        />
      </svg>
      {/* VedaAI typography */}
      <span className="font-bricolage text-[22px] font-bold tracking-tight text-[#1E1E1E]">
        VedaAI
      </span>
    </div>
  );
}
