// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { getClient } from '@/lib/api/client';
// import {
//     FiLoader, FiAlertTriangle, FiCalendar, FiMapPin, FiLayers,
//     FiVideo, FiList, FiTrendingUp, FiSettings,
//     FiArrowLeft
// } from 'react-icons/fi';
// import { dummyMatch } from '@/staticdata/match';
// import TacticalOverlay from '@/components/match/TechticalOverlay';



// // ============================================================================
// // 1. INTERFACES (UNCHANGED)
// // ============================================================================
// interface CanonicalClub { id: string; logoUrl: string | null; }

// export interface MatchPlayerStats {
//     goals: number; assists: number; shots: number; shotsOnTarget: number;
//     passes: number; passAccuracy: number | null; tackles: number;
//     yellowCards: number; redCards: number; minutesPlayed: number | null;
// }
// interface PlayerProfile {
//     firstName: string; lastName: string; country: string;
//     primaryPosition: string; avatar: string | null;
// }
// export interface MatchPlayer {
//     id: string; jerseyNumber: number; position: string;
//     playerProfile: PlayerProfile; stats: MatchPlayerStats | null;
// }
// export interface MatchResultData {
//     homeScore: number; awayScore: number; homePossession: number | null;
//     awayPossession: number | null; homeShots: number | null; awayShots: number | null;
// }
// export interface MatchClubData {
//     id: string; name: string; country: string; jerseyColor: string | null;
//     isUsersTeam: boolean; club: CanonicalClub | null;
// }
// interface Uploader { name: string; }

// export interface MatchDetail {
//     id: string; videoUrl: string; status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
//     level: string; matchDate: string | null; competitionName: string | null; venue: string | null;
//     createdAt: string;
//     matchClubs: MatchClubData[]; matchPlayers: MatchPlayer[];
//     result: MatchResultData | null; user: Uploader;
// }

// // ============================================================================
// // 2. UTILITY FUNCTIONS (UNCHANGED)
// // ============================================================================
// const formatDate = (dateStr: string | null) => {
//     if (!dateStr) return "TBD";
//     return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
// };

// const getTeams = (matchClubs: MatchClubData[]) => {
//     return {
//         home: matchClubs.find(c => c.isUsersTeam),
//         away: matchClubs.find(c => !c.isUsersTeam),
//     };
// };

// const getYouTubeId = (url: string | undefined): string | null => {
//     if (!url) return null;
//     try {
//         const urlObj = new URL(url);
//         if (urlObj.hostname.includes('youtube.com')) {
//             return urlObj.searchParams.get('v');
//         }
//         if (urlObj.hostname.includes('youtu.be')) {
//             return urlObj.pathname.substring(1);
//         }
//     } catch (e) {
//         const match = url.match(/v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
//         if (match) return match[1];
//     }
//     return null;
// };

// // ============================================================================
// // 3. REUSABLE UI COMPONENTS
// // ============================================================================

// const StatSummaryCard = ({ title, value, apg, percentage, accentColor }: any) => {
//     const colors: any = {
//         cyan: "text-cyan-400 bg-cyan-400",
//         purple: "text-purple-400 bg-purple-400",
//         green: "text-green-400 bg-green-400"
//     };
//     return (
//         <div className="bg-[#0B0D19] border border-white/5 p-4 rounded-xl shadow-lg">
//             <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
//                 <span className="text-gray-600 cursor-pointer"><FiSettings size={12} /></span>
//             </div>
//             <div className="flex items-baseline justify-between mb-2">
//                 <div className="flex items-baseline gap-2">
//                     <span className="text-white text-2xl font-black italic">Fig: {value}</span>
//                     <span className={`${colors[accentColor]?.split(' ')[0]} text-[9px] font-black uppercase`}>APG: {apg}</span>
//                 </div>
//                 <span className="text-white text-[10px] font-black">{percentage}%</span>
//             </div>
//             <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
//                 <div className={`${colors[accentColor]?.split(' ')[1]} h-full`} style={{ width: `${percentage}%` }} />
//             </div>
//         </div>
//     );
// };

