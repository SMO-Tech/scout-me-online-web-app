"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient } from "@/lib/api/client";
import {
  FiArrowLeft,
  FiMapPin,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ApiPlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  avatar: string | null;
  primaryPosition: string;
  status: "UNCLAIMED" | "CLAIMED";
  ownerId: string | null;
  createdAt: string;
}

export default function PlayerProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id as string;

  const [profile, setProfile] = useState<ApiPlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const client = await getClient();
        const res = await client.get(`/player/${profileId}`);
        setProfile(res.data.data);
      } catch (err: any) {
        toast.error("Failed to load profile");
        router.push("/dashboard/scouting-profiles");
      } finally {
        setLoading(false);
      }
    };

    if (profileId) fetchProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const age = calculateAge(profile.dateOfBirth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard/scouting-profiles")}
          className="flex items-center gap-2 text-purple-600 mb-6"
        >
          <FiArrowLeft /> Back to Profiles
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold">{fullName}</h1>

                <div className="flex flex-wrap gap-4 mt-3 text-white/90">
                  <div className="flex items-center gap-2">
                    <FiUser /> {profile.primaryPosition}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin /> {profile.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar /> {age} years
                  </div>
                </div>

                {/* Status */}
                {profile.status === "UNCLAIMED" && (
                  <span className="inline-block mt-4 px-3 py-1 text-sm font-semibold bg-yellow-400 text-black rounded-full">
                    Unclaimed Profile
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-800 ">{fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold  text-gray-800 ">{profile.primaryPosition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-semibold  text-gray-800 ">{profile.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ⬇️ EVERYTHING BELOW KEPT AS IS ⬇️ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold  text-gray-800 mb-2">Recent Matches</h2>
            <p className="text-gray-600">Match history will be displayed here.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold  text-gray-800 mb-2">Statistics</h2>
            <p className="text-gray-600">Performance statistics will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
