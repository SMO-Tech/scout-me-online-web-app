"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClient } from '@/lib/api/client';
import {
    FiLoader, FiAlertTriangle, FiCalendar, FiMapPin, FiLayers,
    FiVideo, FiList, FiTrendingUp, FiSettings,
    FiArrowLeft
} from 'react-icons/fi';
import { dummyMatch } from '@/staticdata/match';
import TacticalOverlay from '@/components/match/TechticalOverlay';



// ============================================================================
// 1. INTERFACES (UNCHANGED)
// ============================================================================
interface CanonicalClub { id: string; logoUrl: string | null; }

export interface MatchPlayerStats {
    goals: number; assists: number; shots: number; shotsOnTarget: number;
    passes: number; passAccuracy: number | null; tackles: number;
    yellowCards: number; redCards: number; minutesPlayed: number | null;
}
interface PlayerProfile {
    firstName: string; lastName: string; country: string;
    primaryPosition: string; avatar: string | null;
}
export interface MatchPlayer {
    id: string; jerseyNumber: number; position: string;
    playerProfile: PlayerProfile; stats: MatchPlayerStats | null;
}
export interface MatchResultData {
    homeScore: number; awayScore: number; homePossession: number | null;
    awayPossession: number | null; homeShots: number | null; awayShots: number | null;
}
export interface MatchClubData {
    id: string; name: string; country: string; jerseyColor: string | null;
    isUsersTeam: boolean; club: CanonicalClub | null;
}
interface Uploader { name: string; }

export interface MatchDetail {
    id: string; videoUrl: string; status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    level: string; matchDate: string | null; competitionName: string | null; venue: string | null;
    createdAt: string;
    matchClubs: MatchClubData[]; matchPlayers: MatchPlayer[];
    result: MatchResultData | null; user: Uploader;
}

// ============================================================================
// 2. UTILITY FUNCTIONS (UNCHANGED)
// ============================================================================
const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getTeams = (matchClubs: MatchClubData[]) => {
    return {
        home: matchClubs.find(c => c.isUsersTeam),
        away: matchClubs.find(c => !c.isUsersTeam),
    };
};

const getYouTubeId = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        }
        if (urlObj.hostname.includes('youtu.be')) {
            return urlObj.pathname.substring(1);
        }
    } catch (e) {
        const match = url.match(/v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
    }
    return null;
};

// ============================================================================
// 3. REUSABLE UI COMPONENTS
// ============================================================================