// const StatsTerminal = ({ title, players, metricName, accentColor }: any) => {
//     const colorClass: any = {
//         cyan: "text-cyan-400 bg-cyan-400",
//         purple: "text-purple-500 bg-purple-500",
//         green: "text-green-400 bg-green-400",
//     };

//     return (
//         <div className="bg-[#0B0D19] border border-white/5 rounded-2xl p-4 shadow-2xl h-full">
//             <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
//                 <div className="flex gap-4">
//                     <div className="flex items-center gap-1.5">
//                         <div className={`w-1.5 h-1.5 rounded-full ${colorClass[accentColor].split(' ')[1]}`} />
//                         <span className="text-[8px] font-black uppercase text-white tracking-widest">Most Frequent</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 opacity-30">
//                         <div className="w-1.5 h-1.5 rounded-full bg-white" />
//                         <span className="text-[8px] font-black uppercase text-white tracking-widest">Highest %</span>
//                     </div>
//                 </div>
//                 <FiSettings className="w-3 h-3 text-gray-700" />
//             </div>

//             <div className="grid grid-cols-12 text-[8px] font-black uppercase text-gray-500 tracking-widest mb-4 px-1">
//                 <div className="col-span-6">Players</div>
//                 <div className="col-span-3 text-center">Stats</div>
//                 <div className="col-span-3 text-right">{metricName}</div>
//             </div>

//             <div className="space-y-4">
//                 {players.map((p: MatchPlayer, idx: number) => {
//                     const fig = Math.floor(Math.random() * 3); // Placeholder logic
//                     const total = 3;
//                     const percentage = Math.round((fig / total) * 100);

//                     return (
//                         <div key={p.id || idx} className="grid grid-cols-12 items-center group">
//                             <div className="col-span-6">
//                                 <p className="text-[10px] font-bold text-gray-300 truncate uppercase group-hover:text-white transition-colors">
//                                     {p.playerProfile.firstName} {p.playerProfile.lastName[0]}.
//                                 </p>
//                             </div>
//                             <div className="col-span-3 text-center">
//                                 <span className={`text-[10px] font-black italic ${colorClass[accentColor].split(' ')[0]}`}>
//                                     {fig}/{total}
//                                 </span>
//                             </div>
//                             <div className="col-span-3 flex flex-col items-end gap-1">
//                                 <span className="text-[9px] font-black text-white italic">{percentage}%</span>
//                                 <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
//                                     <div className={`h-full ${colorClass[accentColor].split(' ')[1]} transition-all`} style={{ width: `${percentage}%` }} />
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// // ============================================================================
// // 4. MAIN PAGE COMPONENT
// // ============================================================================
// const MatchDetailPage = () => {
//     const params = useParams();
//     const router = useRouter();
//     const matchId = params.id as string;

//     const [matchData, setMatchData] = useState<MatchDetail | null>(dummyMatch);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // --- EFFECT HOOK (PRESERVED AS COMMENTED OUT) ---

//     // useEffect(() => {
//     //     if (!matchId) return;

//     //     const fetchMatchDetails = async () => {
//     //         setLoading(true);
//     //         setError(null);

//     //         try {
//     //             const client = await getClient(); 
//     //             const response = await client.get(`/match/${matchId}`);
//     //             console.log(response.data)
//     //             setMatchData(response.data.data as MatchDetail);
//     //         } catch (err: any) {
//     //             console.error("Failed to fetch match details:", err);
//     //             const errorMessage = err.response?.data?.error || err.message || "Unknown error occurred.";
//     //             setError(errorMessage);
//     //             setMatchData(null);
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchMatchDetails();
//     // }, [matchId]);


//     if (loading) return <div className="flex justify-center items-center h-screen bg-[#05060B]"><FiLoader className="animate-spin text-cyan-400" /></div>;

//     if (error || !matchData) return <div className="p-8 text-center text-white mt-20"><FiAlertTriangle className="mx-auto mb-2 text-red-500" />{error || "Data not found."}</div>;

