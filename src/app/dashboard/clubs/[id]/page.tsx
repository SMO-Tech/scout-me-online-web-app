"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiArrowLeft, FiMapPin, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import DashboardNav from "@/components/layout/DashboardNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Club {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

export default function ClubDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params?.id as string;
  
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClub = async () => {
    if (!clubId) {
      setError("Club ID is missing");
      setLoading(false);
      router.push("/dashboard/clubs");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const client = await getClient();
      const res = await client.get(`/club/${clubId}`);
      // API returns: { status: "success", message: "...", data: { id, name, country, logoUrl } }
      setClub(res.data?.data || null);
    } catch (err: any) {
      console.error("Failed to fetch club", err);
      const errorMessage = err.response?.data?.message || "Failed to load club details";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If club not found, redirect after a delay
      if (err.response?.status === 404) {
        setTimeout(() => {
          router.push("/dashboard/clubs");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
     
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-gray-50">
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push("/dashboard/clubs")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Clubs</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Club Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The club you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.push("/dashboard/clubs")}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Go Back to Clubs
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
          onClick={() => router.push("/dashboard/clubs")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Clubs</span>
        </button>

        {/* Club Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Club Logo */}
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                {club.logoUrl ? (
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FiUsers className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Club Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-3">{club.name}</h1>
                {club.country && (
                  <div className="flex items-center gap-2 text-white/90 justify-center md:justify-start">
                    <FiMapPin className="w-5 h-5" />
                    <span className="text-lg">{club.country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Club Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Club Information Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUsers className="w-6 h-6 text-purple-600" />
                  Club Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Club Name</span>
                    <p className="text-lg font-semibold text-gray-900">{club.name}</p>
                  </div>
                  {club.country && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Country</span>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiMapPin className="w-4 h-4 text-purple-600" />
                        {club.country}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Club ID</span>
                    <p className="text-sm text-gray-500 font-mono">{club.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections - Placeholder for future features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Players Section - Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Players</h2>
            <p className="text-gray-600">Player list will be displayed here.</p>
          </div>

          {/* Matches Section - Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
            <p className="text-gray-600">Match history will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

