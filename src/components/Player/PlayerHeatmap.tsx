'use client';

import React from 'react';
import VerticalPitch from '@/components/club/Heatmap/VerticlaPitch';

// Zone mapping: Maps letter zones (A, B, C, etc.) to grid positions (row, col)
// Grid is 3 columns x 6 rows (3 rows per half)
// Top 3 rows = Attacking Half, Bottom 3 rows = Defensive Half
// Layout: Left (col 1) | Center (col 2) | Right (col 3)
const ZONE_MAPPING: Record<string, { row: number; col: number }> = {
  // Attacking Half (Top 3 rows - rows 1-3)
  // Row 1 (Top, closest to attacking goal)
  'A': { row: 1, col: 1 }, // Top Left
  'B': { row: 1, col: 2 }, // Top Center
  'C': { row: 1, col: 3 }, // Top Right
  
  // Row 2 (Middle of attacking half)
  'D': { row: 2, col: 1 }, // Mid Left
  'E': { row: 2, col: 2 }, // Mid Center
  'F': { row: 2, col: 3 }, // Mid Right
  'G': { row: 2, col: 2 }, // Alternative center mapping
  
  // Row 3 (Bottom of attacking half, near center)
  'H': { row: 3, col: 1 }, // Bottom Left
  'I': { row: 3, col: 2 }, // Bottom Center
  'J': { row: 3, col: 3 }, // Bottom Right
  'K': { row: 3, col: 1 }, // Alternative left
  'L': { row: 3, col: 3 }, // Alternative right
  'M': { row: 3, col: 2 }, // Alternative center
  'N': { row: 3, col: 2 }, // Alternative center
  
  // Defensive Half (Bottom 3 rows - rows 4-6)
  // Row 4 (Top of defensive half, near center)
  'O': { row: 4, col: 1 }, // Top Left
  'P': { row: 4, col: 2 }, // Top Center
  'Q': { row: 4, col: 3 }, // Top Right
  
  // Row 5 (Middle of defensive half)
  'R': { row: 5, col: 1 }, // Mid Left
  'S': { row: 5, col: 2 }, // Mid Center
  'T': { row: 5, col: 3 }, // Mid Right
  
  // Row 6 (Bottom, closest to defensive goal)
  'U': { row: 6, col: 1 }, // Bottom Left
  'V': { row: 6, col: 2 }, // Bottom Center
  'W': { row: 6, col: 3 }, // Bottom Right
  'X': { row: 6, col: 1 }, // Alternative left
  'Y': { row: 6, col: 3 }, // Alternative right
  'Z': { row: 6, col: 2 }, // Alternative center
  
  // Handle empty string as center zones
  '': { row: 3, col: 2 }, // Default to center of attacking half
};

interface PlayerHeatmapProps {
  heatmapData: Record<string, number>;
  title: string;
  color: string; // Color for the heat (e.g., '#10b981' for emerald, '#06b6d4' for cyan)
}

export default function PlayerHeatmap({ heatmapData, title, color }: PlayerHeatmapProps) {
  // Convert heatmap data to zone data with grid positions
  const zoneData = Object.entries(heatmapData)
    .map(([zone, value]) => {
      const position = ZONE_MAPPING[zone];
      if (!position) return null;
      
      return {
        row: position.row,
        col: position.col,
        value: value,
        zone: zone
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Find max value for opacity calculation
  const maxValue = Math.max(...Object.values(heatmapData), 1);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2" style={{ color }}>
          {title}
        </h3>
      </div>
      <div className="w-full max-w-md mx-auto">
        <VerticalPitch>
          {/* Generate grid cells and fill with data */}
          {Array.from({ length: 18 }).map((_, index) => {
            const row = Math.floor(index / 3) + 1;
            const col = (index % 3) + 1;
            
            // Find zone data for this cell
            // If multiple zones map to same cell, sum them or take max
            const zones = zoneData.filter(z => z.row === row && z.col === col);
            const totalValue = zones.length > 0 
              ? zones.reduce((sum, z) => sum + z.value, 0) 
              : 0;
            
            // Determine if this is attacking or defensive half
            const isAttackingHalf = row <= 3;
            
            return (
              <div 
                key={index} 
                className="relative flex items-center justify-center border border-transparent"
              >
                {totalValue > 0 && (
                  <>
                    {/* The Glow Background - Opacity based on value */}
                    <div 
                      className="absolute inset-1 rounded-full blur-md"
                      style={{ 
                        backgroundColor: color,
                        opacity: Math.min(totalValue / maxValue, 0.8) // Dynamic intensity, max 80% opacity
                      }}
                    />
                    
                    {/* The Text */}
                    <span 
                      className="relative z-10 text-white font-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                      {totalValue.toFixed(1)}<span className="text-xs align-top">%</span>
                    </span>
                  </>
                )}
                {/* Show empty zones in defensive half if no data (as per image) */}
                {totalValue === 0 && !isAttackingHalf && (
                  <div className="absolute inset-0 bg-[#22c55e]/10 rounded" />
                )}
              </div>
            );
          })}
        </VerticalPitch>
      </div>
    </div>
  );
}

