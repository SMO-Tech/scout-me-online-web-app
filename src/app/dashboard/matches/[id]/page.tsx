"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    FiSearch, FiVideo,
    FiCheckCircle, FiXCircle, FiFilter, FiX,
    FiLoader, FiAlertTriangle, FiPlay
} from 'react-icons/fi';
import { useFetchMatchResult } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { extractMatchId } from '@/lib/utils/slug';
import { useSEO } from '@/hooks/useSEO';
import { getYouTubeVideoId } from '@/lib/utils/youtubeVIdeo';


// TYPE DEFINITIONS

interface RawPass {
    time: string;
    frame: number;
    result: string;
    to_team: string;
    from_team: string;
    pass_type: string;
    to_player: number | string;
    from_player: number | string;
    confidence: number;
    passer_x?: number;
    passer_y?: number;
    distance_px?: number;
}

interface PassEvent {
    id: number;
    time: number;
    formattedTime: string;
    fromPlayer: string;
    fromTeam: 'Blue' | 'Red' | 'Unknown';
    toPlayer: string;
    toTeam: 'Blue' | 'Red' | 'Unknown';
    type: string;
    result: 'Success' | 'Fail' | 'Unknown';
    confidence: number;
    colorClass: string;
}

interface MatchReport {
    passes: RawPass[];
    total_passes?: number;
}

interface MatchClubData {
    id: string;
    name: string;
    isUsersTeam: boolean;
    club: { logoUrl: string | null } | null;
}

type FilterType = 'All' | 'Blue' | 'Red' | 'Success' | 'Fail' | 'Unknown';


// UTILITY FUNCTIONS
const parseTimeString = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return 0;
};

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getTeams = (matchClubs: MatchClubData[]) => ({
    home: matchClubs?.find(c => c.isUsersTeam),
    away: matchClubs?.find(c => !c.isUsersTeam),
});

const transformPassData = (rawPasses: RawPass[]): PassEvent[] => {
    return rawPasses.map((p, index) => ({
        id: index + 1,
        time: parseTimeString(p.time),
        formattedTime: p.time,
        fromPlayer: p.from_player?.toString() || '?',
        fromTeam: (p.from_team || 'Unknown') as 'Blue' | 'Red' | 'Unknown',
        toPlayer: p.to_player?.toString() || '?',
        toTeam: (p.to_team || 'Unknown') as 'Blue' | 'Red' | 'Unknown',
        type: p.pass_type || 'Pass',
        result: (p.result || 'Unknown') as 'Success' | 'Fail' | 'Unknown',
        confidence: p.confidence || 0,
        colorClass: p.pass_type === 'Key Pass' ? 'bg-indigo-500' : 'bg-purple-500',
    }));
};

// VIDEO PLAYER COMPONENT

interface VideoPlayerProps {
    youtubeVideoId: string | null;
    passList: PassEvent[];
    duration: number;
    onSeek: (time: number) => void;
}

