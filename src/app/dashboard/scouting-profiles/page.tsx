"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiX,
} from "react-icons/fi";

/* =========================
   Types
========================= */
interface PlayerProfile {
  id: string;
  name: string;
  age?: number;
  position?: string;
  country?: string;
  profileImage?: string;
  createdAt?: string;
  status?: string;
}

/* =========================
   Helpers
========================= */
const formatName = (first?: string, last?: string) =>
  [first, last]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const isFakeDOB = (dob?: string) => dob === "01-01-1900";

const calculateAge = (dob?: string) => {
  if (!dob || isFakeDOB(dob)) return undefined;
  const [day, month, year] = dob.split("-").map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

/* =========================
   Page
========================= */
export default function ScoutingProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      }
      if (prev.length === 2) {
        return prev; // hard stop at 2
      }
      return [...prev, id];
    });
  };



  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const client = await getClient();
      const res = await client.get("player");

      const normalized: PlayerProfile[] = (res.data?.data || []).map(
        (p: any) => ({
          id: p.id,
          name: formatName(p.firstName, p.lastName),
          age: calculateAge(p.dateOfBirth),
          position: p.primaryPosition,
          country: p.country,
          profileImage: p.avatar,
          createdAt: p.createdAt,
          status: p.status,
        })
      );

      setProfiles(normalized);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
  }, [profiles, searchQuery]);

  return (
    <div className="min-h-screen px-6 py-8 pb-28 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Scouting Profiles
          </h1>
          <p className="text-sm text-gray-600">
            Registered football players
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, position, or country"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
    w-full pl-10 pr-4 py-2
    border rounded-lg
    bg-white
    text-gray-900
    placeholder:text-gray-400
    focus:ring-2 focus:ring-purple-500
    focus:outline-none
  "
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() =>
                  router.push(
                    `/dashboard/scouting-profiles/${profile.id}`
                  )
                }
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden relative"
              >
                {/* UNCLAIMED BADGE */}
                {profile.status === "UNCLAIMED" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowClaimModal(true);
                    }}
                    className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Unclaimed
                  </button>
                )}
                <div className="absolute top-3 left-3 flex items-center space-x-1 z-10">
                  {/* COMPARE CHECKBOX BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(profile.id);
                    }}
                    disabled={
                      compareList.length === 2 &&
                      !compareList.includes(profile.id)
                    }
                    // Positioning classes (absolute top-3 left-3) removed from here
                    className={`w-5 h-5 rounded border flex items-center justify-center text-xs font-bold transition flex-shrink-0
        ${compareList.includes(profile.id)
                        ? "bg-purple-600 border-purple-600 text-white"
                        : compareList.length === 2
                          ? "bg-gray-100 border-gray-300 text-transparent cursor-not-allowed opacity-50"
                          : "bg-white border-gray-300 text-transparent hover:border-purple-400"
                      } 
      `}
                  >
                    ✓
                  </button>

                  {/* The word "Compare" placed next to the button */}
                  <span
                    className={`text-sm font-medium transition-colors duration-200 hidden sm:block
        ${compareList.includes(profile.id)
                        ? "text-purple-600" // Text turns purple when selected
                        : compareList.length === 2
                          ? "text-gray-400 cursor-not-allowed" // Text is grayed out when disabled
                          : "text-gray-700 hover:text-purple-600" // Normal state
                      }
      `}
                  >
                    Compare
                  </span>
                </div>



                {/* Avatar */}
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {profile.name}
                  </h3>

                  {profile.position && (
                    <div className="mt-1 inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                      {profile.position}
                    </div>
                  )}

                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    {profile.country && (
                      <div className="flex items-center gap-2">
                        <FiMapPin />
                        <span>{profile.country}</span>
                      </div>
                    )}

                    {profile.age !== undefined && (
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        <span>{profile.age} years old</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLAIM MODAL */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FiX size={18} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Claim a Player Profile
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              This player profile has not yet been claimed by the player
              or their official representative.
            </p>

            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Create or log into your account</li>
              <li>Open the player’s profile page</li>
              <li>Click <strong>“Claim Profile”</strong></li>
              <li>Complete identity verification</li>
            </ol>

            <p className="mt-4 text-xs text-gray-500">
              False claims will result in permanent suspension.
            </p>
          </div>
        </div>
      )}
      {/* STICKY COMPARE BAR */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-purple-400 border-t shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

            {/* Selected players */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Compare:
              </span>

              {compareList.map((id) => {
                const player = profiles.find((p) => p.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800"
                  >
                    {player?.name}
                    <button
                      onClick={() => toggleCompare(id)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                );
              })}

              {compareList.length === 1 && (
                <span className="text-sm text-gray-500">
                  Select one more player
                </span>
              )}
            </div>

            {/* Compare CTA */}
            <button
              disabled={compareList.length !== 2}
              onClick={() =>
                router.push(
                  `/dashboard/compare?players=${compareList.join(",")}`
                )
              }
              className={`px-5 py-2 rounded-lg font-semibold transition
          ${compareList.length === 2
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
        `}
            >
              Compare Players
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
