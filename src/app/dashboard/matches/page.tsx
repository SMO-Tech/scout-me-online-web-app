"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getClient } from "@/lib/api/client";
import { createMatchUrl } from "@/lib/utils/slug";
import {
    FiPlus, FiSearch, FiEye, FiVideo
} from "react-icons/fi";
import { dummyMatches } from "@/staticdata/match";
import { PiGenderIntersexThin } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { ALL_COUNTRIES } from "@/staticdata/countries";

interface MatchResultData {
    homeScore: number;
    awayScore: number;
}

interface MatchClubData {
    name: string;
    isUsersTeam: boolean;
    jerseyColor: string | null;
    club: { logoUrl: string | null } | null;
    country: string;
}

interface UploaderData {
    name: string;
}

export interface BaseMatch {
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

interface LegacyMatch {
    id: number;
    youtube_link: string;
    user: {
        name: string;
        email: string;
        userId: string;
        photoUrl: string | null;
    };
    teams: {
        home: string;
        away: string;
        display: string;
    };
    score: {
        home: number;
        away: number;
        display: string;
        result: string;
    };
    date: string;
    venue: string;
    formation: {
        home: string;
        away: string | null;
        display: string;
    };
    players: {
        starting: number;
        substitutes: number;
        display: string;
    };
    duration: string | null;
}

export default function Matches() {
    const router = useRouter();

    const [matches, setMatches] = useState<BaseMatch[]>(dummyMatches);
    const [legacyMatches, setLegacyMatches] = useState<LegacyMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingLegacy, setLoadingLegacy] = useState(false);
    const [loadingMoreLegacy, setLoadingMoreLegacy] = useState(false);
    const [legacyPagination, setLegacyPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasMore: false
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [showPastEvents, setShowPastEvents] = useState(false);

    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedGender, setSelectedGender] = useState("");

    const [showFilter, setShowFilter] = useState(false);
    const isLoadingMoreRef = useRef(false);

    const formatDuration = (duration: string | null): string => {
        if (!duration) return "";
        
        // Extract number and any additional text (like "with extra time")
        const match = duration.match(/(\d+)\s*['']?\s*(.*)/);
        if (!match) return duration;
        
        let totalSeconds = parseInt(match[1], 10);
        const extraText = match[2]?.trim() || "";
        
        // If number is > 200, assume it's in seconds (e.g., 2844 seconds = 47:24)
        // If number is <= 200, assume it's in minutes (e.g., 90 minutes = 1:30:00)
        if (totalSeconds <= 200) {
            totalSeconds = totalSeconds * 60; // Convert minutes to seconds
        }
        
        // Convert to hours, minutes, seconds
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Format based on duration
        let formatted = "";
        if (hours > 0) {
            formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Add extra time text if present and meaningful
        if (extraText && !extraText.match(/^['"]+$/) && extraText.length > 0) {
            formatted += ` (${extraText})`;
        }
        
        return formatted;
    };

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const client = await getClient();
            const res = await client.get("/match/all-match");
            console.log(res.data)
            setMatches(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch matches", err);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchLegacyMatches = useCallback(async (page: number = 1, append: boolean = false) => {
        if (append) {
            setLoadingMoreLegacy(true);
        } else {
            setLoadingLegacy(true);
        }
        
        try {
            const client = await getClient();
            const res = await client.get(`/match/legacy-match-info?page=${page}&limit=20`);
            console.log(res.data);
            
            const newMatches = res.data.data || [];
            const pagination = res.data.pagination || {
                page: 1,
                limit: 20,
                totalPages: 1,
                totalItems: 0
            };
            
            if (append) {
                setLegacyMatches(prev => [...prev, ...newMatches]);
            } else {
                setLegacyMatches(newMatches);
            }
            
            setLegacyPagination({
                currentPage: pagination.page,
                totalPages: pagination.totalPages,
                hasMore: pagination.page < pagination.totalPages
            });
        } catch (err) {
            console.error("Failed to fetch legacy matches", err);
            if (!append) {
                setLegacyMatches([]);
            }
        } finally {
            setLoadingLegacy(false);
            setLoadingMoreLegacy(false);
        }
    }, []);

    useEffect(() => {
        fetchMatches();
    }, []);

    useEffect(() => {
        if (showPastEvents) {
            fetchLegacyMatches(1, false);
        } else {
            // Reset when switching away from past events
            setLegacyMatches([]);
            setLegacyPagination({
                currentPage: 1,
                totalPages: 1,
                hasMore: false
            });
        }
    }, [showPastEvents, fetchLegacyMatches]);

    // Infinite scroll handler
    useEffect(() => {
        if (!showPastEvents || !legacyPagination.hasMore || loadingMoreLegacy || isLoadingMoreRef.current) return;

        let throttleTimer: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            if (throttleTimer) return;
            
            throttleTimer = setTimeout(() => {
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const clientHeight = document.documentElement.clientHeight;

                // Load more when user is 300px from bottom
                if (scrollTop + clientHeight >= scrollHeight - 300 && !isLoadingMoreRef.current) {
                    const nextPage = legacyPagination.currentPage + 1;
                    if (nextPage <= legacyPagination.totalPages && !isLoadingMoreRef.current) {
                        isLoadingMoreRef.current = true;
                        fetchLegacyMatches(nextPage, true).finally(() => {
                            isLoadingMoreRef.current = false;
                        });
                    }
                }
                
                throttleTimer = null;
            }, 200); // Throttle to every 200ms
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (throttleTimer) clearTimeout(throttleTimer);
        };
    }, [showPastEvents, legacyPagination.hasMore, legacyPagination.currentPage, legacyPagination.totalPages, loadingMoreLegacy]);

    const filteredAndSortedMatches = useMemo((): Match[] => {
        const derived: Match[] = matches.map(match => {
            const homeClub = match.matchClubs.find(c => c.isUsersTeam);
            const awayClub = match.matchClubs.find(c => !c.isUsersTeam);
            const homeScore = match.result?.homeScore ?? "-";
            const awayScore = match.result?.awayScore ?? "-";

            return {
                ...match,
                teamName: homeClub?.name || "Home Team",
                opponentName: awayClub?.name || "Opponent",
                score: `${homeScore} - ${awayScore}`,
                country: homeClub?.country,
            };
        });

        const filtered = derived.filter(m => {
            const q = searchQuery.toLowerCase();

            const matchesSearch =
                !q ||
                m.teamName.toLowerCase().includes(q) ||
                m.opponentName.toLowerCase().includes(q);

            const matchesLevel =
                !selectedLevel || m.level === selectedLevel;

            const matchesLocation =
                !selectedLocation || m.country === selectedLocation;

            const matchesGender =
                !selectedGender || selectedGender === "Male"; // placeholder — adapt later

            return matchesSearch && matchesLevel && matchesLocation && matchesGender;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === "mostViewed") return (b.views || 0) - (a.views || 0);
            return 0;
        });
    }, [matches, searchQuery, selectedLevel, selectedLocation, selectedGender, sortBy]);

