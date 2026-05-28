import React from "react";

export default function EmptyStateIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width="280"
        height="260"
        viewBox="0 0 280 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <defs>
          {/* Subtle drop shadow for the white document card */}
          <filter id="docShadow" x="80" y="50" width="115" height="135" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.06" />
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.04" />
          </filter>
          {/* Shadow for the magnifying glass */}
          <filter id="glassShadow" x="120" y="70" width="130" height="130" filterUnits="userSpaceOnUse">
            <feDropShadow dx="2" dy="8" stdDeviation="10" floodColor="#4C3A75" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* 1. Large soft circular backdrop */}
        <circle cx="140" cy="120" r="92" fill="#EAEAEA" opacity="0.6" />

        {/* 2. Left side loop/squiggle decoration */}
        <path
          d="M 68 135 C 50 120 40 100 60 90 C 78 82 85 105 70 120 C 52 135 38 105 55 85 C 65 75 75 80 80 82"
          stroke="#1C2E3D"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* 3. Small badge/window on the top right */}
        <g transform="translate(195, 68)">
          <rect width="40" height="24" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1" />
          {/* Mock content blocks */}
          <rect x="5" y="5" width="10" height="14" rx="2.5" fill="#E8E5EE" />
          <rect x="20" y="8" width="15" height="3" rx="1.5" fill="#D8DCE3" />
          <rect x="20" y="13" width="10" height="3" rx="1.5" fill="#D8DCE3" />
        </g>

        {/* 4. White document card with custom filter drop shadow */}
        <g filter="url(#docShadow)">
          <rect x="110" y="72" width="67" height="87" rx="8" fill="white" />
          
          {/* Text block lines inside the document */}
          {/* Title bar */}
          <rect x="120" y="82" width="22" height="6" rx="2" fill="#1C2E3D" />
          
          {/* Content lines */}
          <rect x="120" y="96" width="47" height="3.5" rx="1.75" fill="#EEF0F3" />
          <rect x="120" y="105" width="47" height="3.5" rx="1.75" fill="#EEF0F3" />
          <rect x="120" y="114" width="47" height="3.5" rx="1.75" fill="#EEF0F3" />
          <rect x="120" y="123" width="36" height="3.5" rx="1.75" fill="#EEF0F3" />
          <rect x="120" y="132" width="42" height="3.5" rx="1.75" fill="#EEF0F3" />
          <rect x="120" y="141" width="20" height="3.5" rx="1.75" fill="#EEF0F3" />
        </g>

        {/* 5. Blue sparkle star bottom-left */}
        <path
          d="M 68 180 L 70.5 186.5 L 77 189 L 70.5 191.5 L 68 198 L 65.5 191.5 L 59 189 L 65.5 186.5 Z"
          fill="#3B7CB3"
        />

        {/* 6. Solid blue dot on the right */}
        <circle cx="218" cy="158" r="4.5" fill="#3B7CB3" />

        {/* 7. Magnifying Glass with Handle & Red 'X' center */}
        <g filter="url(#glassShadow)">
          {/* Handle */}
          <line
            x1="184"
            y1="144"
            x2="216"
            y2="176"
            stroke="#D6CBE8"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          {/* Lens rim */}
          <circle cx="162" cy="122" r="32" stroke="#E1D8EF" strokeWidth="6" fill="#F8F7FC" fillOpacity="0.25" />
          
          {/* Inner circle with white X (Red cross button) */}
          <circle cx="162" cy="122" r="16.5" fill="#FF3B30" />
          {/* The X symbol inside */}
          <path
            d="M 156.5 116.5 L 167.5 127.5 M 167.5 116.5 L 156.5 127.5"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
