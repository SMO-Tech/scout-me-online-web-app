'use client';

import React from 'react';

interface PitchProps {
  children?: React.ReactNode;
}

export default function VerticalPitch({ children }: PitchProps) {
  return (
    <div className="relative w-full h-[500px] bg-[#0f111a] rounded-xl overflow-hidden border-2 border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col ">
      
      {/* Top Label */}
      <div className="absolute top-4 w-full text-center z-10">
        <h3 className="text-[#a5f3fc] font-bold tracking-widest text-sm uppercase drop-shadow-[0_0_5px_rgba(165,243,252,0.8)]">
          Attacking Half
        </h3>
      </div>

      {/* The Pitch SVG Layer */}
      <div className="flex-1 relative mx-6 my-10">
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          preserveAspectRatio="none"
        >
          {/* Main Border */}
          <rect x="0" y="0" width="100" height="130" fill="none" stroke="#22c55e" strokeWidth="1" />
          
          {/* Grid Lines (Horizontal) */}
          <line x1="0" y1="21.6" x2="100" y2="21.6" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="43.3" x2="100" y2="43.3" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" /> {/* Halfway */}
          <line x1="0" y1="86.6" x2="100" y2="86.6" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="108.3" x2="100" y2="108.3" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />

          {/* Grid Lines (Vertical) */}
          <line x1="33" y1="0" x2="33" y2="130" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />
          <line x1="66" y1="0" x2="66" y2="130" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />

          {/* Center Circle */}
          <circle cx="50" cy="65" r="15" fill="none" stroke="#22c55e" strokeWidth="1" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#22c55e" strokeWidth="1" />

          {/* Penalty Areas (Top - Attacking) */}
          <rect x="25" y="0" width="50" height="18" fill="none" stroke="#22c55e" strokeWidth="1" />
          <rect x="38" y="0" width="24" height="6" fill="none" stroke="#22c55e" strokeWidth="1" />
          <path d="M 38,18 A 12,12 0 0,0 62,18" fill="none" stroke="#22c55e" strokeWidth="1" />

          {/* Penalty Areas (Bottom - Defensive) */}
          <rect x="25" y="112" width="50" height="18" fill="none" stroke="#22c55e" strokeWidth="1" />
          <rect x="38" y="124" width="24" height="6" fill="none" stroke="#22c55e" strokeWidth="1" />
          <path d="M 38,112 A 12,12 0 0,1 62,112" fill="none" stroke="#22c55e" strokeWidth="1" />
        </svg>

        {/* Data Overlay Layer */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-6">
          {children}
        </div>
      </div>

      {/* Bottom Label */}
      <div className="absolute bottom-4 w-full text-center z-10">
        <h3 className="text-[#a5f3fc] font-bold tracking-widest text-sm uppercase drop-shadow-[0_0_5px_rgba(165,243,252,0.8)]">
          Defensive Half
        </h3>
      </div>
    </div>
  );
}