    return (
        <div className="min-h-screen bg-[#0A0B15] text-white p-4 sm:p-10 selection:bg-cyan-500/30">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r text-white">
                            Match Events
                        </h1>
                        <p className="text-cyan-400/60 font-mono text-sm tracking-widest uppercase">
                            {showPastEvents ? legacyMatches.length : filteredAndSortedMatches.length} events found
                        </p>
                        <div>
                            {selectedGender || selectedLevel || selectedLocation ?
                                <p className="mb-1 text-sm font-medium">Filters Applied</p> : <p className="mb-1 text-sm font-medium">Filters Applied :</p>
                            }

                            <div className="flex flex-wrap gap-2">

                                {selectedGender && (
                                    <button
                                        onClick={() => setSelectedGender("")}
                                        className="flex items-center gap-1 border text-[#00FFF3] hover:border-white border-green-500 rounded-md px-2 py-1 text-sm"
                                    >
                                        <PiGenderIntersexThin color="#00FFF3" size={20} />: {selectedGender}
                                        <IoIosCloseCircle />
                                    </button>
                                )}

                                {selectedLocation && (
                                    <button
                                        onClick={() => setSelectedLocation("")}
                                        className="flex items-center gap-1 border text-[#00FFF3] hover:border-white border-green-500 rounded-md px-2 py-1 text-sm"
                                    >
                                        <FaLocationDot color="#00FFF3" size={20} />: {selectedLocation}
                                        <IoIosCloseCircle />
                                    </button>
                                )}

                                {selectedLevel && (
                                    <button
                                        onClick={() => setSelectedLevel("")}
                                        className="flex items-center gap-1 border text-[#00FFF3] hover:border-white border-green-500 rounded-md px-2 py-1 text-sm"
                                    >
                                        <Image src={"/images/performance.png"} width={20} height={20} alt="Performance icon" />: {selectedLevel}
                                        <IoIosCloseCircle />
                                    </button>
                                )}

                                {(selectedGender || selectedLocation || selectedLevel) && (
                                    <button
                                        onClick={() => {
                                            setSelectedGender("");
                                            setSelectedLocation("");
                                            setSelectedLevel("");
                                        }}
                                        className="flex items-center gap-1 border hover:border-white border-pink-500 rounded-md px-2 py-1 text-sm"
                                    >
                                        Clear All
                                        <IoIosCloseCircle />
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard/form")}
                            className="bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                        >
                            Create New Event
                        </button>

                        <button
                            onClick={() => setShowPastEvents(!showPastEvents)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all active:scale-95 ${showPastEvents
                                    ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/50"
                                    : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10"
                                }`}
                        >
                            {showPastEvents ? "Current Events" : "Past Events"}
                        </button>

                        {/* SORT */}
                        {!showPastEvents && (
                            <div className="flex items-center gap-4 bg-[#0B0D19]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5">
                                <span className="text-blue-500 font-bold text-[10px] uppercase tracking-widest pl-2">Arrange by:</span>
                                <div className="flex gap-2">
                                    {(["recent", "oldest", "mostViewed"] as const).map((id, idx) => (
                                        <button
                                            key={id}
                                            onClick={() => setSortBy(id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${sortBy === id ? "text-green-600" : "bg-white/5 hover:bg-white/10"}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border font-bold ${sortBy === id ? "border-green-600" : "border-blue-500 text-blue-500"}`}>
                                                {idx + 1}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${sortBy === id ? "text-green-500" : "text-blue-500"}`}>
                                                {id.replace("mostViewed", "Popular")}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEARCH + FILTER */}
                <div className="mb-12 flex items-center gap-3">
                    {/* serach bar */}
                    <div className="relative group flex-1">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH MATCHES OR TEAMS..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0B0D19]/50 border border-white/50 rounded-2xl py-3 pl-14 pr-6 text-xs font-bold tracking-widest uppercase focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-400 backdrop-blur-sm"
                        />
                    </div>
                    {/* fiter functions */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilter(p => !p)}
                            className="p-3  rounded-2xl bg-[#0B0D19]/70 border border-cyan-500/40 text-sm font-bold uppercase tracking-wider hover:border-cyan-400 transition-all"
                        >
                            Filter
                        </button>

                        {showFilter && (
                            <div className="absolute right-0 mt-2 w-52 bg-black/90 border border-gray-700 rounded-xl shadow-xl z-50 text-xs uppercase tracking-wide">

                                <button
                                    className="block w-full text-left px-4 py-3 hover:bg-white/10"
                                    onClick={() => {
                                        setSelectedLevel("");
                                        setSelectedLocation("");
                                        setSelectedGender("");
                                        setShowFilter(false);
                                    }}
                                >
                                    Default
                                </button>

                                {/* Location */}
                                <select
                                    value={selectedLocation}
                                    onChange={e => setSelectedLocation(e.target.value)}
                                    className="w-full px-4 py-3 bg-black text-white outline-none hover:bg-white/10 appearance-none"
                                >
                                    <option className="bg-black" value="">
                                        Location
                                    </option>
                                    {ALL_COUNTRIES.map((country, index) => (
                                        <option
                                            key={index}
                                            className="bg-black"
                                            value={country}
                                        >
                                            {country}
                                        </option>
                                    ))}
                                </select>

                                {/* Level */}
                                <select
                                    value={selectedLevel}
                                    onChange={e => setSelectedLevel(e.target.value)}
                                    className="w-full px-4 py-3 bg-black text-white outline-none hover:bg-white/10 appearance-none"
                                >
                                    <option className="bg-black" value="">Level</option>
                                    <option className="bg-black" value="Beginner">Beginner</option>
                                    <option className="bg-black" value="Intermediate">Intermediate</option>
                                    <option className="bg-black" value="Professional">Professional</option>
                                </select>

                                {/* Gender */}
                                <select
                                    value={selectedGender}
                                    onChange={e => setSelectedGender(e.target.value)}
                                    className="w-full px-4 py-3 bg-black text-white outline-none hover:bg-white/10 appearance-none"
                                >
                                    <option className="bg-black" value="">Gender</option>
                                    <option className="bg-black" value="Male">Male</option>
                                    <option className="bg-black" value="Female">Female</option>
                                </select>

                            </div>

                        )}
                    </div>


                </div>

                {/* GRID */}
                {(loading || (showPastEvents && loadingLegacy)) ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-4 h-6 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : showPastEvents ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {legacyMatches.map(match => {
                            const resultText = match.score.result === match.teams.home || match.score.result === match.teams.away
                                ? match.score.result
                                : "Draw";
                            const isDraw = match.score.home === match.score.away;

                            return (
                                <div key={match.id} className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/20 hover:shadow-[0_0_25px_2px_rgba(34,211,238,0.7)] transition-all duration-500">
                                    {/* IMAGE */}
                                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-inner group-hover:border-white/10 transition-colors">
                                        <img
                                            src="/images/default/default_football_pitch.PNG"
                                            alt={match.teams.display}
                                            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/images/default/default_football_pitch.PNG";
                                            }}
                                        />
                                        <div className="absolute top-3 right-3">
                                            <a 
                                                href={match.youtube_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                            >
                                                <FiVideo size={20} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <h3 className="text-cyan-400 font-black text-lg italic uppercase leading-tight">
                                            {match.teams.display}
                                        </h3>
                                        
                                        {/* Score */}
                                        <div className="text-white font-semibold text-base">
                                            {match.score.home} - {match.score.away}
                                        </div>
                                        
                                        {/* Match Info - Two Column Layout */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-gray-400 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400/80">Result:</span>
                                                <span className="truncate">{isDraw ? "Draw" : resultText}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400/80">Date:</span>
                                                <span className="truncate">{match.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400/80">Venue:</span>
                                                <span className="truncate">{match.venue}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400/80">Formation:</span>
                                                <span className="truncate">{match.formation.display}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400/80">Players:</span>
                                                <span className="truncate">{match.players.display}</span>
                                            </div>
                                            {match.duration && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-cyan-400/80">Duration:</span>
                                                    <span className="truncate">{formatDuration(match.duration)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* USER INFO */}
                                    <div className="flex items-center gap-3 border-t border-white/10 pt-4 mb-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full border-2 border-purple-600 p-0.5 bg-gradient-to-br from-purple-600/20 to-cyan-500/20">
                                                {match.user.photoUrl ? (
                                                    <img
                                                        src={match.user.photoUrl}
                                                        alt={match.user.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.user.name)}&background=6366f1&color=fff&size=128&bold=true`;
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.user.name)}&background=6366f1&color=fff&size=128&bold=true`}
                                                        alt={match.user.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-blue-500 font-black text-xs uppercase">Created by</span>
                                            <span className="text-cyan-400 font-bold text-sm">{match.user.name}</span>
                                        </div>
                                    </div>

                                    {/* VIEW MORE BUTTON */}
                                    <div className="border-t border-white/10 pt-4">
                                        <button
                                            onClick={() => router.push(`/dashboard/matches/legacy/${match.id}`)}
                                            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-2.5 rounded-xl font-black italic text-[10px] uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                        
                        {/* Loading More Indicator */}
                        {loadingMoreLegacy && (
                            <div className="flex flex-col items-center justify-center py-10 gap-4 mt-6">
                                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-cyan-400 text-sm font-semibold">Loading more matches...</p>
                            </div>
                        )}
                        
                        {/* End of Results */}
                        {!legacyPagination.hasMore && legacyMatches.length > 0 && (
                            <div className="flex flex-col items-center justify-center py-6 mt-6">
                                <p className="text-gray-400 text-sm font-semibold">No more matches to load</p>
                                <p className="text-gray-500 text-xs mt-1">Showing {legacyMatches.length} matches</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredAndSortedMatches.map(match => (
                            <div key={match.id} className="group bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30 hover:shadow-[0_0_25px_2px_rgba(34,211,238,0.7)] hover:translate-y-[-4px] transition-all duration-500 ">

                                {/* USER */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border-4 border-purple-600 p-0.5">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${match.user.name}&background=random`}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0B0D19] rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-blue-500 font-black text-sm uppercase">{match.user.name}</span>
                                        {/* add ownes club name */}
                                        <span className="text-pink-400 font-black text-sm uppercase"></span>
                                    </div>
                                </div>

                                {/* IMAGE */}
                                <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-inner group-hover:border-white/10 transition-colors">
                                    <img
                                        src={match.lineUpImage || "/images/default/default_football_pitch.PNG"}
                                        alt={`${match.teamName} vs ${match.opponentName}`}
                                        className="w-full h-full  grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/images/default/default_football_pitch.PNG";
                                        }}
                                    />
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D19] opacity-60"></div> */}
                                </div>

                                {/* DETAILS */}
                                <div className="space-y-2 mb-8 px-1">
                                    <h3 className="text-cyan-400 font-black text-lg italic uppercase leading-tight">
                                        {match.teamName} <span className="text-[#E860E2]">VS</span> {match.opponentName}
                                    </h3>

                                    <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest">
                                        <PiGenderIntersexThin color="#00FFF3" size={20} />
                                        <span>Male</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest">
                                        <FaLocationDot color="#00FFF3" size={20} />
                                        <span>{match.country || "GLOBAL"}, {match.venue || "HQ"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest">
                                        <Image src={"/images/performance-icon.png"} width={20} height={20} alt="Performance icon" />
                                        <span>{match.country || "GLOBAL"}, {match.venue || "HQ"}</span>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-2 text-cyan-400">
                                        <FiEye />
                                        <span className="text-xs font-black italic">{match.views || 0}</span>
                                    </div>

                                    <button
                                        onClick={() => router.push(createMatchUrl(`${match.teamName} vs ${match.opponentName}`, match.id))}
                                        className="bg-cyan-400 hover:bg-cyan-300 text-black px-10 py-2.5 rounded-xl font-black italic text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        View Match
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
