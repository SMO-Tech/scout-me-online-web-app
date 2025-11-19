"use client";
import { useEffect, useState } from "react";
import { getClient } from "@/lib/api/client";

interface Match {
  id: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED";
  cratedAt: string;
}

export default function LibraryPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStatus, setOpenStatus] = useState<"ALL" | "PENDING" | "PROCESSING" | "COMPLETED">("ALL");

  const statusColors: Record<string, string> = {
    ALL: "bg-gray-200 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
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

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  const grouped = {
    PENDING: matches.filter((m) => m.status === "PENDING"),
    PROCESSING: matches.filter((m) => m.status === "PROCESSING"),
    COMPLETED: matches.filter((m) => m.status === "COMPLETED"),
    ALL: matches,
  };

  const toggleStatus = (status: "ALL" | "PENDING" | "PROCESSING" | "COMPLETED") => {
    setOpenStatus(openStatus === status ? "ALL" : status);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Match Library</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : matches.length === 0 ? (
        <p className="text-gray-600">No matches found.</p>
      ) : (
        <>
          {/* Small button-style status filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(["ALL", "PENDING", "PROCESSING", "COMPLETED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-sm transition ${
                  openStatus === status
                    ? "ring-2 ring-black"
                    : "hover:ring-1 hover:ring-gray-400"
                } ${statusColors[status]}`}
              >
                <span>{status}</span>
                <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {grouped[status].length}
                </span>
              </button>
            ))}
          </div>

          {/* Collapsible lists */}
          {(["ALL", "PENDING", "PROCESSING", "COMPLETED"] as const).map(
            (status) =>
              openStatus === status && grouped[status].length > 0 && (
                <div key={status} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {status === "ALL" ? "All Matches" : status + " Matches"}
                  </h2>
                  <div className="space-y-2">
                    {grouped[status].map((match) => (
                      <div
                        key={match.id}
                        className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                      >
                        <div>
                          <p className="font-medium">Match #{match.id}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(match.cratedAt)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[match.status] || "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {match.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </>
      )}
    </div>
  );
}
