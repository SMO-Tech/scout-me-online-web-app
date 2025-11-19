"use client";
import { getClient } from "@/lib/api/client";
import { useEffect, useState } from "react";

export default function LibraryPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const client = await  getClient()
      console.log("🔧 Axios Client Config:");
console.log("➡️ Base URL:", client.defaults.baseURL);
console.log("➡️ Headers:", client.defaults.headers);
      const res = await client.get("/match/"); // replace with your endpoint
      console.log(res.data)
      // setMatches(json.data || []);
    } catch (err) {
      console.error("Failed to fetch matches", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Match Library</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : matches.length === 0 ? (
        <p className="text-gray-600">No matches found.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match: any) => (
            <div
              key={match.id}
              className="border rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium">Match #{match.id}</p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-semibold">{match.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Created: {formatDate(match.cratedAt)}
                </p>
              </div>

              <button className="px-4 py-1 border border-black rounded-md hover:bg-black hover:text-white transition">
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