//     const { home: homeTeam } = getTeams(matchData.matchClubs);
//     const youtubeId = getYouTubeId(matchData.videoUrl);
//     const starters = matchData.matchPlayers.slice(0, 11);
//     const subs = matchData.matchPlayers.slice(11);

//     return (
//         <div className="min-h-screen bg-[#05060B] text-white p-6">
//             <div className="max-w-[1700px] mx-auto">

//                 {/* Back Link */}
//                 <button onClick={() => router.push("/dashboard/matches")} className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors mb-8 uppercase text-[10px] font-black tracking-widest">
//                     <FiArrowLeft /> Exit Analysis
//                 </button>

//                 <main className="grid grid-cols-12 gap-8">

//                     {/* LEFT COLUMN: ROSTER */}
//                     <aside className="col-span-12 md:col-span-3 xl:col-span-2">
//                         <h2 className="text-cyan-400 text-3xl font-black italic uppercase tracking-tighter mb-1">Line up</h2>
//                         <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Club: {homeTeam?.name || 'N/A'}</p>
//                         <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-8 italic">Coach: J. Mourinho</p>

//                         <div className="space-y-8">
//                             <section>
//                                 <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-cyan-400/20 pb-2">Starting Line up:</h3>
//                                 <ul className="space-y-4">
//                                     {starters.map((p) => (
//                                         <li key={p.id} className="flex gap-3 items-center group cursor-pointer">
//                                             <span className="text-cyan-400 font-black italic text-xs w-6">{String(p.jerseyNumber).padStart(2, '0')}.</span>
//                                             <span className="text-gray-300 group-hover:text-white font-bold text-xs uppercase truncate">
//                                                 {p.playerProfile.firstName} {p.playerProfile.lastName}
//                                             </span>
//                                             <span className="text-cyan-400/50 text-[9px] font-black uppercase ml-auto">{p.position}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </section>

//                             <section>
//                                 <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-cyan-400/20 pb-2">Substitutes:</h3>
//                                 <ul className="space-y-4 opacity-50">
//                                     {subs.map((p) => (
//                                         <li key={p.id} className="flex gap-3 items-center">
//                                             <span className="text-cyan-400 font-black italic text-xs w-6">{String(p.jerseyNumber).padStart(2, '0')}.</span>
//                                             <span className="text-gray-400 font-bold text-xs uppercase truncate">{p.playerProfile.firstName} {p.playerProfile.lastName}</span>
//                                             <span className="text-cyan-400/20 text-[9px] font-black uppercase ml-auto">{p.position}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </section>
//                         </div>
//                     </aside>

//                     {/* CENTER COLUMN: VIDEO & TERMINALS */}
//                     <section className="col-span-12 md:col-span-9 xl:col-span-7 space-y-6">
//                         <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/5 shadow-2xl shadow-cyan-500/5">
//                             {youtubeId ? (
//                                 <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}`} title="Match Feed" allowFullScreen />
//                             ) : (
//                                 <div className="flex items-center justify-center h-full text-gray-700 font-black uppercase text-xs tracking-widest">Feed Encrypted / Offline</div>
//                             )}
//                         </div>

//                         {/* Top Summary Stats */}
//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                             <StatSummaryCard title="Attempts" value="11" apg="11.00" percentage={0} accentColor="cyan" />
//                             <StatSummaryCard title="Shot On T" value="05" apg="5.00" percentage={45} accentColor="cyan" />
//                             <StatSummaryCard title="Shot Off T" value="06" apg="6.00" percentage={54} accentColor="purple" />
//                             <StatSummaryCard title="Goal" value="01" apg="1.00" percentage={9} accentColor="green" />
//                         </div>

//                         {/* Bottom Stats Terminals */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                             <StatsTerminal title="Attempts" players={matchData.matchPlayers.slice(0, 6)} metricName="Attempts %" accentColor="cyan" />
//                             <StatsTerminal title="Shot On T" players={matchData.matchPlayers.slice(1, 4)} metricName="Successful %" accentColor="cyan" />
//                             <StatsTerminal title="Shot Off T" players={matchData.matchPlayers.slice(2, 9)} metricName="Failed %" accentColor="purple" />
//                             <StatsTerminal title="Goal" players={matchData.matchPlayers.slice(0, 1)} metricName="Attempts %" accentColor="green" />
//                         </div>
//                     </section>

