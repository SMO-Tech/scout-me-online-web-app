"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiArrowLeft, FiMapPin, FiUser, FiCalendar, FiTrendingUp, FiEye, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PlayerProfile {
  id: string;
  name: string;
  age?: number;
  position?: string;
  country?: string;
  level?: string;
  gender?: string;
  profileImage?: string;
  scoutScore?: number;
  totalMatches?: number;
  lastActive?: string;
  createdAt?: string;
  views?: number;
  bio?: string;
  profileType?: "Scout" | "Player" | "Analyst" | "Coach";
  attributes?: {
    longPass?: number;
    shortPass?: number;
    dribbling?: number;
    shooting?: number;
    defending?: number;
    speed?: number;
    stamina?: number;
    [key: string]: number | undefined;
  };
}

export default function PlayerProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id as string;
  
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!profileId) {
      setError("Profile ID is missing");
      setLoading(false);
      router.push("/dashboard/scouting-profiles");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const client = await getClient();
      console.log("Fetching profile with ID:", profileId);
      console.log("Endpoint:", `/player/${profileId}`);
      const res = await client.get(`/player/${profileId}`);
      console.log("Profile response:", res.data);
      // API returns: { status: "success", message: "...", data: { ... } }
      setProfile(res.data?.data || res.data || null);
    } catch (err: any) {
      console.error("Failed to fetch player profile", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to load player profile";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If profile not found, redirect after a delay
      if (err.response?.status === 404) {
        setTimeout(() => {
          router.push("/dashboard/scouting-profiles");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push("/dashboard/scouting-profiles")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Profiles</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The profile you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.push("/dashboard/scouting-profiles")}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Go Back to Profiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/scouting-profiles")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Profiles</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FiUser className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-3">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 justify-center md:justify-start">
                  {profile.position && (
                    <div className="flex items-center gap-2">
                      <FiUser className="w-5 h-5" />
                      <span className="text-lg">{profile.position}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-5 h-5" />
                      <span className="text-lg">{profile.country}</span>
                    </div>
                  )}
                  {profile.age && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-5 h-5" />
                      <span className="text-lg">{profile.age} years</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Profile Information Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="w-6 h-6 text-purple-600" />
                  Profile Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name</span>
                    <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                  </div>
                  {profile.position && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Position</span>
                      <p className="text-lg font-semibold text-gray-900">{profile.position}</p>
                    </div>
                  )}
                  {profile.age && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Age</span>
                      <p className="text-lg font-semibold text-gray-900">{profile.age} years</p>
                    </div>
                  )}
                  {profile.country && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Country</span>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiMapPin className="w-4 h-4 text-purple-600" />
                        {profile.country}
                      </p>
                    </div>
                  )}
                  {profile.level && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Level</span>
                      <p className="text-lg font-semibold text-gray-900">{profile.level}</p>
                    </div>
                  )}
                  {profile.gender && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Gender</span>
                      <p className="text-lg font-semibold text-gray-900">{profile.gender}</p>
                    </div>
                  )}
                  {profile.profileType && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Profile Type</span>
                      <p className="text-lg font-semibold text-gray-900">{profile.profileType}</p>
                    </div>
                  )}
                  {profile.scoutScore !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Scout Score</span>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiTrendingUp className="w-4 h-4 text-purple-600" />
                        {profile.scoutScore}
                      </p>
                    </div>
                  )}
                  {profile.totalMatches !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total Matches</span>
                      <p className="text-lg font-semibold text-gray-900">{profile.totalMatches}</p>
                    </div>
                  )}
                  {profile.views !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Views</span>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiEye className="w-4 h-4 text-purple-600" />
                        {profile.views}
                      </p>
                    </div>
                  )}
                  {profile.bio && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Bio</span>
                      <p className="text-sm text-gray-700 mt-1">{profile.bio}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Profile ID</span>
                    <p className="text-sm text-gray-500 font-mono">{profile.id}</p>
                  </div>
                </div>
              </div>

              {/* Attributes Section (if available) */}
              {profile.attributes && Object.keys(profile.attributes).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiStar className="w-6 h-6 text-purple-600" />
                    Attributes
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(profile.attributes).map(([key, value]) => (
                      value !== undefined && (
                        <div key={key} className="bg-white rounded-lg p-3">
                          <span className="text-xs font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <p className="text-lg font-bold text-purple-600">{value}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections - Placeholder for future features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matches Section - Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
            <p className="text-gray-600">Match history will be displayed here.</p>
          </div>

          {/* Statistics Section - Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
            <p className="text-gray-600">Performance statistics will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

