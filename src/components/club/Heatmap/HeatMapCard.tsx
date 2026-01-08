'use client';

import VerticalPitch from "./VerticlaPitch";

// Letter to Grid Position Mapping (A-T for 20 cells with merged corners)
// Grid is 4 Columns × 6 Rows = 20 cells (4 corner cells span 2 rows each)
// 
// LAYOUT:
// Row 1-2: [A (spans 2 rows)] [B] [C] [D (spans 2 rows)]
//          [   merged      ] [E] [F] [   merged       ]
// Row 3:   [G]               [H] [I] [J]
// Row 4:   [K]               [L] [M] [N]
// Row 5-6: [O (spans 2 rows)] [P] [Q] [R (spans 2 rows)]
//          [   merged      ] [S] [T] [   merged       ]

interface ZoneCell {
  letter: string;
  row: number;      // Grid row start (1-based)
  col: number;      // Grid column (1-based)
  rowSpan: number;  // How many rows this cell spans
}

// Define all 20 cells with their grid positions
const ZONE_CELLS: ZoneCell[] = [
  // Row 1-2 (top section)
  { letter: 'A', row: 1, col: 1, rowSpan: 2 },  // Top-left corner (merged)
  { letter: 'B', row: 1, col: 2, rowSpan: 1 },  // Top row, col 2
  { letter: 'C', row: 1, col: 3, rowSpan: 1 },  // Top row, col 3
  { letter: 'D', row: 1, col: 4, rowSpan: 2 },  // Top-right corner (merged)
  { letter: 'E', row: 2, col: 2, rowSpan: 1 },  // Row 2, col 2
  { letter: 'F', row: 2, col: 3, rowSpan: 1 },  // Row 2, col 3
  
  // Row 3 (middle section)
  { letter: 'G', row: 3, col: 1, rowSpan: 1 },
  { letter: 'H', row: 3, col: 2, rowSpan: 1 },
  { letter: 'I', row: 3, col: 3, rowSpan: 1 },
  { letter: 'J', row: 3, col: 4, rowSpan: 1 },
  
  // Row 4 (middle section)
  { letter: 'K', row: 4, col: 1, rowSpan: 1 },
  { letter: 'L', row: 4, col: 2, rowSpan: 1 },
  { letter: 'M', row: 4, col: 3, rowSpan: 1 },
  { letter: 'N', row: 4, col: 4, rowSpan: 1 },
  
  // Row 5-6 (bottom section)
  { letter: 'O', row: 5, col: 1, rowSpan: 2 },  // Bottom-left corner (merged)
  { letter: 'P', row: 5, col: 2, rowSpan: 1 },  // Row 5, col 2
  { letter: 'Q', row: 5, col: 3, rowSpan: 1 },  // Row 5, col 3
  { letter: 'R', row: 5, col: 4, rowSpan: 2 },  // Bottom-right corner (merged)
  { letter: 'S', row: 6, col: 2, rowSpan: 1 },  // Row 6, col 2
  { letter: 'T', row: 6, col: 3, rowSpan: 1 },  // Row 6, col 3
];

interface ZoneHeatmapProps {
  heatmapData?: Record<string, number>; // API data format: { "A": 5, "B": 1, "C": 2, ... }
  maxValue?: number; // Optional: max value for opacity calculation
}

export default function ZoneHeatmap({ heatmapData, maxValue }: ZoneHeatmapProps) {
  // Use API data if provided, otherwise use example data for testing
  const exampleData: Record<string, number> = heatmapData || {
    // Row 1-2 (top merged corners + middle cells)
    'A': 5,   // Top-left corner (merged rows 1-2)
    'B': 1,   // Row 1, col 2
    'C': 2,   // Row 1, col 3
    'D': 5,   // Top-right corner (merged rows 1-2)
    'E': 2,   // Row 2, col 2
    'F': 2,   // Row 2, col 3
    
    // Row 3
    'G': 11,  // Row 3, col 1
    'H': 6,   // Row 3, col 2
    'I': 4,   // Row 3, col 3
    'J': 7,   // Row 3, col 4
    
    // Row 4
    'K': 13,  // Row 4, col 1
    'L': 7,   // Row 4, col 2
    'M': 4,   // Row 4, col 3
    'N': 10,  // Row 4, col 4
    
    // Row 5-6 (bottom merged corners + middle cells)
    'O': 5,   // Bottom-left corner (merged rows 5-6)
    'P': 3,   // Row 5, col 2
    'Q': 2,   // Row 5, col 3
    'R': 3,   // Bottom-right corner (merged rows 5-6)
    'S': 4,   // Row 6, col 2
    'T': 4,   // Row 6, col 3
  };

  // Calculate max value for opacity
  const allValues = Object.values(exampleData);
  const calculatedMaxValue = maxValue || Math.max(...allValues, 1);

  return (
    <div className="w-full max-w-md mx-auto">
      <VerticalPitch>
        {/* Render all 20 cells with proper grid placement */}
        {ZONE_CELLS.map((cell) => {
          const value = exampleData[cell.letter] || 0;
          const opacity = value > 0 ? Math.min(value / calculatedMaxValue, 1) : 0;
          
          return (
            <div 
              key={cell.letter}
              className="relative flex items-center justify-center"
              style={{ 
                gridColumn: cell.col,
                gridRow: cell.rowSpan > 1 ? `${cell.row} / span ${cell.rowSpan}` : cell.row,
              }}
            >
              {value > 0 && (
                <>
                  {/* Yellow-green gradient glow based on intensity */}
                  <div 
                    className="absolute inset-1 rounded-sm"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        rgba(200, 230, 80, ${opacity * 0.5}) 0%, 
                        rgba(34, 197, 94, ${opacity * 0.4}) 100%)`,
                      boxShadow: `inset 0 0 20px rgba(200, 230, 80, ${opacity * 0.3})`
                    }}
                  />
                  
                  {/* Percentage text */}
                  <span className="relative z-10 text-white font-bold text-lg md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {value}%
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