//                     {/* RIGHT COLUMN: PITCH & META */}
//                     <aside className="col-span-12 xl:col-span-3">
//                         <div className="sticky top-8 space-y-6">
//                             <TacticalOverlay />
//                             {/* Rest of your Meta Info component */}
//                         </div>
//                     </aside>

//                 </main>
//             </div>
//         </div>
//     );
// };

// export default MatchDetailPage;

"use client";

import React, { useState, useEffect } from 'react';
import {
    FiPlay, FiPause, FiSearch, FiVideo,
    FiCheckCircle, FiXCircle, FiFilter, FiX,
    FiLoader, FiAlertTriangle, FiRefreshCw
} from 'react-icons/fi';
import { useFetchMatchResult } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { extractMatchId } from '@/lib/utils/slug';
import { useSEO } from '@/hooks/useSEO';
import PremierLeagueReport from '@/components/match/PremierLeagueReport';
import { getYouTubeVideoId } from '@/lib/utils/youtubeVIdeo';

// --- Types ---
interface CanonicalClub { id: string; logoUrl: string | null; }
interface MatchClubData {
    id: string; name: string; country: string; jerseyColor: string | null;
    isUsersTeam: boolean; club: CanonicalClub | null;
}
interface MatchResultData {
    homeScore: number; awayScore: number;
}
interface MatchDetail {
    id: string; videoUrl: string; status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    level: string; matchDate: string | null; competitionName: string | null; venue: string | null;
    createdAt: string;
    matchClubs: MatchClubData[]; matchPlayers: any[];
    result: MatchResultData | null; user: { name: string };
}

const getTeams = (matchClubs: MatchClubData[]) => {
    return {
        home: matchClubs.find(c => c.isUsersTeam),
        away: matchClubs.find(c => !c.isUsersTeam),
    };
};

// --- Types ---
interface PassEvent {
    id: number;
    time: number; // converted to seconds
    formattedTime: string; // original string "0:06"
    fromPlayer: string;
    fromTeam: 'Blue' | 'Red' | 'Unknown';
    toPlayer: string;
    toTeam: 'Blue' | 'Red' | 'Unknown';
    type: string;
    result: 'Success' | 'Fail' | 'Unknown';
    confidence: number;
    colorClass: string;
}

// --- Helper Functions ---


const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Helper to parse "MM:SS" string to seconds
const parseTimeString = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return 0;
};

// ============================================================================
// SCOUT REPORT COMPONENT
// ============================================================================
interface ScoutReportProps {
    videoUrl: string | undefined; // Passed explicitly because of JSON structure
    matchReport: MatchReport | null;
}