const VideoPlayer = ({
    youtubeVideoId,
    passList,
    duration,
    onSeek
}: VideoPlayerProps) => {
    const [localCurrentTime, setLocalCurrentTime] = useState(0);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        clickX = Math.max(0, Math.min(clickX, rect.width));
        const percent = clickX / rect.width;
        const newTime = percent * duration;
        setLocalCurrentTime(newTime);
        onSeek(newTime);
    }, [duration, onSeek]);

    return (
        <section className="bg-[#0b0f1a] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-20 bg-indigo-500" />
            
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
                        key={localCurrentTime} // Force reload when seeking
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}?start=${Math.floor(localCurrentTime)}&autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0`}
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

            {/* Interactive Timeline Controls */}
            <div className="mt-4 bg-[#0b0f1a] border border-white/5 rounded-2xl p-4 md:p-6">
                <div className="space-y-2 w-full">
                    <div
                        onClick={handleProgressClick}
                        className="h-3 md:h-2.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                    >
                        <div
                            className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            style={{ width: `${duration > 0 ? (localCurrentTime / duration) * 100 : 0}%` }}
                        />

                        {/* Pass markers on timeline */}
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
                        <span>{formatTime(localCurrentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};


// PASS LOG TABLE COMPONENT

interface PassLogTableProps {
    filteredPasses: PassEvent[];
    searchQuery: string;
    filter: FilterType;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterType) => void;
    onPassSelect: (pass: PassEvent) => void;
}

const PassLogTable = ({
    filteredPasses,
    searchQuery,
    filter,
    onSearchChange,
    onFilterChange,
    onPassSelect
}: PassLogTableProps) => {
    const filters: FilterType[] = ['All', 'Blue', 'Red', 'Success', 'Fail', 'Unknown'];

    return (
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
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full md:w-80 bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-[11px] font-bold tracking-widest uppercase placeholder:text-white/10"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-1.5 rounded-2xl w-fit">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            filter === f
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
                                    onClick={() => onPassSelect(pass)}
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
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shadow-lg ${
                                                    pass.fromTeam === 'Blue' ? 'bg-blue-600' :
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
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shadow-lg ${
                                                    pass.toTeam === 'Blue' ? 'bg-blue-600' :
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
    );
};


// REPLAY MODAL COMPONENT

interface ReplayModalProps {
    selectedPass: PassEvent;
    youtubeVideoId: string;
    onClose: () => void;
}

const ReplayModal = ({ selectedPass, youtubeVideoId, onClose }: ReplayModalProps) => {
    const statsData = useMemo(() => [
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
    ], [selectedPass]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#0b0f1a] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all hover:scale-110"
                    aria-label="Close modal"
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

                {/* Video Container */}
                <div className="w-full bg-black shrink-0">
                    <div className="w-full aspect-video border-y border-white/10">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&start=${Math.floor(selectedPass.time)}`}
                            title="AI Action Replay"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 bg-[#0b0f1a]">
                    {statsData.map((info) => (
                        <div key={info.label} className="flex flex-col gap-1">
                            <div className="text-[9px] font-black text-white/20 tracking-[0.2em]">
                                {info.label}
                            </div>
                            <div className={`text-sm font-black uppercase italic tracking-tight ${info.color}`}>
                                {info.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// SCOUT REPORT COMPONENT

interface ScoutReportProps {
    videoUrl: string | undefined;
    matchReport: MatchReport | null;
}

const ScoutReport = ({ videoUrl, matchReport }: ScoutReportProps) => {
    const [duration, setDuration] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('All');
    const [selectedPass, setSelectedPass] = useState<PassEvent | null>(null);
    const [passList, setPassList] = useState<PassEvent[]>([]);
    const [seekTime, setSeekTime] = useState(0);

    const youtubeVideoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);

    // Transform API data into PassEvent format
    useEffect(() => {
        if (matchReport?.passes && Array.isArray(matchReport.passes)) {
            const passes = transformPassData(matchReport.passes);
            setPassList(passes);

            // Set duration based on last pass time + 1 minute
            if (passes.length > 0) {
                const lastPassTime = Math.max(...passes.map(p => p.time));
                setDuration(lastPassTime + 20); // Last pass + 1 minute
            }
        }
    }, [matchReport]);

    // Filter passes based on search and filter
    const filteredPasses = useMemo(() => {
        return passList.filter(pass => {
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
    }, [passList, searchQuery, filter]);

    const handleSeek = useCallback((time: number) => setSeekTime(time), []);
    const handleFilterChange = useCallback((newFilter: FilterType) => setFilter(newFilter), []);
    const handleSearchChange = useCallback((query: string) => setSearchQuery(query), []);
    const handlePassSelect = useCallback((pass: PassEvent) => setSelectedPass(pass), []);
    const handleCloseModal = useCallback(() => setSelectedPass(null), []);

    return (
        <div className="min-h-screen bg-[#05070a] text-slate-100 pb-20">
            <main className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">
                <VideoPlayer
                    youtubeVideoId={youtubeVideoId}
                    passList={passList}
                    duration={duration}
                    onSeek={handleSeek}
                />

                <PassLogTable
                    filteredPasses={filteredPasses}
                    searchQuery={searchQuery}
                    filter={filter}
                    onSearchChange={handleSearchChange}
                    onFilterChange={handleFilterChange}
                    onPassSelect={handlePassSelect}
                />

                {selectedPass && youtubeVideoId && (
                    <ReplayModal
                        selectedPass={selectedPass}
                        youtubeVideoId={youtubeVideoId}
                        onClose={handleCloseModal}
                    />
                )}
            </main>
        </div>
    );
};


// MAIN PAGE COMPONENT
const MatchDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const slugOrId = params.id as string;
    const matchId = extractMatchId(slugOrId);

    const { data: apiResponse, isLoading, error } = useFetchMatchResult(matchId);

    const videoUrl = apiResponse?.data?.videoUrl;
    const matchDetailRaw = apiResponse?.data?.data?.[0];
    const matchReport: MatchReport | null = matchDetailRaw?.match_report || null;
    const matchClubs = matchDetailRaw?.matchClubs || [];
    const { home: homeTeam } = getTeams(matchClubs);

    const matchTitle = matchDetailRaw ? 'Match Analysis' : 'Match Analysis';

    useSEO({
        title: `${matchTitle} | ScoutMe.cloud`,
        description: 'Detailed match analysis, player stats, and tactical insights on ScoutMe.cloud.',
        image: homeTeam?.club?.logoUrl || '/images/default/club_default.PNG',
        url: typeof window !== 'undefined' ? window.location.href : '',
        type: 'article',
        siteName: 'ScoutMe.cloud',
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#05060B]">
                <FiLoader className="animate-spin text-cyan-400" size={48} />
            </div>
        );
    }

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
            <ScoutReport videoUrl={videoUrl} matchReport={matchReport} />
        </div>
    );
};

export default MatchDetailPage;