const StatSummaryCard = ({ title, value, apg, percentage, accentColor }: any) => {
    const colors: any = {
        cyan: "text-cyan-400 bg-cyan-400",
        purple: "text-purple-400 bg-purple-400",
        green: "text-green-400 bg-green-400"
    };
    return (
        <div className="bg-[#0B0D19] border border-white/5 p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
                <span className="text-gray-600 cursor-pointer"><FiSettings size={12} /></span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-black italic">Fig: {value}</span>
                    <span className={`${colors[accentColor]?.split(' ')[0]} text-[9px] font-black uppercase`}>APG: {apg}</span>
                </div>
                <span className="text-white text-[10px] font-black">{percentage}%</span>
            </div>
            <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
                <div className={`${colors[accentColor]?.split(' ')[1]} h-full`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const StatsTerminal = ({ title, players, metricName, accentColor }: any) => {
    const colorClass: any = {
        cyan: "text-cyan-400 bg-cyan-400",
        purple: "text-purple-500 bg-purple-500",
        green: "text-green-400 bg-green-400",
    };

    return (
        <div className="bg-[#0B0D19] border border-white/5 rounded-2xl p-4 shadow-2xl h-full">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClass[accentColor].split(' ')[1]}`} />
                        <span className="text-[8px] font-black uppercase text-white tracking-widest">Most Frequent</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span className="text-[8px] font-black uppercase text-white tracking-widest">Highest %</span>
                    </div>
                </div>
                <FiSettings className="w-3 h-3 text-gray-700" />
            </div>

            <div className="grid grid-cols-12 text-[8px] font-black uppercase text-gray-500 tracking-widest mb-4 px-1">
                <div className="col-span-6">Players</div>
                <div className="col-span-3 text-center">Stats</div>
                <div className="col-span-3 text-right">{metricName}</div>
            </div>

            <div className="space-y-4">
                {players.map((p: MatchPlayer, idx: number) => {
                    const fig = Math.floor(Math.random() * 3); // Placeholder logic
                    const total = 3;
                    const percentage = Math.round((fig / total) * 100);

                    return (
                        <div key={p.id || idx} className="grid grid-cols-12 items-center group">
                            <div className="col-span-6">
                                <p className="text-[10px] font-bold text-gray-300 truncate uppercase group-hover:text-white transition-colors">
                                    {p.playerProfile.firstName} {p.playerProfile.lastName[0]}.
                                </p>
                            </div>
                            <div className="col-span-3 text-center">
                                <span className={`text-[10px] font-black italic ${colorClass[accentColor].split(' ')[0]}`}>
                                    {fig}/{total}
                                </span>
                            </div>
                            <div className="col-span-3 flex flex-col items-end gap-1">
                                <span className="text-[9px] font-black text-white italic">{percentage}%</span>
                                <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
                                    <div className={`h-full ${colorClass[accentColor].split(' ')[1]} transition-all`} style={{ width: `${percentage}%` }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// 4. MAIN PAGE COMPONENT
// ============================================================================
const MatchDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const matchId = params.id as string;

    const [matchData, setMatchData] = useState<MatchDetail | null>(dummyMatch);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- EFFECT HOOK (PRESERVED AS COMMENTED OUT) ---
    /*
    useEffect(() => {
        if (!matchId) return;

        const fetchMatchDetails = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const client = await getClient(); 
                const response = await client.get(`/match/${matchId}`);
                console.log(response.data)
                setMatchData(response.data.data as MatchDetail);
            } catch (err: any) {
                console.error("Failed to fetch match details:", err);
                const errorMessage = err.response?.data?.error || err.message || "Unknown error occurred.";
                setError(errorMessage);
                setMatchData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchDetails();
    }, [matchId]);
    */

    if (loading) return <div className="flex justify-center items-center h-screen bg-[#05060B]"><FiLoader className="animate-spin text-cyan-400" /></div>;

    if (error || !matchData) return <div className="p-8 text-center text-white mt-20"><FiAlertTriangle className="mx-auto mb-2 text-red-500" />{error || "Data not found."}</div>;

    const { home: homeTeam } = getTeams(matchData.matchClubs);
    const youtubeId = getYouTubeId(matchData.videoUrl);
    const starters = matchData.matchPlayers.slice(0, 11);
    const subs = matchData.matchPlayers.slice(11);

    return (
        <div className="min-h-screen bg-[#05060B] text-white p-6">
            <div className="max-w-[1700px] mx-auto">

                {/* Back Link */}
                <button onClick={() => router.push("/dashboard/matches")} className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors mb-8 uppercase text-[10px] font-black tracking-widest">
                    <FiArrowLeft /> Exit Analysis
                </button>

                <main className="grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN: ROSTER */}
                    <aside className="col-span-12 md:col-span-3 xl:col-span-2">
                        <h2 className="text-cyan-400 text-3xl font-black italic uppercase tracking-tighter mb-1">Line up</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Club: {homeTeam?.name || 'N/A'}</p>
                        <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-8 italic">Coach: J. Mourinho</p>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-cyan-400/20 pb-2">Starting Line up:</h3>
                                <ul className="space-y-4">
                                    {starters.map((p) => (
                                        <li key={p.id} className="flex gap-3 items-center group cursor-pointer">
                                            <span className="text-cyan-400 font-black italic text-xs w-6">{String(p.jerseyNumber).padStart(2, '0')}.</span>
                                            <span className="text-gray-300 group-hover:text-white font-bold text-xs uppercase truncate">
                                                {p.playerProfile.firstName} {p.playerProfile.lastName}
                                            </span>
                                            <span className="text-cyan-400/50 text-[9px] font-black uppercase ml-auto">{p.position}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-cyan-400/20 pb-2">Substitutes:</h3>
                                <ul className="space-y-4 opacity-50">
                                    {subs.map((p) => (
                                        <li key={p.id} className="flex gap-3 items-center">
                                            <span className="text-cyan-400 font-black italic text-xs w-6">{String(p.jerseyNumber).padStart(2, '0')}.</span>
                                            <span className="text-gray-400 font-bold text-xs uppercase truncate">{p.playerProfile.firstName} {p.playerProfile.lastName}</span>
                                            <span className="text-cyan-400/20 text-[9px] font-black uppercase ml-auto">{p.position}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </aside>

                    {/* CENTER COLUMN: VIDEO & TERMINALS */}
                    <section className="col-span-12 md:col-span-9 xl:col-span-7 space-y-6">
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/5 shadow-2xl shadow-cyan-500/5">
                            {youtubeId ? (
                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}`} title="Match Feed" allowFullScreen />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-700 font-black uppercase text-xs tracking-widest">Feed Encrypted / Offline</div>
                            )}
                        </div>

                        {/* Top Summary Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatSummaryCard title="Attempts" value="11" apg="11.00" percentage={0} accentColor="cyan" />
                            <StatSummaryCard title="Shot On T" value="05" apg="5.00" percentage={45} accentColor="cyan" />
                            <StatSummaryCard title="Shot Off T" value="06" apg="6.00" percentage={54} accentColor="purple" />
                            <StatSummaryCard title="Goal" value="01" apg="1.00" percentage={9} accentColor="green" />
                        </div>

                        {/* Bottom Stats Terminals */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatsTerminal title="Attempts" players={matchData.matchPlayers.slice(0, 6)} metricName="Attempts %" accentColor="cyan" />
                            <StatsTerminal title="Shot On T" players={matchData.matchPlayers.slice(1, 4)} metricName="Successful %" accentColor="cyan" />
                            <StatsTerminal title="Shot Off T" players={matchData.matchPlayers.slice(2, 9)} metricName="Failed %" accentColor="purple" />
                            <StatsTerminal title="Goal" players={matchData.matchPlayers.slice(0, 1)} metricName="Attempts %" accentColor="green" />
                        </div>
                    </section>

                    {/* RIGHT COLUMN: PITCH & META */}
                    <aside className="col-span-12 xl:col-span-3">
                        <div className="sticky top-8 space-y-6">
                            <TacticalOverlay />
                            {/* Rest of your Meta Info component */}
                        </div>
                    </aside>

                </main>
            </div>
        </div>
    );
};

export default MatchDetailPage;