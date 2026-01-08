'use client';

import React from 'react';

interface PitchProps {
  children?: React.ReactNode;
}

export default function VerticalPitch({ children }: PitchProps) {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-[#0d4f3c] via-[#0f6b4f] to-[#0d4f3c] rounded-xl overflow-hidden border-2 border-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)] flex flex-col">
      
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
          {/* <line x1="0" y1="21.6" x2="100" y2="21.6" stroke="#22c55e" strokeWidth="" opacity="0.6" />
          <line x1="0" y1="43.3" x2="100" y2="43.3" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" /> {/* Halfway */}
          {/* <line x1="0" y1="86.6" x2="100" y2="86.6" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="108.3" x2="100" y2="108.3" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" /> */} 

          {/* Grid Lines (Vertical) - 4 columns with corner gaps for merged cells */}
          {/* Left vertical line - gap at top (rows 1-2) and bottom (rows 5-6) */}
          {/* <line x1="25" y1="43.3" x2="25" y2="86.6" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" /> */}
          {/* Center vertical line - full height */}
          {/* <line x1="50" y1="0" x2="50" y2="130" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" /> */}
          {/* Right vertical line - gap at top (rows 1-2) and bottom (rows 5-6) */}
          {/* <line x1="75" y1="43.3" x2="75" y2="86.6" stroke="#22c55e" strokeWidth="0.5" opacity="0.6" /> */}

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

        {/* Data Overlay Layer - 4 columns × 6 rows */}
        {/* Ensure no cell merging - each cell is independent */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(6, 1fr)' }}>
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