function ScoutReport({ videoUrl, matchReport }: ScoutReportProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedPass, setSelectedPass] = useState<PassEvent | null>(null);
    const [passList, setPassList] = useState<PassEvent[]>([]);

    const youtubeVideoId = getYouTubeVideoId(videoUrl);

    // Transform API data into PassEvent format
    useEffect(() => {
        if (matchReport?.passes && Array.isArray(matchReport.passes)) {
            const passes: PassEvent[] = matchReport.passes.map((p, index) => {
                const timeInSeconds = parseTimeString(p.time);

                return {
                    id: index + 1,
                    time: timeInSeconds,
                    formattedTime: p.time,
                    fromPlayer: p.from_player?.toString() || '?',
                    fromTeam: (p.from_team || 'Unknown') as 'Blue' | 'Red' | 'Unknown',
                    toPlayer: p.to_player?.toString() || '?',
                    toTeam: (p.to_team || 'Unknown') as 'Blue' | 'Red' | 'Unknown',
                    type: p.pass_type || 'Pass',
                    result: (p.result || 'Unknown') as 'Success' | 'Fail' | 'Unknown',
                    confidence: p.confidence || 0,
                    // Assign colors based on type or result
                    colorClass: p.pass_type === 'Key Pass' ? 'bg-indigo-500' : 'bg-purple-500',
                };
            });

            setPassList(passes);

            // Set duration based on last pass time + buffer, or default to 90 mins
            if (passes.length > 0) {
                const lastPassTime = Math.max(...passes.map(p => p.time));
                setDuration(Math.max(lastPassTime + 60, 600)); // Minimum 10 mins
            }
        }
    }, [matchReport]);

    // Filter passes based on search and filter
    const filteredPasses = passList.filter(pass => {
        const matchesSearch =
            pass.fromPlayer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pass.toPlayer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pass.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filter === 'All' ||
            (filter === 'Blue' && pass.fromTeam === 'Blue') ||
            (filter === 'Red' && pass.fromTeam === 'Red') ||
            (filter === 'Success' && pass.result === 'Success') ||
            (filter === 'Fail' && pass.result === 'Fail') ||
            (filter === 'Unknown' && (pass.result === 'Unknown' || pass.fromTeam === 'Unknown'));

        return matchesSearch && matchesFilter;
    });

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="min-h-screen bg-[#05070a] text-slate-100 pb-20">
            <main className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">
                {/* VIDEO ANALYSIS SECTION */}
                <section className="bg-[#0b0f1a] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-20 bg-indigo-500"></div>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-indigo-400">
                            <FiVideo className="text-lg md:text-xl" /> Tactical Feed Analysis
                        </h2>
                        <div className="text-[9px] md:text-[10px] font-bold bg-white/5 px-2 md:px-3 py-1 rounded-full text-white/40 uppercase">
                            Interactive Timeline
                        </div>
                    </div>

                    {/* YouTube Video Player */}
                    <div className="rounded-3xl overflow-hidden bg-black border border-white/10 aspect-video max-w-full md:max-w-6xl mx-auto shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                        {youtubeVideoId ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
                                title="Match Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 bg-white/5">
                                No video source available
                            </div>
                        )}
                    </div>

                    {/* Controls Below Video */}
                    {/* <div className="mt-4 bg-[#0b0f1a] border border-white/5 rounded-2xl p-4 md:p-6">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                            <button
                                onClick={togglePlay}
                                className="bg-indigo-600 hover:bg-indigo-500 p-3 md:p-4 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 text-white"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                            </button>

                            <div className="flex-1 space-y-2 w-full">
                                <div
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        let clickX = e.clientX - rect.left;
                                        clickX = Math.max(0, Math.min(clickX, rect.width));
                                        const percent = clickX / rect.width;
                                        setCurrentTime(percent * duration);
                                    }}
                                    className="h-3 md:h-2.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                                >
                                    <div
                                        className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                    />

                                   
                                    {passList.map((pass) => {
                                        if (!duration || pass.time > duration) return null;
                                        const leftPercent = (pass.time / duration) * 100;
                                        const color =
                                            pass.result === "Success"
                                                ? "bg-green-400"
                                                : pass.result === "Fail"
                                                    ? "bg-red-500"
                                                    : "bg-gray-500";
                                        return (
                                            <div
                                                key={pass.id}
                                                className={`${color} absolute top-0 h-full w-1 md:w-1.5 rounded-full opacity-60 hover:opacity-100 transition-opacity`}
                                                style={{ left: `${leftPercent}%` }}
                                                title={`${pass.type} - ${pass.time}s`}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between items-center text-[9px] md:text-[11px] font-mono text-white/40 tracking-widest">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </section>

                {/* LOG TABLE SECTION */}
                <section className="bg-[#0b0f1a] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                <FiFilter className="text-indigo-500" /> Pass Log & Replays
                            </h3>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
                                Click any entry to trigger AI Replay
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="text"
                                    placeholder="SEARCH EVENT, PLAYER OR TYPE..."
                                    value={searchQuery}
                                    className="w-full md:w-80 bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-[11px] font-bold tracking-widest uppercase placeholder:text-white/10"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-1.5 rounded-2xl w-fit">
                        {['All', 'Blue', 'Red', 'Success', 'Fail', 'Unknown'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === f
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-[10px] font-black uppercase text-white/20 tracking-[0.25em]">
                                    <th className="px-6 py-2">ID</th>
                                    <th className="px-6 py-2">Replay</th>
                                    <th className="px-6 py-2">From</th>
                                    <th className="px-6 py-2">To</th>
                                    <th className="px-6 py-2 text-center">Classification</th>
                                    <th className="px-6 py-2">Outcome</th>
                                    <th className="px-6 py-2">AI Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPasses.length > 0 ? (
                                    filteredPasses.map((pass) => (
                                        <tr
                                            key={pass.id}
                                            onClick={() => setSelectedPass(pass)}
                                            className="bg-white/[0.02] hover:bg-indigo-600/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer group"
                                        >
                                            <td className="px-6 py-5 rounded-l-2xl text-white/20 font-mono text-xs">
                                                {pass.id.toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-5">
                                                <button className="bg-white/5 group-hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-3 transition-all">
                                                    <FiPlay size={12} /> {pass.formattedTime}
                                                </button>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shadow-lg ${pass.fromTeam === 'Blue' ? 'bg-blue-600' :
                                                            pass.fromTeam === 'Red' ? 'bg-red-600' : 'bg-gray-600'
                                                            }`}
                                                    >
                                                        #{pass.fromPlayer}
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/50">
                                                        {pass.fromTeam}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shadow-lg ${pass.toTeam === 'Blue' ? 'bg-blue-600' :
                                                            pass.toTeam === 'Red' ? 'bg-red-600' : 'bg-gray-600'
                                                            }`}
                                                    >
                                                        #{pass.toPlayer}
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/50">
                                                        {pass.toTeam}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`${pass.colorClass} text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest`}>
                                                    {pass.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {pass.result === 'Success' ? (
                                                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                                        <FiCheckCircle size={14} /> Completed
                                                    </div>
                                                ) : pass.result === 'Fail' ? (
                                                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                        <FiXCircle size={14} /> Intercepted
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                                        <FiAlertTriangle size={14} /> Unknown
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 rounded-r-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${pass.confidence > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                            style={{ width: `${pass.confidence}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-mono font-bold text-white/40">
                                                        {pass.confidence}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-white/40">
                                            No passes found matching your search criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* REPLAY MODAL */}
                {selectedPass && youtubeVideoId && (
                    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
                        {/* UPDATES:
            1. max-w-2xl: Keeps width smaller (as requested before).
            2. max-h-[90vh]: Ensures modal never exceeds 90% of screen height.
            3. overflow-y-auto: Adds internal scrollbar if content is too tall for screen.
        */}
                        <div className="bg-[#0b0f1a] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative flex flex-col">

                            <button
                                onClick={() => setSelectedPass(null)}
                                className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all hover:scale-110"
                            >
                                <FiX size={20} />
                            </button>

                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-800 p-5 flex flex-col justify-between items-start gap-3 shrink-0">
                                <div>
                                    <h2 className="font-black italic uppercase flex items-center gap-2 text-base tracking-tight text-white">
                                        <FiPlay size={18} className="text-white" /> AI Action Replay
                                    </h2>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="bg-white/20 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest text-indigo-100">
                                            {selectedPass.type}
                                        </span>
                                        <span className="bg-black/20 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest text-white/50">
                                            Sequence #{selectedPass.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Video Container - shrink-0 prevents it from getting crushed, aspect-video maintains ratio */}
                            <div className="w-full bg-black shrink-0">
                                <div className="w-full aspect-video border-y border-white/10">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&start=${Math.floor(selectedPass.time)}`}
                                        title="AI Action Replay"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 bg-[#0b0f1a]">
                                {[
                                    {
                                        label: 'SENDER',
                                        value: `#${selectedPass.fromPlayer} ${selectedPass.fromTeam}`,
                                        color: selectedPass.fromTeam === 'Blue' ? 'text-blue-400' : 'text-red-400',
                                    },
                                    {
                                        label: 'RECEIVER',
                                        value: `#${selectedPass.toPlayer} ${selectedPass.toTeam}`,
                                        color: selectedPass.toTeam === 'Blue' ? 'text-blue-400' : 'text-red-400',
                                    },
                                    {
                                        label: 'OUTCOME',
                                        value: selectedPass.result,
                                        color: selectedPass.result === 'Success' ? 'text-green-500' : 'text-orange-500',
                                    },
                                    { label: 'TIMESTAMP', value: selectedPass.formattedTime, color: 'text-white' },
                                    { label: 'CONFIDENCE', value: `${selectedPass.confidence}%`, color: 'text-indigo-400' },
                                ].map((info) => (
                                    <div key={info.label} className="flex flex-col gap-1">
                                        <div className="text-[9px] font-black text-white/20 tracking-[0.2em]">{info.label}</div>
                                        <div className={`text-sm font-black uppercase italic tracking-tight ${info.color}`}>
                                            {info.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const MatchDetailPage = () => {
    const params = useParams();
    const slugOrId = params.id as string;
    const matchId = extractMatchId(slugOrId);
    const [reportType, setReportType] = useState<'scout' | 'premier'>('scout');

    // Fetch match result from API
    const { data: apiResponse, isLoading, error } = useFetchMatchResult(matchId);

    // ===========================================================
    // UPDATE: Specific Data Extraction for your JSON Structure
    // ===========================================================
    // Your structure: { data: { message: "...", videoUrl: "...", data: [ { match_report: ... } ] } }

    // 1. Get the video URL from the outer "data" object
    const videoUrl = apiResponse?.data?.videoUrl;

    // 2. Get the match specific details (inside the data array)
    const matchDetailRaw = apiResponse?.data?.data?.[0];

    // 3. Get the report
    const matchReport: MatchReport | null = matchDetailRaw?.match_report || null;

    // 4. Fallback for team info (if available in matchDetailRaw)
    const matchClubs = matchDetailRaw?.matchClubs || [];
    const { home: homeTeam, away: awayTeam } = getTeams(matchClubs);

    // Generate match title for SEO
    const matchTitle = matchDetailRaw
        ? `Match Analysis`
        : 'Match Analysis';

    // SEO metadata
    useSEO({
        title: `${matchTitle} | ScoutMe.cloud`,
        description: 'Detailed match analysis, player stats, and tactical insights on ScoutMe.cloud.',
        image: homeTeam?.club?.logoUrl || '/images/default/club_default.PNG',
        url: typeof window !== 'undefined' ? window.location.href : '',
        type: 'article',
        siteName: 'ScoutMe.cloud',
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#05060B]">
                <FiLoader className="animate-spin text-cyan-400" size={48} />
            </div>
        );
    }

    // Error state - check if we found the internal data array
    if (error || !apiResponse?.data) {
        return (
            <div className="p-8 text-center text-white mt-20">
                <FiAlertTriangle className="mx-auto mb-2 text-red-500" size={48} />
                <p className="text-xl mb-4 font-bold">Match data could not be loaded</p>
                <button
                    onClick={() => router.push('/dashboard/matches')}
                    className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl transition-all font-bold"
                >
                    Back to Matches
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05070a]">
            {/* Report Type Toggle */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-6">
                <div className="flex items-center justify-end gap-4 mb-4">
                    <div className="bg-[#0b0f1a] border border-white/10 rounded-2xl p-1 flex items-center gap-2">
                        <button
                            onClick={() => setReportType('scout')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${reportType === 'scout'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <FiVideo size={16} /> Analyst Report
                            </span>
                        </button>
                        <button
                            onClick={() => setReportType('premier')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${reportType === 'premier'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <FiRefreshCw size={16} /> Match Analysis Report
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Render Selected Report */}
            {reportType === 'scout' ? (
                <ScoutReport videoUrl={videoUrl} matchReport={matchReport} />
            ) : (
                <PremierLeagueReport matchData={matchDetailRaw} matchResult={apiResponse?.data} />
            )}
        </div>
    );
};

export default MatchDetailPage;