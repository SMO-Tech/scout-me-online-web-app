'use client';

import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiChevronRight } from "react-icons/fi";

// --- MOCK DATA ---
const MATCHES = [
  // Upcoming
  { id: 1, opponent: "London City FC", date: "Oct 24", time: "15:00", status: "Upcoming", venue: "Home", league: "Regional League" },
  { id: 2, opponent: "Westside United", date: "Oct 31", time: "18:30", status: "Upcoming", venue: "Away", league: "Cup Semi-Final" },
  
  // Past Results
  { id: 3, opponent: "North Star", date: "Oct 10", score: "3 - 1", status: "Win", venue: "Away", league: "Regional League" },
  { id: 4, opponent: "Eastern Eagles", date: "Oct 03", score: "2 - 2", status: "Draw", venue: "Home", league: "Regional League" },
  { id: 5, opponent: "Royal Knights", date: "Sep 26", score: "0 - 1", status: "Loss", venue: "Away", league: "Friendly" },
  { id: 6, opponent: "South Coast FC", date: "Sep 19", score: "4 - 0", status: "Win", venue: "Home", league: "Regional League" },
  { id: 7, opponent: "Athletic Club", date: "Sep 12", score: "1 - 2", status: "Loss", venue: "Away", league: "Regional League" },
];

export default function MatchesView() {
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Results'>('All');

  // Filter Logic
  const displayMatches = MATCHES.filter(m => {
    if (filter === 'Upcoming') return m.status === 'Upcoming';
    if (filter === 'Results') return m.status !== 'Upcoming';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. HEADER & FILTER BAR */}
      <div className="bg-[#1b1c28] border border-[#3b3e4e] p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
        <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiCalendar className="text-purple-400" /> Match Center
            </h2>
            <p className="text-xs text-gray-500 mt-1">Season 2025/2026</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-[#252834] rounded-lg p-1 gap-1 border border-[#3b3e4e]">
          {['All', 'Upcoming', 'Results'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`
                px-4 py-1.5 text-xs font-bold rounded transition-all
                ${filter === tab 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MATCH LIST */}
      <div className="space-y-3">
        {displayMatches.map((match) => (
          <div 
            key={match.id} 
            className="bg-[#1b1c28] border border-[#3b3e4e] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between hover:border-purple-500/30 transition group shadow-md"
          >
            
            {/* LEFT: Date & Opponent */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
               {/* Date Box */}
               <div className="flex flex-col items-center justify-center w-14 h-14 bg-[#252834] rounded-xl border border-[#3b3e4e] text-gray-400 group-hover:text-white group-hover:border-purple-500/30 transition shrink-0">
                  <span className="text-[10px] uppercase font-bold text-purple-400">{match.date.split(' ')[0]}</span>
                  <span className="text-xl font-black leading-none">{match.date.split(' ')[1]}</span>
               </div>
               
               {/* Opponent Info */}
               <div>
                 <h3 className="font-bold text-white text-lg">{match.opponent}</h3>
                 <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded border font-semibold ${match.venue === 'Home' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                      {match.venue}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                        • {match.league}
                    </span>
                 </div>
               </div>
            </div>

            {/* RIGHT: Score or Time */}
            <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center mt-3 sm:mt-0 gap-6 border-t sm:border-t-0 border-[#2b2e3d] pt-3 sm:pt-0">
              
              {/* Venue Icon (Mobile only extra context) */}
              <div className="sm:hidden text-gray-500 text-xs flex items-center gap-1">
                 <FiMapPin /> {match.venue === 'Home' ? 'The Data Arena' : 'Away'}
              </div>

              {match.status === 'Upcoming' ? (
                // Upcoming View
                <div className="flex items-center gap-2 text-gray-300 bg-[#252834] px-4 py-2 rounded-lg border border-[#3b3e4e]">
                  <FiClock className="text-purple-400"/> <span className="font-bold font-mono">{match.time}</span>
                </div>
              ) : (
                // Result View
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    {match.score}
                  </span>
                  <StatusBadge status={match.status} />
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// Helper Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Win: "text-green-400 bg-green-500/10 border-green-500/20",
    Loss: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    Draw: "text-gray-400 bg-gray-500/10 border-gray-500/20"
  }[status] || "text-gray-400";

  return (
    <div className={`
        w-10 h-10 rounded-full flex items-center justify-center border text-[10px] font-black uppercase
        ${styles}
    `}>
        {status.substring(0, 1)}
    </div>
  );
};