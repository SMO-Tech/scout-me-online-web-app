"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import {
    FiPlus, FiSearch, FiFilter, FiEye, FiUserPlus, FiFlag
} from "react-icons/fi";

// ============================================================================
// 1. TYPES & INTERFACES (Strict TS)
// ============================================================================

interface MatchResultData {
    homeScore: number;
    awayScore: number;
}

interface MatchClubData {
    name: string;
    isUsersTeam: boolean;
    jerseyColor: string | null;
    club: {
        logoUrl: string | null;
    } | null;
    country: string;
}

interface UploaderData {
    name: string;
}

interface BaseMatch {
    id: string;
    userId: string;
    videoUrl: string;
    lineUpImage: string | null;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    level: string;
    matchDate: string | null;
    competitionName: string | null;
    venue: string | null;
    createdAt: string;
    updatedAt: string;
    result: MatchResultData | null;
    matchClubs: MatchClubData[];
    user: UploaderData;
    views?: number;
}

interface Match extends BaseMatch {
    teamName: string;
    opponentName: string;
    score: string;
    country: string | undefined;
}

type SortOption = "recent" | "oldest" | "mostViewed";

// ============================================================================
// 2. MAIN COMPONENT
// ============================================================================

export default function Matches() {
    const router = useRouter();

    // State with explicit Types
    const [matches, setMatches] = useState<BaseMatch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [selectedLevel, setSelectedLevel] = useState<string>("");

    const fetchMatches = async (): Promise<void> => {
        setLoading(true);
        try {
            const client = await getClient();
            const res = await client.get("/match/all-match");
            setMatches(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch matches", err);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    // Derived Data & Filtering Logic
    const filteredAndSortedMatches = useMemo((): Match[] => {
        const derived: Match[] = matches.map((match) => {
            const homeClub = match.matchClubs.find(c => c.isUsersTeam);
            const awayClub = match.matchClubs.find(c => !c.isUsersTeam);
            const homeScore = match.result?.homeScore ?? '-';
            const awayScore = match.result?.awayScore ?? '-';

            return {
                ...match,
                teamName: homeClub?.name || 'Home Team',
                opponentName: awayClub?.name || 'Opponent',
                score: `${homeScore} - ${awayScore}`,
                country: homeClub?.country,
            };
        });

        const filtered = derived.filter((m) => {
            const matchesSearch = !searchQuery ||
                m.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.opponentName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = !selectedLevel || m.level === selectedLevel;
            return matchesSearch && matchesLevel;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === "mostViewed") return (b.views || 0) - (a.views || 0);
            return 0;
        });
    }, [matches, searchQuery, selectedLevel, sortBy]);

    return (
        <div className="min-h-screen bg-[#05060B] text-white p-4 sm:p-10 selection:bg-cyan-500/30">
            <div className="max-w-7xl mx-auto">

                {/* TOP NAV & TITLES */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r text-white">
                            Match Events
                        </h1>
                        <p className="text-cyan-400/60 font-mono text-sm tracking-widest uppercase">
                            {filteredAndSortedMatches.length} events found
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-cyan-500/30 transition-all active:scale-95">
                                Fast Event
                            </button>
                            <button
                                onClick={() => router.push("/dashboard/form")}
                                className="bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                            >
                                Create New Event
                            </button>
                        </div>

                        {/* ARRANGE BY (PILL DESIGN) */}
                        <div className="flex items-center gap-4 bg-[#0B0D19]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5">
                            <span className="text-blue-500 font-bold text-[10px] uppercase tracking-widest pl-2">Arrange by:</span>
                            <div className="flex gap-2">
                                {(["recent", "oldest", "mostViewed"] as const).map((id, idx) => (
                                    <button
                                        key={id}
                                        onClick={() => setSortBy(id)}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${sortBy === id ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-white/5 hover:bg-white/10"
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border font-bold ${sortBy === id ? "border-white" : "border-blue-500 text-blue-500"
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${sortBy === id ? "text-white" : "text-blue-500"
                                            }`}>
                                            {id.replace("mostViewed", "Popular")}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH SECTION */}
                <div className="mb-12 relative group">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH MATCHES OR TEAMS..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0B0D19]/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold tracking-widest uppercase focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-700 backdrop-blur-sm"
                    />
                </div>

                {/* GRID */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400/40 uppercase">Loading Data</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredAndSortedMatches.map((match) => (
                            <div key={match.id} className="group bg-[#0B0D19]/60 border border-white/5 rounded-[2rem] p-6 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 hover:translate-y-[-4px]">
                                {/* User Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border-2 border-red-500 p-0.5">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${match.user.name}&background=random`}
                                                className="w-full h-full rounded-full object-cover"
                                                alt="user"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0B0D19] rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500 font-black text-sm tracking-tighter uppercase">{match.user.name}</span>
                                            <span className="text-gray-600 text-[10px] font-bold uppercase">Posted</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white text-xs font-black italic tracking-widest">EVENT:</span>
                                            <span className="text-gray-500 text-[9px] uppercase font-black tracking-widest">{match.level.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnail */}
                                <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-inner group-hover:border-white/10 transition-colors">
                                    <img
                                        src={match.lineUpImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400"}
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        alt="Match Preview"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D19] via-transparent to-transparent opacity-60"></div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-8 px-1">
                                    <h3 className="text-cyan-400 font-black text-lg italic tracking-tighter uppercase leading-tight">
                                        {match.teamName} <span className="text-white/20 not-italic font-medium mx-1">VS</span> {match.opponentName}
                                    </h3>
                                    <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                        <FiFlag className="text-blue-500 w-3 h-3" />
                                        <span>{match.country || "GLOBAL"}, {match.venue || "HQ"}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-6">
                                    <div className="flex gap-6">
                                        <FiUserPlus className="text-gray-600 w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                                        <div className="flex items-center gap-2 text-cyan-400">
                                            <FiEye className="w-5 h-5" />
                                            <span className="text-xs font-black italic">{match.views || 0}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/dashboard/matches/${match.id}`)}
                                        className="bg-cyan-400 hover:bg-cyan-300 text-black px-10 py-2.5 rounded-xl font-black italic text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95"
                                    >
                                        Analyze Match
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}