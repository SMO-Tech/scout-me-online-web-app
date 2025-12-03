"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiArrowLeft, FiExternalLink, FiPlay, FiFilter, FiX } from "react-icons/fi";

interface Player {
  name: string;
  jerseyNumber: number;
  position: string;
}

interface PassEvent {
  outcome: "successful" | "intercepted" | "lost";
  end_time: string;
  end_frame: number;
  pass_type: "short" | "medium" | "long" | "unknown";
  passer_id: number;
  distance_m: number | null;
  start_time: string;
  passer_team: string;
  receiver_id: number | null;
  start_frame: number;
  receiver_team: string | null;
}

interface MatchDetails {
  id: string;
  videoUrl: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED";
  players: Player[];
  analysis?: {
    result: PassEvent[];
  };
}

export default function MatchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params?.id as string;

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const [passTypeFilter, setPassTypeFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");

  useEffect(() => {
    if (!matchId) {
      setError("Match ID is missing");
      setLoading(false);
      return;
    }

    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const client = await getClient();
        const res = await client.get(`/match/${matchId}`);
        setMatch(res.data.data);
        
        const shortId = matchId.slice(0, 8);
        document.title = `Match ${shortId} | ScoutMe.cloud`;
      } catch (err: any) {
        console.error("Failed to fetch match details:", err);
        setError(err.response?.data?.message || "Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const getVideoUrlWithTimestamp = (startTime: string): string => {
    if (!match?.videoUrl) return '#';
    const seconds = timeToSeconds(startTime);
    const startAt = Math.max(0, seconds - 4);
    
    let videoId = '';
    const url = match.videoUrl;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    
    if (!videoId) return match.videoUrl;
    return `https://www.youtube.com/watch?v=${videoId}&t=${startAt}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Match Not Found</h1>
          <p className="text-gray-500 text-sm mb-4">{error || "Could not find this match."}</p>
          <button
            onClick={() => router.push("/dashboard/library")}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  const totalPasses = match.analysis?.result.length || 0;
  const successfulPasses = match.analysis?.result.filter(p => p.outcome === "successful").length || 0;
  const interceptedPasses = match.analysis?.result.filter(p => p.outcome === "intercepted").length || 0;
  const passAccuracy = totalPasses > 0 ? ((successfulPasses / totalPasses) * 100).toFixed(0) : "0";

  // Get unique teams
  const uniqueTeams = match.analysis ? [...new Set([
    ...match.analysis.result.map(e => e.passer_team),
    ...match.analysis.result.map(e => e.receiver_team).filter(Boolean)
  ])] as string[] : [];

  // Filter events
  const filteredEvents = match.analysis?.result.filter(event => {
    const matchesOutcome = outcomeFilter === "all" || event.outcome === outcomeFilter;
    const matchesType = passTypeFilter === "all" || event.pass_type === passTypeFilter;
    const matchesTeam = teamFilter === "all" || event.passer_team === teamFilter || event.receiver_team === teamFilter;
    return matchesOutcome && matchesType && matchesTeam;
  }) || [];

  const hasActiveFilters = outcomeFilter !== "all" || passTypeFilter !== "all" || teamFilter !== "all";
  const clearFilters = () => {
    setOutcomeFilter("all");
    setPassTypeFilter("all");
    setTeamFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/library")}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">Match Analysis</h1>
                <p className="text-xs text-gray-500 font-mono">{match.id.slice(0, 16)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                match.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                match.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {match.status}
              </span>
              <a
                href={match.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
              >
                <FiExternalLink className="w-4 h-4" />
                Video
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Stats Row */}
        {match.analysis && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border text-center">
              <div className="text-2xl font-bold text-gray-900">{totalPasses}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-white rounded-lg p-3 border text-center">
              <div className="text-2xl font-bold text-green-600">{successfulPasses}</div>
              <div className="text-xs text-gray-500">Success</div>
            </div>
            <div className="bg-white rounded-lg p-3 border text-center">
              <div className="text-2xl font-bold text-orange-600">{interceptedPasses}</div>
              <div className="text-xs text-gray-500">Intercepted</div>
            </div>
            <div className="bg-white rounded-lg p-3 border text-center">
              <div className="text-2xl font-bold text-purple-600">{passAccuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        )}

        {/* Players - Compact */}
        <div className="bg-white rounded-lg border mb-4">
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <span className="font-medium text-sm text-gray-900">Players ({match.players.length})</span>
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {match.players.map((player, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm">
                <span className="font-semibold text-purple-600">#{player.jerseyNumber}</span>
                <span className="text-gray-700">{player.name}</span>
                <span className="text-xs text-gray-400">{player.position}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pass Analysis Table */}
        {match.analysis && match.analysis.result.length > 0 && (
          <div className="bg-white rounded-lg border">
            {/* Table Header */}
            <div className="px-4 py-2 border-b flex items-center justify-between">
              <span className="font-medium text-sm text-gray-900">
                Pass Events ({filteredEvents.length}{hasActiveFilters ? ` of ${match.analysis.result.length}` : ''})
              </span>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700">
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded ${showFilters ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiFilter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters - Collapsible */}
            {showFilters && (
              <div className="px-4 py-3 border-b bg-gray-50 flex flex-wrap items-center gap-4">
                <select
                  value={outcomeFilter}
                  onChange={(e) => setOutcomeFilter(e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Outcomes</option>
                  <option value="successful">Successful</option>
                  <option value="intercepted">Intercepted</option>
                  <option value="lost">Lost</option>
                </select>
                <select
                  value={passTypeFilter}
                  onChange={(e) => setPassTypeFilter(e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Teams</option>
                  {uniqueTeams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Table */}
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No events match filters.{' '}
                <button onClick={clearFilters} className="text-purple-600 hover:underline">Clear</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Time</th>
                      <th className="px-4 py-2 text-left font-medium">Watch</th>
                      <th className="px-4 py-2 text-left font-medium">Outcome</th>
                      <th className="px-4 py-2 text-left font-medium">Type</th>
                      <th className="px-4 py-2 text-left font-medium">From</th>
                      <th className="px-4 py-2 text-left font-medium">To</th>
                      <th className="px-4 py-2 text-left font-medium">Dist</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEvents.map((event, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900 font-mono text-xs">
                          {event.start_time}
                        </td>
                        <td className="px-4 py-2">
                          <a
                            href={getVideoUrlWithTimestamp(event.start_time)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                          >
                            <FiPlay className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            event.outcome === "successful" ? "bg-green-100 text-green-700" :
                            event.outcome === "intercepted" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {event.outcome}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            event.pass_type === "short" ? "bg-blue-50 text-blue-600" :
                            event.pass_type === "medium" ? "bg-purple-50 text-purple-600" :
                            event.pass_type === "long" ? "bg-indigo-50 text-indigo-600" :
                            "bg-gray-50 text-gray-600"
                          }`}>
                            {event.pass_type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          <span className="font-medium">#{event.passer_id}</span>
                          <span className="text-gray-400 text-xs ml-1">{event.passer_team}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {event.receiver_id ? (
                            <>
                              <span className="font-medium">#{event.receiver_id}</span>
                              <span className="text-gray-400 text-xs ml-1">{event.receiver_team}</span>
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {event.distance_m !== null ? `${event.distance_m.toFixed(1)}m` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
