'use client'
import React, { useState } from 'react'
import { FiSettings } from 'react-icons/fi'
import TacticalOverlay from '@/components/match/TechticalOverlay'

/* =======================
   TYPES
======================= */
interface MatchPlayerStats {
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number
  passes: number
  passAccuracy: number | null
  tackles: number
  yellowCards: number
  redCards: number
  minutesPlayed: number | null
}

interface PlayerProfile {
  firstName: string
  lastName: string
  country: string
  primaryPosition: string
  avatar: string | null
}

export interface MatchPlayer {
  id: string
  jerseyNumber: number
  position: string
  playerProfile: PlayerProfile
  stats: MatchPlayerStats | null
}

export interface MatchDetail {
  id: string
  videoUrl: string
  matchPlayers: MatchPlayer[]
}

/* =======================
   UTILS
======================= */
const getYouTubeId = (url?: string): string | null => {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
  } catch {
    const m =
      url.match(/v=([a-zA-Z0-9_-]+)/) ||
      url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    return m ? m[1] : null
  }
  return null
}

/* =======================
   UI COMPONENTS
======================= */
const StatSummaryCard = ({ title, value, apg, percentage, accentColor }: any) => {
  const colors: any = {
    cyan: 'text-cyan-400 bg-cyan-400',
    purple: 'text-purple-400 bg-purple-400',
    green: 'text-green-400 bg-green-400',
  }

  return (
    <div className="bg-[#0B0D19] border border-white/5 p-4 rounded-xl">
      <div className="flex justify-between mb-2">
        <h3 className="text-gray-500 text-[10px] font-black uppercase">{title}</h3>
        <FiSettings className="text-gray-600" size={12} />
      </div>

      <div className="flex justify-between items-end mb-2">
        <div className="flex gap-2 items-baseline">
          <span className="text-white text-2xl font-black italic">{value}</span>
          <span className={`${colors[accentColor].split(' ')[0]} text-[9px] font-black uppercase`}>
            APG {apg}
          </span>
        </div>
        <span className="text-white text-[10px] font-black">{percentage}%</span>
      </div>

      <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
        <div
          className={`${colors[accentColor].split(' ')[1]} h-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

const StatsTerminal = ({ title, players, metricName, accentColor }: any) => {
  const color: any = {
    cyan: 'text-cyan-400 bg-cyan-400',
    purple: 'text-purple-500 bg-purple-500',
    green: 'text-green-400 bg-green-400',
  }

  return (
    <div className="bg-[#0B0D19] border border-white/5 rounded-2xl p-4">
      <div className="flex justify-between mb-4 border-b border-white/5 pb-3">
        <span className="text-[10px] font-black uppercase text-white">{title}</span>
        <FiSettings className="text-gray-700" size={12} />
      </div>

      <div className="space-y-4">
        {players.map((p: MatchPlayer) => {
          const fig = Math.floor(Math.random() * 3)
          const total = 3
          const percent = Math.round((fig / total) * 100)

          return (
            <div key={p.id} className="grid grid-cols-12 items-center">
              <div className="col-span-6">
                <p className="text-[10px] font-bold uppercase text-gray-300 truncate">
                  {p.playerProfile.firstName} {p.playerProfile.lastName[0]}.
                </p>
              </div>

              <div className="col-span-3 text-center">
                <span className={`${color[accentColor].split(' ')[0]} text-[10px] font-black italic`}>
                  {fig}/{total}
                </span>
              </div>

              <div className="col-span-3">
                <span className="text-[9px] font-black text-white">{percent}%</span>
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`${color[accentColor].split(' ')[1]} h-full`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* =======================
   DUMMY DATA
======================= */
const dummyMatch: MatchDetail = {
  id: '1',
  videoUrl: 'https://www.youtube.com/watch?v=IobYjhdAlH0',
  matchPlayers: Array.from({ length: 12 }, (_, i) => ({
    id: `${i}`,
    jerseyNumber: i + 1,
    position: 'MID',
    playerProfile: { firstName: `Player${i + 1}`, lastName: `Last${i + 1}`, country: 'X', primaryPosition: 'MID', avatar: null },
    stats: null,
  })),
}

/* =======================
   MAIN COMPONENT
======================= */
const MatchStatsView = () => {
  const [matchData] = useState<MatchDetail>(dummyMatch)
  const youtubeId = getYouTubeId(matchData.videoUrl)

  return (
    <div className="min-h-screen bg-[#05060B] text-white p-6">
      <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-8">
        {/* CENTER */}
        <section className="col-span-12 md:col-span-9 xl:col-span-8 space-y-6">
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/5">
            {youtubeId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-700 text-xs font-black uppercase">
                Feed Offline
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatSummaryCard title="Attempts" value="11" apg="11.0" percentage={0} accentColor="cyan" />
            <StatSummaryCard title="Shot On T" value="05" apg="5.0" percentage={45} accentColor="cyan" />
            <StatSummaryCard title="Shot Off T" value="06" apg="6.0" percentage={54} accentColor="purple" />
            <StatSummaryCard title="Goal" value="01" apg="1.0" percentage={9} accentColor="green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsTerminal title="Attempts" players={matchData.matchPlayers.slice(0, 6)} metricName="%" accentColor="cyan" />
            <StatsTerminal title="Shot On" players={matchData.matchPlayers.slice(1, 4)} metricName="%" accentColor="cyan" />
            <StatsTerminal title="Shot Off" players={matchData.matchPlayers.slice(2, 9)} metricName="%" accentColor="purple" />
            <StatsTerminal title="Goal" players={matchData.matchPlayers.slice(0, 1)} metricName="%" accentColor="green" />
          </div>
        </section>

        {/* RIGHT */}
        <aside className="col-span-8 xl:col-span-2">
    
            <TacticalOverlay />
        </aside>
      </div>
    </div>
  )
}

export default MatchStatsView
