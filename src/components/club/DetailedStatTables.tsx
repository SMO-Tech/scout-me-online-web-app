'use client';

import React from 'react';
import { FiMoreVertical, FiCheckCircle, FiCircle } from "react-icons/fi";

// --- Types & Mock Data ---

type ThemeColor = 'purple' | 'cyan' | 'pink' | 'green';

interface PlayerStat {
  name: string;
  fraction: string; // e.g., "25/29"
  percentage: number;
}

interface CategoryData {
  title: string;
  theme: ThemeColor;
  summary: {
    fig: number;
    avg: number;
    trend: number; // The percentage on the right
  };
  players: PlayerStat[];
}

const DATA: CategoryData[] = [
  {
    title: "Attempts",
    theme: "purple",
    summary: { fig: 185, avg: 185, trend: 0 },
    players: [
      { name: "Kleanthus Pieri", fraction: "25/29", percentage: 60 },
      { name: "Panagiotis Constantinou", fraction: "22/24", percentage: 10 },
      { name: "Kylian Mbappé", fraction: "20/22", percentage: 100 },
      { name: "Pelé", fraction: "17/21", percentage: 100 },
      { name: "Diego", fraction: "13/14", percentage: 25 },
      { name: "Zinedine Zidane", fraction: "13/14", percentage: 40 },
    ]
  },
  {
    title: "Shot On T",
    theme: "cyan",
    summary: { fig: 158, avg: 158, trend: 85.41 },
    players: [
      { name: "Kleanthus Pieri", fraction: "25/29", percentage: 60 },
      { name: "Panagiotis Constantinou", fraction: "22/24", percentage: 10 },
      { name: "Kylian Mbappé", fraction: "20/22", percentage: 100 },
      { name: "Pelé", fraction: "17/21", percentage: 100 },
      { name: "Diego", fraction: "13/14", percentage: 25 },
      { name: "Zinedine Zidane", fraction: "13/14", percentage: 40 },
    ]
  },
  {
    title: "Shot Off T",
    theme: "pink",
    summary: { fig: 27, avg: 27, trend: 60 },
    players: [
      { name: "Kleanthus Pieri", fraction: "25/29", percentage: 60 },
      { name: "Panagiotis Constantinou", fraction: "22/24", percentage: 10 },
      { name: "Kylian Mbappé", fraction: "20/22", percentage: 100 },
      { name: "Pelé", fraction: "17/21", percentage: 100 },
      { name: "Diego", fraction: "13/14", percentage: 25 },
      { name: "Zinedine Zidane", fraction: "13/14", percentage: 40 },
    ]
  },
  {
    title: "Goal",
    theme: "green",
    summary: { fig: 5, avg: 1, trend: 0.8 },
    players: [
      { name: "Kleanthus Pieri", fraction: "25/29", percentage: 60 },
      { name: "Panagiotis Constantinou", fraction: "22/24", percentage: 10 },
      { name: "Kylian Mbappé", fraction: "20/22", percentage: 100 },
      { name: "Pelé", fraction: "17/21", percentage: 100 },
      // Empty rows for visual balance if needed
    ]
  }
];

// --- Helper: Color Mapping ---
const getColorClasses = (theme: ThemeColor) => {
  switch (theme) {
    case 'cyan': return { 
        text: 'text-cyan-400', 
        bg: 'bg-cyan-500', 
        border: 'border-cyan-500/50',
        glow: 'shadow-[0_0_10px_rgba(34,211,238,0.2)]'
    };
    case 'pink': return { 
        text: 'text-fuchsia-400', 
        bg: 'bg-fuchsia-500', 
        border: 'border-fuchsia-500/50',
        glow: 'shadow-[0_0_10px_rgba(232,121,249,0.2)]'
    };
    case 'green': return { 
        text: 'text-green-400', 
        bg: 'bg-green-500', 
        border: 'border-green-500/50',
        glow: 'shadow-[0_0_10px_rgba(74,222,128,0.2)]'
    };
    case 'purple': default: return { 
        text: 'text-purple-400', 
        bg: 'bg-purple-500', 
        border: 'border-purple-500/50', 
        glow: 'shadow-[0_0_10px_rgba(168,85,247,0.2)]'
    };
  }
};


export default function DetailedStatTables() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {DATA.map((col) => {
        const colors = getColorClasses(col.theme);
        
        return (
          <div key={col.title} className="space-y-4">
            
            {/* 1. TOP SUMMARY CARD */}
            <div className={`
                bg-[#151720] rounded-xl p-5 border border-[#2b2e3d] 
                ${col.theme === 'cyan' ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : ''} 
                relative overflow-hidden
            `}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-md font-bold tracking-wide ${colors.text}`}>
                        {col.title}
                    </h3>
                    <FiMoreVertical className="text-gray-500 cursor-pointer hover:text-white" />
                </div>
                
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Fig: <span className="text-white text-sm">{col.summary.fig}</span></div>
                    </div>
                    
                    <div className="text-center">
                         <div className="text-xs text-gray-400 mb-1">Avg <span className={colors.text}>{col.summary.avg}</span></div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-bold text-white">{col.summary.trend}%</div>
                        {/* Progress Bar Mini */}
                        <div className="w-12 h-1 bg-gray-700 rounded-full mt-1">
                            <div 
                                className={`h-full rounded-full ${colors.bg}`} 
                                style={{ width: `${Math.min(col.summary.trend, 100)}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PLAYER TABLE CARD */}
            <div className="bg-[#151720] rounded-xl border border-[#2b2e3d] p-4 min-h-[400px]">
                
                {/* Table Header Filters */}
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-gray-400 mb-4 border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-1 text-green-400 cursor-pointer">
                        <FiCheckCircle size={12} />
                        <span>Most Frequent</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer transition">
                        <FiCircle size={12} />
                        <span>Highest %</span>
                    </div>
                    <div className="ml-auto">
                        <FiMoreVertical size={14} />
                    </div>
                </div>

                {/* Columns Label */}
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-2 px-1">
                    <span>Players</span>
                    <span className="text-center w-12">Stats</span>
                    <span className="text-right w-16">Attempts %</span>
                </div>

                {/* Rows */}
                <div className="space-y-3">
                    {col.players.map((player, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-1 group cursor-pointer hover:bg-white/5 rounded py-1 transition">
                            
                            {/* Name */}
                            <span className="text-xs text-gray-200 font-medium truncate group-hover:text-white">
                                {player.name}
                            </span>
                            
                            {/* Fraction (e.g. 25/29) */}
                            <span className={`text-xs font-mono font-bold text-center w-12 ${colors.text}`}>
                                {player.fraction}
                            </span>
                            
                            {/* Percentage Bar */}
                            <div className="w-16 text-right">
                                <span className="text-xs font-bold text-white block mb-0.5">
                                    {player.percentage}%
                                </span>
                                <div className="h-[3px] bg-gray-700 rounded-full w-full">
                                    <div 
                                        className={`h-full rounded-full ${colors.bg}`} 
                                        style={{ width: `${player.percentage}%` }} 
                                    />
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}