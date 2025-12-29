"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiArrowLeft } from "react-icons/fi";

/* =========================
   Types
========================= */
interface Player {
  id: string;
  firstName: string;
  lastName: string;
  country?: string;
  primaryPosition?: string;
  dateOfBirth?: string;
  avatar?: string;
}

/* =========================
   Helpers
========================= */
const formatName = (p: Player) => `${p.firstName} ${p.lastName}`;

const calculateAge = (dob?: string) => {
  if (!dob || dob === "01-01-1900") return "—";
  const [d, m, y] = dob.split("-").map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const diff =
    today.getMonth() - birth.getMonth() ||
    today.getDate() - birth.getDate();
  if (diff < 0) age--;
  return age.toString();
};

/* =========================
   Page
========================= */
export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ids = searchParams.get("players")?.split(",") || [];

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length !== 2) {
      router.replace("/dashboard/scouting-profiles");
      return;
    }

    const fetchPlayers = async () => {
      try {
        const client = await getClient();
        const responses = await Promise.all(
          ids.map((id) => client.get(`/player/${id}`))
        );
        setPlayers(responses.map((r) => r.data.data));
      } catch {
        router.replace("/dashboard/scouting-profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (players.length !== 2) return null;

  const [p1, p2] = players;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
        >
          <FiArrowLeft />
          Back
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Player Comparison
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Side-by-side overview of selected players
          </p>
        </div>

        {/* PLAYER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[p1, p2].map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border shadow-sm p-6 text-center"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={formatName(p)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  formatName(p)
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                )}
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {formatName(p)}
              </h2>

              <p className="text-sm text-gray-600">
                {p.primaryPosition || "—"}
              </p>
            </div>
          ))}
        </div>

        {/* COMPARISON DETAILS */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {[
            {
              label: "Age",
              v1: calculateAge(p1.dateOfBirth),
              v2: calculateAge(p2.dateOfBirth),
            },
            {
              label: "Position",
              v1: p1.primaryPosition,
              v2: p2.primaryPosition,
            },
            {
              label: "Country",
              v1: p1.country,
              v2: p2.country,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 border-t first:border-t-0"
            >
              <div className="p-4 bg-gray-50 text-sm font-semibold text-gray-600">
                {row.label}
              </div>
              <div className="p-4 text-center font-medium text-gray-900">
                {row.v1 || "—"}
              </div>
              <div className="p-4 text-center font-medium text-gray-900 border-l">
                {row.v2 || "—"}
              </div>
            </div>
          ))}
        </div>

        {/* ADVANCED COMPARISON (COMING SOON) */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {[
              { label: "Overview", active: true },
              { label: "Stats", active: false },
              { label: "Performance", active: false },
              { label: "Heatmap", active: false },
            ].map((tab) => (
              <div
                key={tab.label}
                className={`px-6 py-3 text-sm font-semibold border-r last:border-r-0
                  ${
                    tab.active
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {tab.label}
                {!tab.active && (
                  <span className="ml-2 text-xs">(Coming soon)</span>
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm max-w-xl mx-auto">
              Advanced comparison metrics such as match statistics,
              performance trends, and positional heatmaps will be available
              once verified data sources are connected.
            </p>
          </div>
        </div>
      </div>

      {/* FUTURE OPTIONS BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6 text-sm">
          <span className="font-semibold text-gray-700">
            More comparison options:
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400">
            Stats (coming soon)
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400">
            Performance history (coming soon)
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400">
            Heatmap (coming soon)
          </span>
        </div>
      </div>
    </div>
  );
}
