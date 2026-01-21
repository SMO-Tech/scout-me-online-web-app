'use client'
import React, { useState } from 'react'
import { FiAlertTriangle, FiSettings } from 'react-icons/fi'
import TacticalOverlay from '@/components/match/TechticalOverlay'
import { useParams, useRouter } from 'next/navigation'
import { useFetchLegacyMatchResult } from '@/hooks'
import { getYouTubeId } from '@/lib/utils/youtubeIdExtractor'

// later need to adjust this component to fetch reals data 

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

// to check the StatsTerminal page 
const mockPlayers = [
    {
        id: 'p1',
        playerProfile: {
            firstName: 'Ahmed',
            lastName: 'Hassan',
        },
    },
    {
        id: 'p2',
        playerProfile: {
            firstName: 'Yousef',
            lastName: 'Ali',
        },
    },
    {
        id: 'p3',
        playerProfile: {
            firstName: 'Khaled',
            lastName: 'Saleh',
        },
    },
    {
        id: 'p4',
        playerProfile: {
            firstName: 'Omar',
            lastName: 'Nasser',
        },
    },
]

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
                {players.map((p: any) => {
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

const MatchStats = () => {
    const params = useParams()
    const router = useRouter()
    const matchId = params.id as string
    const { data } = useFetchLegacyMatchResult(matchId)
    console.log(data)
    const matchData = data?.data
    console.log(matchData)
    // get yotube video id for embeeded view 
    const videoID = getYouTubeId(matchData?.youtube_link! || "")
    console.log(data)

    if (!matchData) {
        return (
            <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-[#0b0f1a] border border-white/5 p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                        <FiAlertTriangle className="text-orange-500 text-3xl" />
                    </div>

                    <h3 className="text-xl font-bold text-white">No Match Data Found</h3>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        We couldn't find the analysis data for this match. It might be processing or the ID is incorrect.
                    </p>

                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 w-full"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05060B] text-white p-6">
            <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-8">
                {/* CENTER */}
                <section className="col-span-12 md:col-span-9 xl:col-span-8 space-y-6">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/5">
                        {videoID ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoID}`}
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
                        <StatsTerminal title="Attempts" players={mockPlayers} metricName="%" accentColor="cyan" />
                        <StatsTerminal title="Shot On" players={mockPlayers} metricName="%" accentColor="cyan" />
                        <StatsTerminal title="Shot Off" players={mockPlayers} metricName="%" accentColor="purple" />
                        <StatsTerminal title="Goal" players={mockPlayers} metricName="%" accentColor="green" />
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

export default MatchStats
