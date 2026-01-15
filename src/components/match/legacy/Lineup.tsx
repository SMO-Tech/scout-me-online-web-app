'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FiLoader, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi'
import { useFetchLegacyMatchResult } from '@/hooks'

// ==========================================
// 1. TYPES
// ==========================================
interface LineupPlayer {
  id: string
  name: string
  number: string | number
  position: string
  avatar?: string
}

// ==========================================
// 2. HELPER: Position Mapping (Pitch Coordinates)
// ==========================================
const getPositionStyle = (pos: string) => {
  const p = pos ? pos.toUpperCase().replace('-', '').replace(' ', '') : ''

  // Goalkeeper
  if (p === 'GK') return { top: '10%', left: '50%' }

  // Defense
  if (p === 'LB') return { top: '25%', left: '85%' }
  if (p === 'LCB') return { top: '25%', left: '65%' }
  if (p === 'CB') return { top: '25%', left: '50%' }
  if (p === 'RCB') return { top: '25%', left: '35%' }
  if (p === 'RB') return { top: '25%', left: '15%' }

  // Defensive Midfield
  if (p === 'DM' || p === 'CDM') return { top: '42%', left: '50%' }
  if (p === 'LDM') return { top: '42%', left: '65%' }
  if (p === 'RDM') return { top: '42%', left: '35%' }

  // Central Midfield
  if (p === 'LM') return { top: '50%', left: '85%' }
  if (p === 'LCM') return { top: '50%', left: '65%' }
  if (p === 'CM') return { top: '50%', left: '50%' }
  if (p === 'RCM') return { top: '50%', left: '35%' }
  if (p === 'RM') return { top: '50%', left: '15%' }

  // Attacking Midfield
  if (p === 'CAM' || p === 'AM') return { top: '60%', left: '50%' }

  // Forwards / Wings
  if (p === 'LW' || p === 'LWF') return { top: '75%', left: '85%' }
  if (p === 'RW' || p === 'RWF') return { top: '75%', left: '15%' }
  if (p === 'ST' || p === 'CF') return { top: '82%', left: '50%' }
  if (p === 'LS') return { top: '82%', left: '60%' }
  if (p === 'RS') return { top: '82%', left: '40%' }

  // Fallback
  return { top: '50%', left: '50%' }
}

// ==========================================
// 3. HELPER: Data Transformation
// ==========================================
const transformLineup = (apiLineup: any[]): LineupPlayer[] => {
  if (!Array.isArray(apiLineup)) return []
  return apiLineup.map((p, index) => ({
    id: `${p.player_name}-${p.jersy_number}-${index}`,
    name: p.player_name,
    number: p.jersy_number,
    position: p.position,
    avatar: p.avatar // Pass if available, otherwise undefined
  }))
}

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
const MatchLineupsView = () => {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string

  // State for toggling views
  const [viewTeam, setViewTeam] = useState<'home' | 'away'>('home')

  // Fetch Data
  const { data: apiResponse, isLoading, error } = useFetchLegacyMatchResult(matchId)

  // Safe Data Extraction
  const rawData = apiResponse as any
  const matchData = rawData?.data || rawData

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05060B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin text-cyan-400" size={48} />
          <p className="text-cyan-400 font-semibold">Loading lineup...</p>
        </div>
      </div>
    )
  }

  // --- ERROR STATE ---
  if (error || !matchData) {
    return (
      <div className="min-h-screen bg-[#05060B] p-10 flex flex-col items-center justify-center">
        <FiAlertTriangle className="text-red-500 mb-4" size={48} />
        <p className="text-red-400 font-semibold mb-6">
          {error ? 'Failed to load lineup data' : 'Match data not found'}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <FiArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>
    )
  }

  // --- DATA PREPARATION ---
  const homeTeamName = matchData.teams?.my_team || "My Team"
  const awayTeamName = matchData.teams?.opponent_team || "Opponent"
  
  const homeLineup = transformLineup(matchData.lineups?.my_team_starting_lineup)
  const awayLineup = transformLineup(matchData.lineups?.opponent_team_starting_lineup)
  
  const currentLineup = viewTeam === 'home' ? homeLineup : awayLineup
  const currentTeamName = viewTeam === 'home' ? homeTeamName : awayTeamName
  const currentFormation = viewTeam === 'home' 
    ? (matchData.teams?.my_team_formation || "Starting XI")
    : (matchData.teams?.opponent_team_formation || "Starting XI")

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#05060B] text-white p-4 sm:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Analysis</span>
        </button>

        {/* VISUAL COMPONENT WRAPPER */}
        <div className="w-full bg-[#1a0b2e] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
          
          {/* HEADER CONTROLS */}
          <div className="flex items-center justify-between p-4 bg-[#2a134a] border-b border-purple-500/30">
            <h3 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
              Match Lineups
            </h3>
            
            {/* Team Toggles */}
            <div className="flex bg-[#120621] rounded-lg p-1 gap-1">
              <button
                onClick={() => setViewTeam('home')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  viewTeam === 'home' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                {homeTeamName}
              </button>
              <button
                onClick={() => setViewTeam('away')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  viewTeam === 'away' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                {awayTeamName}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-[700px] lg:h-[600px]">
            
            {/* LEFT: PITCH VISUALIZATION */}
            <div className="relative flex-1 bg-gradient-to-br from-[#4a1d96] to-[#310b6b] p-6 flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-[400px] aspect-[2/3] border-2 border-white/20 rounded-lg bg-white/[0.03] backdrop-blur-sm shadow-[0_0_50px_rgba(100,50,255,0.2)]">
                
                {/* CSS PITCH LINES */}
                <div className="absolute top-1/2 w-full h-0.5 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-1/6 border-b-2 border-x-2 border-white/20"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-b-2 border-x-2 border-white/20"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-1/6 border-t-2 border-x-2 border-white/20"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-t-2 border-x-2 border-white/20"></div>

                {/* PLAYERS ON PITCH */}
                {currentLineup.map((player) => {
                  const { top, left } = getPositionStyle(player.position)
                  return (
                    <div
                      key={player.id}
                      className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-10 cursor-pointer group"
                      style={{ top, left }}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-gray-800 overflow-hidden shadow-lg relative flex items-center justify-center">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] text-white/50">IMG</span>
                        )}
                      </div>
                      
                      {/* Number Badge */}
                      <div className="mt-[-8px] bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white/20 z-20 group-hover:bg-purple-500 transition-colors">
                        {player.number}
                      </div>

                      {/* Name Tooltip */}
                      <div className="absolute top-full mt-1 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {player.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT: LIST VIEW */}
            <div className="w-full lg:w-[350px] bg-[#2a134a]/50 backdrop-blur-md border-l border-white/5 overflow-y-auto">
              <div className="p-4 sticky top-0 bg-[#2a134a] z-20 shadow-lg border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-900 font-black text-xl border-4 border-purple-500">
                    {currentTeamName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{currentTeamName}</h4>
                    <p className="text-purple-300 text-xs font-mono uppercase tracking-wider">
                      {currentFormation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-2">
                {currentLineup.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-purple-500/30 group cursor-default"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-white text-purple-900 font-bold rounded-lg shadow-sm text-sm shrink-0">
                      {player.number}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors">
                        {player.name}
                      </p>
                    </div>

                    <div className="bg-purple-500/20 border border-purple-500/50 text-purple-200 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold">
                      {player.position}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchLineupsView