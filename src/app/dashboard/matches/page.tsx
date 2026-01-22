"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getClient } from "@/lib/api/client";
import { createMatchUrl } from "@/lib/utils/slug";
import { FiSearch, FiEye, FiArrowRight } from "react-icons/fi";
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

export default function Matches() {
    const router = useRouter();

    const [matches, setMatches] = useState<BaseMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const client = await getClient();
            const res = await client.get("/match/all-match");
            console.log(res.data);
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
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-10">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Match Events
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            {filteredAndSortedMatches.length} events found in library
                        </p>
                        
                        {/* ACTIVE FILTERS DISPLAY */}
                        <div className="pt-2">
                            {selectedGender || selectedLevel || selectedLocation ? (
                                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Filters Active:</p>
                            ) : null}

                            <div className="flex flex-wrap gap-2">
                                {selectedGender && (
                                    <button
                                        onClick={() => setSelectedGender("")}
                                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-orange-300 rounded-full px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
                                    >
                                        <PiGenderIntersexThin className="text-orange-500" size={16} /> 
                                        {selectedGender}
                                        <IoIosCloseCircle className="text-gray-400 hover:text-red-500" />
                                    </button>
                                )}

                                {selectedLocation && (
                                    <button
                                        onClick={() => setSelectedLocation("")}
                                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-orange-300 rounded-full px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
                                    >
                                        <FaLocationDot className="text-orange-500" size={14} /> 
                                        {selectedLocation}
                                        <IoIosCloseCircle className="text-gray-400 hover:text-red-500" />
                                    </button>
                                )}

                                {selectedLevel && (
                                    <button
                                        onClick={() => setSelectedLevel("")}
                                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-orange-300 rounded-full px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
                                    >
                                        {/* Assuming this is a static icon, kept as is */}
                                        <Image src={"/images/performance.png"} width={16} height={16} alt="Performance icon" className="opacity-60" /> 
                                        {selectedLevel}
                                        <IoIosCloseCircle className="text-gray-400 hover:text-red-500" />
                                    </button>
                                )}

                                {(selectedGender || selectedLocation || selectedLevel) && (
                                    <button
                                        onClick={() => {
                                            setSelectedGender("");
                                            setSelectedLocation("");
                                            setSelectedLevel("");
                                        }}
                                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 px-2 py-1.5"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard/form")}
                            className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-orange-600/20 active:scale-95"
                        >
                            + Create New Event
                        </button>

                        {/* SORT */}
                        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-400 font-semibold text-xs pl-2 hidden sm:inline">Sort:</span>
                            <div className="flex gap-1">
                                {(["recent", "oldest", "mostViewed"] as const).map((id, idx) => (
                                    <button
                                        key={id}
                                        onClick={() => setSortBy(id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            sortBy === id 
                                            ? "bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-100" 
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        {id.replace("mostViewed", "Popular").replace("recent", "Newest").replace("oldest", "Oldest")}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH + FILTER TOOLBAR */}
                <div className="mb-10 flex flex-col md:flex-row items-stretch gap-3">
                    {/* search bar */}
                    <div className="relative group flex-1">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search matches, teams or opponents..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-6 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                        />
                    </div>

                    {/* filter dropdown toggle */}
                    <div className="relative z-20">
                        <button
                            onClick={() => setShowFilter(p => !p)}
                            className={`h-full px-6 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                showFilter 
                                ? "border-orange-500 bg-orange-50 text-orange-700" 
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                           <span>Filters</span> 
                           <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                                {Number(!!selectedLevel) + Number(!!selectedLocation) + Number(!!selectedGender)}
                           </span>
                        </button>

                        {showFilter && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-1">
                                    <button
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-2"
                                        onClick={() => {
                                            setSelectedLevel("");
                                            setSelectedLocation("");
                                            setSelectedGender("");
                                            setShowFilter(false);
                                        }}
                                    >
                                        Reset All Filters
                                    </button>

                                    {/* Location */}
                                    <div className="px-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</div>
                                    <select
                                        value={selectedLocation}
                                        onChange={e => setSelectedLocation(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border-gray-100 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-100 mb-2 cursor-pointer"
                                    >
                                        <option value="">Any Location</option>
                                        {ALL_COUNTRIES.map((country, index) => (
                                            <option key={index} value={country}>{country}</option>
                                        ))}
                                    </select>

                                    {/* Level */}
                                    <div className="px-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Performance Level</div>
                                    <select
                                        value={selectedLevel}
                                        onChange={e => setSelectedLevel(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border-gray-100 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-100 mb-2 cursor-pointer"
                                    >
                                        <option value="">Any Level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Professional">Professional</option>
                                    </select>

                                    {/* Gender */}
                                    <div className="px-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender</div>
                                    <select
                                        value={selectedGender}
                                        onChange={e => setSelectedGender(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border-gray-100 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                                    >
                                        <option value="">Any Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* GRID CONTENT */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAndSortedMatches.map(match => (
                            <div key={match.id} className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">

                                {/* USER / UPLOADER INFO */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full border border-gray-100 p-0.5 shadow-sm">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${match.user.name}&background=random`}
                                                className="w-full h-full rounded-full object-cover"
                                                alt={match.user.name}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-bold text-sm">{match.user.name}</span>
                                        <span className="text-gray-400 text-xs">Coach / Uploader</span>
                                    </div>
                                </div>

                                {/* THUMBNAIL IMAGE */}
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-5 bg-gray-100 border border-gray-100">
                                    <img
                                        src={match.lineUpImage || "/images/default/default_football_pitch.PNG"}
                                        alt={`${match.teamName} vs ${match.opponentName}`}
                                        className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/images/default/default_football_pitch.PNG";
                                        }}
                                    />
                                    
                                    {/* Overlay Badge for Status (Optional addition for clarity) */}
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                        {match.status}
                                    </div>
                                </div>

                                {/* MATCH DETAILS */}
                                <div className="space-y-3 mb-6">
                                    <div>
                                        <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors">
                                            {match.teamName} <span className="text-gray-400 font-normal text-sm">vs</span> {match.opponentName}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Match Date: {match.matchDate ? new Date(match.matchDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                            <PiGenderIntersexThin className="text-gray-400" />
                                            <span>Male</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                            <FaLocationDot className="text-gray-400" size={10} />
                                            <span className="truncate max-w-[120px]">{match.country || "Global"}, {match.venue || "HQ"}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                             {/* Keeping Image, just adjusting opacity */}
                                            <Image src={"/images/performance-icon.png"} width={12} height={12} alt="Level" className="opacity-50" />
                                            <span>{match.level}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER ACTION */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <FiEye className="w-4 h-4" />
                                        <span className="text-xs font-medium">{match.views || 0} views</span>
                                    </div>

                                    <button
                                        onClick={() => router.push(createMatchUrl(`${match.teamName} vs ${match.opponentName}`, match.id))}
                                        className="text-gray-900 hover:text-orange-600 text-sm font-bold flex items-center gap-1 transition-colors"
                                    >
                                        View Analysis <FiArrowRight />
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