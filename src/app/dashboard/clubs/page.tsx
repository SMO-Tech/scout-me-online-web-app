"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiPlus, FiSearch, FiFilter, FiUsers, FiMapPin, FiCalendar, FiEye, FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
import { ALL_COUNTRIES } from "@/staticdata/countries";

interface Club {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

type SortOption = "recentJoin" | "oldest" | "mostViewed";



const GENDER_OPTIONS = ["Male", "Female"];

export default function ClubsPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recentJoin");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Create club form state
  const [newClub, setNewClub] = useState({
    name: "",
    country: "",
    logoUrl: "",
  });
  const [creatingClub, setCreatingClub] = useState(false);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const client = await getClient();
      const res = await client.get("/club/");
      console
      // API returns: { status: "success", message: "...", data: [...] }
      setClubs(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch clubs", err);
      setClubs([]);
      toast.error("Failed to load clubs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Filter and sort clubs
  const filteredAndSortedClubs = useMemo(() => {
    let filtered = clubs.filter((club) => {
      // Search filter
      const matchesSearch = !searchQuery || 
        club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.country?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by selected options
      const matchesCountry = !selectedCountry || club.country === selectedCountry;

      return matchesSearch && matchesCountry;
    });

    // Sort clubs - simplified since API doesn't provide date/views
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recentJoin":
          // Since we don't have dates, sort alphabetically by name
          return a.name.localeCompare(b.name);
        case "oldest":
          // Reverse alphabetical
          return b.name.localeCompare(a.name);
        case "mostViewed":
          // Since we don't have views, sort by country then name
          return (a.country || "").localeCompare(b.country || "") || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [clubs, searchQuery, selectedCountry, sortBy]);

  const handleCreateClub = async () => {
    if (!newClub.name.trim()) {
      toast.error("Club name is required");
      return;
    }

    setCreatingClub(true);
    try {
      const client = await getClient();
      const res = await client.post("/clubs", newClub);
      
      // Refresh clubs list
      await fetchClubs();
      
      // Show success and close modal
      toast.success("Club created successfully!");
      setShowCreateModal(false);
      setNewClub({
        name: "",
        country: "",
        logoUrl: "",
      });
      
      // API response: { status: "success", message: "...", data: { id, name, country, logoUrl } }
      // No invite URL in the API response, so we don't need to handle it
    } catch (err: any) {
      console.error("Failed to create club", err);
      toast.error(err.response?.data?.message || "Failed to create club");
    } finally {
      setCreatingClub(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Invite URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const clearFilters = () => {
    setSelectedCountry("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCountry || searchQuery;


  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Football Clubs
            </h1>
            <p className="text-base text-gray-400 mt-2">Discover and connect with clubs worldwide ⚽</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Club</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-5 mb-8 border border-gray-800">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/50"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              <FiFilter className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-cyan-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  {[selectedCountry].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all border border-gray-700"
              >
                <FiCalendar className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {sortBy === "recentJoin" ? "Recent Join" : sortBy === "oldest" ? "Oldest" : "Most Viewed"}
                </span>
              </button>
              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl py-1 z-20 border border-gray-700">
                    <button
                      onClick={() => { setSortBy("recentJoin"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 flex items-center gap-2 transition-colors ${
                        sortBy === "recentJoin" ? "bg-purple-600/20 text-purple-400" : "text-gray-300"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Recent Join
                    </button>
                    <button
                      onClick={() => { setSortBy("oldest"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 flex items-center gap-2 transition-colors ${
                        sortBy === "oldest" ? "bg-purple-600/20 text-purple-400" : "text-gray-300"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Oldest
                    </button>
                    <button
                      onClick={() => { setSortBy("mostViewed"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 flex items-center gap-2 transition-colors ${
                        sortBy === "mostViewed" ? "bg-purple-600/20 text-purple-400" : "text-gray-300"
                      }`}
                    >
                      <FiEye className="w-4 h-4" />
                      Most Viewed
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {ALL_COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 font-medium">Loading clubs...</p>
          </div>
        ) : filteredAndSortedClubs.length === 0 ? (
          <div className="text-center py-24 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <FiUsers className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {hasActiveFilters ? "No clubs found" : "No clubs yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {hasActiveFilters ? "Try adjusting your filters to see more results." : "Be the first to create a club!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors"
              >
                Clear all filters
              </button>
            )}
            {!hasActiveFilters && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5" />
                Create Your First Club
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-400 italic">
                {hasActiveFilters ? (
                  <>Showing {filteredAndSortedClubs.length} of {clubs.length} clubs</>
                ) : (
                  <>Showing all {filteredAndSortedClubs.length} clubs</>
                )}
              </span>
              <span className="text-xs text-gray-500">(sorted by {sortBy === "recentJoin" ? "recent join" : sortBy === "oldest" ? "oldest" : "most viewed"})</span>
            </div>

            {/* Club Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedClubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/dashboard/clubs/${club.id}`}
                  className="group bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-800 hover:border-purple-500/50"
                >
                  {/* Club Logo Section */}
                  <div className="relative h-44 bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 flex items-center justify-center p-6 overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-cyan-500/0 group-hover:from-purple-600/10 group-hover:to-cyan-500/10 transition-all duration-500" />
                    
                    <img
                      src={club.logoUrl || '/images/default/club_default.PNG'}
                      alt={club.name}
                      className="max-h-32 max-w-[80%] object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default/club_default.PNG';
                      }}
                    />
                  </div>

                  {/* Club Content */}
                  <div className="p-5 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {club.name}
                    </h3>
                    
                    {/* Country Badge */}
                    {club.country && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <FiMapPin className="w-4 h-4 text-purple-400" />
                        <span className="truncate">{club.country}</span>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/dashboard/clubs/${club.id}`);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transform group-hover:scale-[1.02]"
                    >
                      View Club
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Club Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-purple-500/10 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-purple-600/10 to-cyan-500/10">
              <h2 className="text-2xl font-bold text-white">Create New Club ⚽</h2>
              <p className="text-sm text-gray-400 mt-1">Build your team and start your journey</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Club Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Club Name <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  placeholder="e.g. FC United"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Country</label>
                <select
                  value={newClub.country}
                  onChange={(e) => setNewClub({ ...newClub, country: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Country</option>
                  {ALL_COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Logo URL <span className="text-gray-500 font-normal">(Optional)</span></label>
                <input
                  type="url"
                  value={newClub.logoUrl}
                  onChange={(e) => setNewClub({ ...newClub, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewClub({
                    name: "",
                    country: "",
                    logoUrl: "",
                  });
                }}
                className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
                disabled={creatingClub}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClub}
                disabled={creatingClub || !newClub.name.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg"
              >
                {creatingClub ? "Creating..." : "Create Club"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

