"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  FiUser, FiCalendar, FiMapPin, FiShield, 
  FiClock, FiDatabase, FiCopy, FiCheck, FiAlertCircle, FiLock 
} from 'react-icons/fi'
import { useFetchPlayerProfile } from '@/hooks'
// Import the custom hook we created


const PlayerProfileView = () => {
  const params = useParams()
  const playerId = params.id as string
  const [copied, setCopied] = useState(false)

  // 1. CALL THE CUSTOM HOOK
  // This replaces your entire useEffect and manual fetchPlayer logic
  const { data: player, isLoading } = useFetchPlayerProfile(playerId);

  const getAge = (dob?: string) => {
    if (!dob || dob === "01-01-1900") return "N/A";
    try {
      const [day, month, year] = dob.split("-").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age > 0 ? `${age} Years` : "N/A";
    } catch (e) { return "N/A"; }
  };

  // 2. HANDLE LOADING STATE
  if (isLoading) return <div className="p-8 animate-pulse bg-[#1b1c28] rounded-2xl h-64" />
  
  // 3. HANDLE EMPTY STATE
  if (!player) return (
    <div className="p-12 text-center bg-[#1b1c28] rounded-2xl border border-[#3b3e4e]">
      <p className="text-gray-400">Player profile not found.</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. IDENTITY HEADER */}
      <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative">
            <div className="w-36 h-36 bg-[#14151b] rounded-3xl flex items-center justify-center border-2 border-[#3b3e4e] overflow-hidden shadow-2xl">
              {player.avatar ? (
                <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-purple-500/50 flex flex-col items-center">
                   <FiUser size={50} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="mb-6">
              <h1 className="text-4xl font-black text-white uppercase mb-2">
                {player.firstName} <span className="text-purple-500">{player.lastName}</span>
              </h1>
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase px-3 py-1 bg-[#14151b] rounded-lg border border-[#3b3e4e]">
                {player.primaryPosition || 'Prospect'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1.5"><FiMapPin className="text-purple-500" /> Nationality</span>
                <p className="text-sm font-semibold text-gray-200">{player.country || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1.5"><FiCalendar className="text-purple-500" /> Age</span>
                <p className="text-sm font-semibold text-gray-200">{getAge(player.dateOfBirth)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1.5"><FiShield className="text-purple-500" /> Status</span>
                <p className={`text-sm font-bold ${player.status === 'UNCLAIMED' ? 'text-orange-400' : 'text-green-400'}`}>
                  {player.status}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1.5"><FiClock className="text-purple-500" /> Registered</span>
                <p className="text-sm font-semibold text-gray-200">{player.createdAt ? new Date(player.createdAt).getFullYear() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UNCLAIMED NOTICE */}
      {player.status === "UNCLAIMED" && (
        <div className="bg-[#1b1c28] border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-dashed">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
              <FiAlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold flex items-center justify-center md:justify-start gap-2">
                Unverified Profile
                <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded uppercase tracking-tighter">Development</span>
              </h4>
              <p className="text-gray-400 text-sm">Self-service profile claiming and identity verification is coming soon.</p>
            </div>
          </div>
          <button 
            disabled 
            className="px-6 py-2 bg-gray-800 text-gray-500 font-bold rounded-xl flex items-center gap-2 cursor-not-allowed border border-gray-700 whitespace-nowrap"
          >
            <FiLock size={14} /> Claim (Coming Soon)
          </button>
        </div>
      )}

      {/* 3. DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase text-gray-500 mb-6 flex items-center gap-2 tracking-widest">
            <FiDatabase className="text-purple-500" /> Registry Details
          </h3>
          <div className="space-y-5">      
            <div className="flex justify-between items-center py-1 text-sm">
              <span className="text-gray-400">Ownership</span>
              <span className="text-white font-medium">{player.ownerId ? 'Assigned' : 'Open Access'}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-2xl p-6 lg:col-span-2 shadow-sm">
          <h3 className="text-xs font-black uppercase text-gray-500 mb-4 tracking-widest">Bio & Narrative</h3>
          <p className="text-gray-300 leading-relaxed text-sm">
            Registry data for <span className="text-white font-bold">{player.firstName} {player.lastName}</span> confirms their primary role as a <span className="text-purple-400 font-bold">{player.primaryPosition}</span>. 
            The athlete is currently registered in <span className="text-white">{player.country}</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 pt-6 border-t border-[#3b3e4e]">
            {[player.primaryPosition, player.country, player.status].filter(Boolean).map(tag => (
              <span key={tag} className="bg-[#14151b] text-gray-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-[#3b3e4e] uppercase">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfileView