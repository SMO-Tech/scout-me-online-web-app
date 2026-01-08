'use client';

import React from 'react'

interface ShotTrajectoryCardProps {
  donutData?: {
    attacking?: { total: number; failed: number; successful: number };
    defensive?: { total: number; failed: number; successful: number };
  };
  hasData?: boolean;
}

const ShotTrajectoryCard = ({ donutData, hasData }: ShotTrajectoryCardProps) => {
  // Calculate blocked percentage from donut data
  const blockedPercentage = donutData?.defensive?.total 
    ? ((donutData.defensive.failed / donutData.defensive.total) * 100).toFixed(1)
    : '0';

  if (!hasData || !donutData) {
    return (
      <div className="bg-[#0f111a] p-6 rounded-xl border border-[#1b1c28] shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-xs font-bold tracking-widest uppercase text-white">
            Blocked: 0%
          </span>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-gray-400 text-sm">No data available</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#0f111a] p-6 rounded-xl border border-[#1b1c28] shadow-2xl">
        
        {/* HEADER */}
        <div className="text-center mb-6">
            <span className="text-xs font-bold tracking-widest uppercase text-white">
                Blocked: {blockedPercentage}%
            </span>
        </div>

        <div className="space-y-10">
            
            {/* 1. TOP VIEW (PITCH MAP) */}
            <div className="relative h-48 w-full border border-blue-900/30 rounded-lg bg-[#0a0c10] overflow-hidden shadow-inner">
                {/* Field Markings */}
                <svg viewBox="0 0 200 100" className="w-full h-full opacity-60">
                    <rect x="10" y="5" width="180" height="90" fill="none" stroke="#1e3a8a" strokeWidth="1"/>
                    <line x1="100" y1="5" x2="100" y2="95" stroke="#1e3a8a" strokeWidth="1"/> {/* Center Line */}
                    <circle cx="100" cy="50" r="15" fill="none" stroke="#1e3a8a" strokeWidth="1"/>
                    
                    {/* Goal Area Left */}
                    <rect x="10" y="25" width="25" height="50" fill="none" stroke="#1e3a8a" strokeWidth="1"/>
                    <rect x="10" y="38" width="8" height="24" fill="none" stroke="#1e3a8a" strokeWidth="1"/>
                    
                    {/* Goal Area Right */}
                    <rect x="165" y="25" width="25" height="50" fill="none" stroke="#1e3a8a" strokeWidth="1"/>
                    <rect x="182" y="38" width="8" height="24" fill="none" stroke="#1e3a8a" strokeWidth="1"/>
                </svg>

                {/* Shot Vectors Overlay */}
                <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full">
                    {/* Top Cyan Shot */}
                    <line x1="20" y1="35" x2="60" y2="25" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(6,182,212,1)]" />
                    <circle cx="20" cy="35" r="2.5" fill="#06b6d4" className="drop-shadow-[0_0_4px_rgba(6,182,212,1)]" />

                    {/* Middle Pink Shot */}
                    <line x1="20" y1="50" x2="80" y2="35" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(232,121,249,1)]" />
                    <circle cx="20" cy="50" r="2.5" fill="#e879f9" className="drop-shadow-[0_0_4px_rgba(232,121,249,1)]" />
                    
                    {/* Bottom Cyan Shot */}
                    <line x1="20" y1="65" x2="80" y2="80" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(6,182,212,1)]" />
                    <circle cx="20" cy="65" r="2.5" fill="#06b6d4" className="drop-shadow-[0_0_4px_rgba(6,182,212,1)]" />
                </svg>
            </div>


            {/* 2. PERSPECTIVE VIEW (BOTTOM BEAMS) - UPDATED */}
            <div className="relative h-[220px] w-full flex justify-center items-end overflow-hidden rounded-lg bg-[#0a0c10]/50 border border-blue-900/20">
                 <svg viewBox="0 0 400 220" className="w-full h-full">
                    <defs>
                        {/* Glow Filters for Neon Effect */}
                        <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <filter id="glowPink" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* --- BACKGROUND FIELD LINES (Dark Blue) --- */}
                    <g stroke="#1e3a8a" strokeWidth="1.5" fill="none" opacity="0.8">
                        {/* Ground Line */}
                        <line x1="20" y1="60" x2="380" y2="60" />
                        
                        {/* Goal Area Box (Outer) */}
                        <polyline points="50,60 50,150 350,150 350,60" />
                        
                        {/* 6-Yard Box (Inner) */}
                        <polyline points="120,60 120,100 280,100 280,60" />

                        {/* Penalty Arc */}
                        <path d="M 160,150 Q 200,180 240,150" />
                        
                        {/* Corner flags */}
                        <path d="M 20,60 L 20,40 M 380,60 L 380,40" strokeWidth="1"/>
                    </g>

                    {/* --- THE GOAL MOUTH --- */}
                    <rect x="140" y="20" width="120" height="40" stroke="#3b82f6" strokeWidth="2" fill="#1e3a8a" fillOpacity="0.3" />
                    {/* Net lines */}
                    <line x1="180" y1="20" x2="180" y2="60" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5"/>
                    <line x1="220" y1="20" x2="220" y2="60" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5"/>
                    <line x1="140" y1="40" x2="260" y2="40" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5"/>


                    {/* --- THE BEAMS (Trajectories) --- */}
                    
                    {/* Beam 1: Pink (Far Left) */}
                    <g filter="url(#glowPink)">
                        <line x1="120" y1="220" x2="135" y2="25" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="135" cy="25" r="4" fill="#e879f9" />
                    </g>

                    {/* Beam 2: Cyan (Left) */}
                    <g filter="url(#glowCyan)">
                        <line x1="160" y1="200" x2="155" y2="35" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="155" cy="35" r="4" fill="#06b6d4" />
                    </g>

                    {/* Beam 3: Cyan (Center) */}
                    <g filter="url(#glowCyan)">
                        <line x1="200" y1="180" x2="190" y2="35" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="190" cy="35" r="4" fill="#06b6d4" />
                    </g>

                    {/* Beam 4: Cyan (Right) */}
                    <g filter="url(#glowCyan)">
                        <line x1="220" y1="220" x2="230" y2="35" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="230" cy="35" r="4" fill="#06b6d4" />
                    </g>

                    {/* Beam 5: Pink (Far Right) */}
                    <g filter="url(#glowPink)">
                        <line x1="260" y1="160" x2="265" y2="25" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="265" cy="25" r="4" fill="#e879f9" />
                    </g>
                 </svg>
            </div>

        </div>
    </div>
  )
}

export default ShotTrajectoryCard