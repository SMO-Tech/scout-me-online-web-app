"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiPlus, FiSearch, FiFilter, FiUsers, FiMapPin, FiCalendar, FiEye, FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

interface Club {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

type SortOption = "recentJoin" | "oldest" | "mostViewed";

// Comprehensive list of countries
const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
            <p className="text-sm text-gray-600 mt-1">Discover and connect with football clubs</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Club</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
              }`}
            >
              <FiFilter className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {[selectedCountry].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border-2 border-transparent"
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                    <button
                      onClick={() => { setSortBy("recentJoin"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "recentJoin" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Recent Join
                    </button>
                    <button
                      onClick={() => { setSortBy("oldest"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "oldest" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Oldest
                    </button>
                    <button
                      onClick={() => { setSortBy("mostViewed"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "mostViewed" ? "bg-purple-50 text-purple-700" : "text-gray-700"
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAndSortedClubs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg mb-2">
              {hasActiveFilters ? "No clubs found with these filters." : "No clubs available yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters to see all clubs
              </button>
            )}
            {!hasActiveFilters && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Create Your First Club
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              {hasActiveFilters ? (
                <>Showing {filteredAndSortedClubs.length} of {clubs.length} clubs</>
              ) : (
                <>Showing all {filteredAndSortedClubs.length} clubs (sorted by recent join)</>
              )}
            </div>

            {/* Club Cards Grid */}
            <div className="grid grid-cols- sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedClubs.map((club) => (
                <Link
                  href={`/dashboard/clubs/${club.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200"

                >
                  {/* Club Logo/Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center relative">
                    {club.logoUrl ? (
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <FiUsers className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Club Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                    
                    {/* Basic Info */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {club.country && (
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>{club.country}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/clubs/${club.id}`);
                        }}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                      >
                        View Club
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Club Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Club</h2>
              <p className="text-sm text-gray-600 mt-1">Create a club and invite players to join</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Club Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  placeholder="Enter club name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={newClub.country}
                  onChange={(e) => setNewClub({ ...newClub, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {ALL_COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Optional)</label>
                <input
                  type="url"
                  value={newClub.logoUrl}
                  onChange={(e) => setNewClub({ ...newClub, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewClub({
                    name: "",
                    country: "",
                    logoUrl: "",
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={creatingClub}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClub}
                disabled={creatingClub || !newClub.name.trim()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

