"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiExternalLink, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface Match {
  id: string | number;
  status: "PENDING" | "PROCESSING" | "COMPLETED";
  cratedAt?: string;
  createdAt?: string;
}

export default function LibraryPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStatus, setOpenStatus] = useState<"ALL" | "PENDING" | "PROCESSING" | "COMPLETED">("ALL");

  const statusColors: Record<string, string> = {
    ALL: "bg-gray-200 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  const statusIcons: Record<string, any> = {
    PENDING: FiAlertCircle,
    PROCESSING: FiClock,
    COMPLETED: FiCheckCircle,
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const client = await getClient();
      const res = await client.get("/match/");
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };


  const grouped = {
    PENDING: matches.filter((m) => m.status === "PENDING"),
    PROCESSING: matches.filter((m) => m.status === "PROCESSING"),
    COMPLETED: matches.filter((m) => m.status === "COMPLETED"),
    ALL: matches,
  };

  const toggleStatus = (status: "ALL" | "PENDING" | "PROCESSING" | "COMPLETED") => {
    setOpenStatus(openStatus === status ? "ALL" : status);
  };

  const handleMatchClick = (match: Match) => {
    router.push(`/dashboard/library/${match.id}`);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Match Library</h1>
        <p className="text-gray-600 mb-6">View and analyze your match data</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No matches found.</p>
          </div>
        ) : (
          <>
            {/* Status filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {(["ALL", "PENDING", "PROCESSING", "COMPLETED"] as const).map((status) => {
                const Icon = status !== "ALL" ? statusIcons[status] : null;
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-sm transition-all ${
                      openStatus === status
                        ? "ring-2 ring-purple-500 scale-105"
                        : "hover:ring-1 hover:ring-gray-400 hover:scale-[1.02]"
                    } ${statusColors[status]}`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{status}</span>
                    <span className="bg-black/10 text-gray-800 text-xs px-2 py-0.5 rounded-full font-bold">
                      {grouped[status].length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Match cards */}
            {(["ALL", "PENDING", "PROCESSING", "COMPLETED"] as const).map(
              (status) =>
                openStatus === status && grouped[status].length > 0 && (
                  <div key={status} className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      {status === "ALL" ? "All Matches" : status + " Matches"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped[status].map((match) => {
                        const StatusIcon = statusIcons[match.status];
                        return (
                          <div
                            key={match.id}
                            onClick={() => handleMatchClick(match)}
                            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-purple-300"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                                  #
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">Match</p>
                                  <p className="text-xs text-gray-500 font-mono">{String(match.id).slice(0, 8)}...</p>
                                </div>
                              </div>
                              <span
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  statusColors[match.status] || "bg-gray-200 text-gray-800"
                                }`}
                              >
                                {StatusIcon && <StatusIcon className="w-3 h-3" />}
                                {match.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {formatDate(match.cratedAt || match.createdAt)}
                            </p>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                                View Details <FiExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
}
