'use client';

import React from 'react'

const GoalDistributionCard = () => {
  return (
    <div className="bg-[#0f111a] p-6 rounded-xl border border-[#1b1c28] shadow-2xl mb-6">
      <div className="flex flex-col items-center">
        
        {/* TOP HEADER */}
        <div className="mb-2">
           <span className="text-xs font-bold tracking-widest uppercase text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
             Over: <span className="text-white">18%</span>
           </span>
        </div>

        {/* MAIN ROW: LEFT TEXT - GOAL - RIGHT TEXT */}
        <div className="flex items-center justify-center w-full gap-4">
            
            {/* WIDE LEFT */}
            <div className="text-right w-20">
                <span className="block text-[10px] font-bold text-white uppercase leading-tight">
                    Wide <br/> Left: 10%
                </span>
            </div>

            {/* THE GOAL GRID */}
            <div className="relative w-full max-w-[280px] h-32">
               {/* Neon Goal Frame Outer Glow */}
               <div className="absolute inset-0 border-t-[3px] border-l-[3px] border-r-[3px] border-purple-500 rounded-t-xl shadow-[0_0_20px_rgba(168,85,247,0.8)] box-border"></div>
               
               {/* Inner Grid Container */}
               <div className="absolute inset-[3px] grid grid-cols-4 grid-rows-2">
                  {/* Row 1 */}
                  <div className="border-r border-b border-purple-900/50 flex items-center justify-center text-gray-500 font-mono text-sm">0%</div>
                  <div className="border-r border-b border-purple-900/50 flex items-center justify-center text-white font-mono text-lg font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">18%</div>
                  <div className="border-r border-b border-purple-900/50 flex items-center justify-center text-gray-500 font-mono text-sm">0%</div>
                  <div className="border-b border-purple-900/50 flex items-center justify-center text-gray-500 font-mono text-sm">0%</div>

                  {/* Row 2 */}
                  <div className="border-r border-purple-900/50 flex items-center justify-center text-gray-500 font-mono text-sm">0%</div>
                  <div className="border-r border-purple-900/50 flex items-center justify-center text-gray-400 font-mono text-sm font-semibold">9%</div>
                  <div className="border-r border-purple-900/50 flex items-center justify-center text-white font-mono text-lg font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">18%</div>
                  <div className="flex items-center justify-center text-gray-500 font-mono text-sm">0%</div>
               </div>
            </div>

            {/* WIDE RIGHT */}
            <div className="text-left w-20">
                <span className="block text-[10px] font-bold text-white uppercase leading-tight">
                    Wide <br/> Right: 16%
                </span>
            </div>
        </div>

        {/* BOTTOM PURPLE LINE (Ground) */}
        <div className="w-full h-[2px] bg-purple-600 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.8)] max-w-[360px]"></div>
      </div>
    </div>
  )
}

export default GoalDistributionCard