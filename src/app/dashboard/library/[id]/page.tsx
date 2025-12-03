"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiArrowLeft, FiExternalLink, FiUsers, FiActivity, FiCheckCircle, FiAlertCircle, FiClock, FiPlay } from "react-icons/fi";

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
        
        // Set page title for SEO
        const shortId = matchId.slice(0, 8);
        document.title = `Match Analysis ${shortId} | ScoutMe.cloud`;
      } catch (err: any) {
        console.error("Failed to fetch match details:", err);
        setError(err.response?.data?.message || "Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  // Convert time string (MM:SS or HH:MM:SS) to seconds
  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  // Generate YouTube URL with timestamp (4 seconds before the event)
  const getVideoUrlWithTimestamp = (startTime: string): string => {
    if (!match?.videoUrl) return '#';
    
    const seconds = timeToSeconds(startTime);
    const startAt = Math.max(0, seconds - 4); // 4 seconds before, minimum 0
    
    // Handle different YouTube URL formats
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

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "successful":
        return "bg-green-100 text-green-800 border-green-300";
      case "intercepted":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "lost":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPassTypeColor = (type: string) => {
    switch (type) {
      case "short":
        return "bg-blue-50 text-blue-700";
      case "medium":
        return "bg-purple-50 text-purple-700";
      case "long":
        return "bg-indigo-50 text-indigo-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const statusIcons: Record<string, any> = {
    PENDING: FiAlertCircle,
    PROCESSING: FiClock,
    COMPLETED: FiCheckCircle,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Match Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested match analysis could not be found."}</p>
          <button
            onClick={() => router.push("/dashboard/library")}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 mx-auto"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Match Library
          </button>
        </div>
      </div>
    );
  }

  const totalPasses = match.analysis?.result.length || 0;
  const successfulPasses = match.analysis?.result.filter(p => p.outcome === "successful").length || 0;
  const interceptedPasses = match.analysis?.result.filter(p => p.outcome === "intercepted").length || 0;
  const lostPasses = match.analysis?.result.filter(p => p.outcome === "lost").length || 0;
  const passAccuracy = totalPasses > 0 ? ((successfulPasses / totalPasses) * 100).toFixed(1) : "0";

  const StatusIcon = statusIcons[match.status];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `Football Match Analysis - ${match.id}`,
    "description": `AI-powered match analysis with ${totalPasses} passes and ${passAccuracy}% accuracy`,
    "identifier": match.id,
    "sport": "Soccer",
    "statistics": {
      "totalPasses": totalPasses,
      "successfulPasses": successfulPasses,
      "interceptedPasses": interceptedPasses,
      "lostPasses": lostPasses,
      "passAccuracy": parseFloat(passAccuracy),
      "playerCount": match.players.length
    }
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/dashboard/library")}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Match Library</span>
            </button>
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">Match Analysis</h1>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      match.status === "COMPLETED" 
                        ? "bg-green-500/30 text-white" 
                        : match.status === "PROCESSING"
                        ? "bg-blue-500/30 text-white"
                        : "bg-yellow-500/30 text-white"
                    }`}>
                      {StatusIcon && <StatusIcon className="w-4 h-4" />}
                      {match.status}
                    </span>
                  </div>
                  <p className="text-purple-100 text-sm font-mono">{match.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video URL Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-200 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FiExternalLink className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Video Source</h2>
            </div>
            <a
              href={match.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-2 break-all"
            >
              {match.videoUrl}
              <FiExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>

          {/* Stats Overview */}
          {match.analysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-gray-900 mb-2">{totalPasses}</div>
                <div className="text-sm text-gray-600 font-medium">Total Passes</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-green-700 mb-2">{successfulPasses}</div>
                <div className="text-sm text-green-600 font-medium">Successful</div>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-orange-700 mb-2">{interceptedPasses}</div>
                <div className="text-sm text-orange-600 font-medium">Intercepted</div>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-red-700 mb-2">{passAccuracy}%</div>
                <div className="text-sm text-red-600 font-medium">Accuracy</div>
              </div>
            </div>
          )}

          {/* Players Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiUsers className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Players ({match.players.length})</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {match.players.map((player, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-purple-600">#{player.jerseyNumber}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                      {player.position}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{player.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Results */}
          {match.analysis && match.analysis.result.length > 0 && (() => {
            // Get unique teams from the data
            const uniqueTeams = [...new Set([
              ...match.analysis!.result.map(e => e.passer_team),
              ...match.analysis!.result.map(e => e.receiver_team).filter(Boolean)
            ])] as string[];

            // Filter the events
            const filteredEvents = match.analysis!.result.filter(event => {
              const matchesOutcome = outcomeFilter === "all" || event.outcome === outcomeFilter;
              const matchesType = passTypeFilter === "all" || event.pass_type === passTypeFilter;
              const matchesTeam = teamFilter === "all" || 
                event.passer_team === teamFilter || 
                event.receiver_team === teamFilter;
              return matchesOutcome && matchesType && matchesTeam;
            });

            const clearFilters = () => {
              setOutcomeFilter("all");
              setPassTypeFilter("all");
              setTeamFilter("all");
            };

            const hasActiveFilters = outcomeFilter !== "all" || passTypeFilter !== "all" || teamFilter !== "all";

            return (
            <div>
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pass Analysis ({filteredEvents.length}{filteredEvents.length !== match.analysis!.result.length ? ` of ${match.analysis!.result.length}` : ''} events)
                  </h2>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Filters:</span>
                  
                  {/* Outcome Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Outcome:</label>
                    <select
                      value={outcomeFilter}
                      onChange={(e) => setOutcomeFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All</option>
                      <option value="successful">Successful</option>
                      <option value="intercepted">Intercepted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>

                  {/* Pass Type Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Type:</label>
                    <select
                      value={passTypeFilter}
                      onChange={(e) => setPassTypeFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All</option>
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>

                  {/* Team Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Team:</label>
                    <select
                      value={teamFilter}
                      onChange={(e) => setTeamFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All Teams</option>
                      {uniqueTeams.map((team) => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                    {outcomeFilter !== "all" && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getOutcomeColor(outcomeFilter)}`}>
                        Outcome: {outcomeFilter}
                        <button onClick={() => setOutcomeFilter("all")} className="hover:opacity-70">×</button>
                      </span>
                    )}
                    {passTypeFilter !== "all" && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getPassTypeColor(passTypeFilter)}`}>
                        Type: {passTypeFilter}
                        <button onClick={() => setPassTypeFilter("all")} className="hover:opacity-70">×</button>
                      </span>
                    )}
                    {teamFilter !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Team: {teamFilter}
                        <button onClick={() => setTeamFilter("all")} className="hover:opacity-70">×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No events match the selected filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Watch</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Outcome</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Passer</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Receiver</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Distance</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Teams</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEvents.map((event, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-purple-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {event.start_time} - {event.end_time}
                          </td>
                          <td className="px-4 py-4">
                            <a
                              href={getVideoUrlWithTimestamp(event.start_time)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all transform hover:scale-105"
                              title={`Watch at ${event.start_time} (starts 4s earlier)`}
                            >
                              <FiPlay className="w-3 h-3" />
                              Play
                            </a>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getOutcomeColor(
                                event.outcome
                              )}`}
                            >
                              {event.outcome}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getPassTypeColor(
                                event.pass_type
                              )}`}
                            >
                              {event.pass_type}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            <span className="font-semibold">#{event.passer_id}</span>
                            <span className="text-gray-500 ml-1">({event.passer_team})</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {event.receiver_id ? (
                              <>
                                <span className="font-semibold">#{event.receiver_id}</span>
                                <span className="text-gray-500 ml-1">({event.receiver_team})</span>
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {event.distance_m !== null ? (
                              <span className="font-medium">{event.distance_m.toFixed(1)}m</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-blue-600 font-medium">{event.passer_team}</span>
                              {event.receiver_team && (
                                <span className="text-purple-600 font-medium">→ {event.receiver_team}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
            );
          })()}

          {/* SEO-friendly footer section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                This match analysis was generated using AI-powered performance analytics. The data includes detailed pass tracking, 
                player statistics, and comprehensive performance metrics. All statistics are automatically calculated from video analysis 
                and provide insights into team performance, player contributions, and match dynamics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

