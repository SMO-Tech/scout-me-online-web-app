'use client';

import VerticalPitch from "./VerticlaPitch";



// Data mapping: Defines which grid cell (row/col) gets which percentage
// Grid is 4 Columns × 6 Rows
// Columns: 1=Left Wing, 2=Left Half-space, 3=Right Half-space, 4=Right Wing
// Rows: 1=Attacking Final Third, 2=Just Outside Box, 3=Upper Midfield, 4=Lower Midfield, 5=Defensive Third, 6=Goal Area
const ZONE_DATA = [
  // Row 1 (Attacking Final Third) - Only middle columns active
  { row: 1, col: 2, value: 25 }, // Left half-space
  { row: 1, col: 3, value: 35 }, // Right half-space (Highest heat)
  
  // Row 2 (Just Outside the Box) - Only middle columns active
  { row: 2, col: 2, value: 12 }, // Left half-space
  { row: 2, col: 3, value: 13 }, // Right half-space
  
  // Row 3 (Upper Midfield) - Only middle columns active
  { row: 3, col: 2, value: 7 }, // Left half-space
  { row: 3, col: 3, value: 7 }, // Right half-space
  
  // Row 4 (Lower Midfield / Center Circle Overlap) - Only column 3 active
  { row: 4, col: 3, value: 2 }, // Right half-space
  
  // Row 5 & 6: All columns inactive (no data)
];

export default function ZoneHeatmap() {
  return (
    <div className="w-full max-w-md mx-auto">
      <VerticalPitch >
        {/* Generate empty grid cells, fill only those with data */}
        {/* 4 columns × 6 rows = 24 cells */}
        {Array.from({ length: 24 }).map((_, index) => {
          const row = Math.floor(index / 4) + 1;
          const col = (index % 4) + 1;
          
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