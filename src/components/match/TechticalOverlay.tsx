"use client";
import React from 'react';
import { FiLayers } from 'react-icons/fi';

const TacticalOverlay = () => {
  return (
    <div className="relative w-full p-2">
      {/* Outer HUD Frame */}
      <div className="relative bg-black/40 rounded-[2.5rem] p-4 border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
        
        {/* Neon Corners */}
        <div className="absolute -top-1 -left-1 w-12 h-12 border-t-2 border-l-2 border-purple-500 rounded-tl-[2rem] opacity-50" />
        <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-2 border-r-2 border-purple-500 rounded-br-[2rem] opacity-50" />

        {/* Interior Screen */}
        <div className="relative aspect-[4/5] w-full border border-purple-900/30 rounded-2xl bg-[#05060B] flex flex-col items-center justify-center overflow-hidden">
          
          {/* Subtle Scanline Animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500/20 blur-sm animate-pulse" />

          {/* Content */}
          <div className="flex flex-col items-center text-center px-6">
            <FiLayers className="w-12 h-12 text-purple-500/40 mb-4 animate-pulse" />
            
            <div className="space-y-2">
              <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                Data Stream Pending
              </p>
              
              {/* YOUR ORIGINAL TEXT */}
              <p className="bg-gradient-to-r from-purple-500 to-purple-50 bg-clip-text text-transparent font-bold uppercase tracking-widest text-[11px] leading-relaxed">
                Technical overlay of the match, coming soon!
              </p>
            </div>
          </div>

          {/* Bottom HUD Detail */}
          <div className="absolute bottom-8 w-full text-center">
            <span className="text-purple-500/20 text-[8px] font-black uppercase tracking-[0.5em]">
              System Standby
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalOverlay;