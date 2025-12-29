'use client';

import VerticalPitch from "./VerticlaPitch";



// Data mapping: Defines which grid cell (row/col) gets which percentage
// Grid is 3 Columns x 6 Rows based on the pitch lines
const ZONE_DATA = [
  // Row 1 (Top / Attacking Box)
  { row: 1, col: 2, value: 25 }, // Top Left-ish
  { row: 1, col: 3, value: 35 }, // Top Right-ish (Highest heat)
  
  // Row 2
  { row: 2, col: 2, value: 12 },
  { row: 2, col: 3, value: 13 },
  
  // Row 3
  { row: 3, col: 1, value: 7 },
  { row: 3, col: 2, value: 7 },
  
  // Row 4 (Midfield)
  { row: 4, col: 3, value: 2 },
];

export default function ZoneHeatmap() {
  return (
    <div className="w-full max-w-md mx-auto">
      <VerticalPitch >
        {/* Generate empty grid cells, fill only those with data */}
        {Array.from({ length: 18 }).map((_, index) => {
          const row = Math.floor(index / 3) + 1;
          const col = (index % 3) + 1;
          
          // Find if we have data for this specific cell
          const zone = ZONE_DATA.find(z => z.row === row && z.col === col);
          
          return (
            <div 
              key={index} 
              className="relative flex items-center justify-center border border-transparent"
            >
              {zone && (
                <>
                  {/* The Green Glow Background - Opacity based on value */}
                  <div 
                    className="absolute inset-1 bg-[#22c55e] blur-md rounded-full"
                    style={{ opacity: zone.value / 60 }} // Dynamic intensity
                  />
                  
                  {/* The Text */}
                  <span className="relative z-10 text-white font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {zone.value}<span className="text-sm align-top">%</span>
                  </span>
                </>
              )}
            </div>
          );
        })}
      </VerticalPitch>
    </div>
  );
}