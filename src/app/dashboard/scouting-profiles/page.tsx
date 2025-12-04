"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { FiSearch, FiFilter, FiUser, FiMapPin, FiCalendar, FiTrendingUp, FiEye, FiStar } from "react-icons/fi";

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
  // Premium attributes
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

type SortOption = "mostViewed" | "newest" | "oldest" | "highestPerformer";

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
const PROFILE_TYPE_OPTIONS = ["Scout", "Player", "Analyst", "Coach"];
const POSITION_OPTIONS = [
  "Goalkeeper", "Right Back", "Left Back", "Center Back", "Defensive Midfielder",
  "Central Midfielder", "Attacking Midfielder", "Right Winger", "Left Winger", "Striker", "Forward"
];

// Key attributes for premium filtering
const KEY_ATTRIBUTES = [
  "longPass", "shortPass", "dribbling", "shooting", "defending", "speed", "stamina",
  "passAccuracy", "tackling", "heading", "crossing", "finishing", "vision", "agility"
];

export default function ScoutingProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("highestPerformer");
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedProfileType, setSelectedProfileType] = useState<string>("");
  const [selectedAgeMin, setSelectedAgeMin] = useState<string>("");
  const [selectedAgeMax, setSelectedAgeMax] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [attributeMinValue, setAttributeMinValue] = useState<string>("");

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const client = await getClient();
      const res = await client.get("player");
      // API returns: { status: "success", message: "...", data: [...] }
      setProfiles(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch player profiles", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Get unique filter options from profiles
  const filterOptions = useMemo(() => {
    const levels = Array.from(new Set(profiles.map(p => p.level).filter(Boolean))) as string[];
    return { levels };
  }, [profiles]);

  // Calculate performance score for ranking
  const calculatePerformanceScore = (profile: PlayerProfile): number => {
    if (profile.scoutScore !== undefined) {
      return profile.scoutScore;
    }
    
    // If no scout score, calculate from attributes
    if (profile.attributes) {
      const attributeValues = Object.values(profile.attributes).filter((v): v is number => typeof v === 'number');
      if (attributeValues.length > 0) {
        return attributeValues.reduce((sum, val) => sum + val, 0) / attributeValues.length;
      }
    }
    
    // Fallback to match count or views
    return (profile.totalMatches || 0) * 10 + (profile.views || 0);
  };

  // Filter and sort profiles
  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = profiles.filter((profile) => {
      // Search filter (bio, name, etc.)
      const matchesSearch = !searchQuery || 
        profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.country?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Basic filters (available to all)
      const matchesCountry = !selectedCountry || profile.country === selectedCountry;
      const matchesLevel = !selectedLevel || profile.level === selectedLevel;
      const matchesGender = !selectedGender || profile.gender === selectedGender;
      const matchesProfileType = !selectedProfileType || profile.profileType === selectedProfileType;
      
      // Age filter
      const age = profile.age;
      const matchesAge = !age || (
        (!selectedAgeMin || age >= parseInt(selectedAgeMin)) &&
        (!selectedAgeMax || age <= parseInt(selectedAgeMax))
      );

      // Position filter
      const matchesPosition = !selectedPosition || profile.position === selectedPosition;
      
      // Attribute filter
      let matchesAttribute = true;
      if (selectedAttribute && profile.attributes) {
        const attributeValue = profile.attributes[selectedAttribute];
        if (attributeValue !== undefined) {
          const minValue = attributeMinValue ? parseInt(attributeMinValue) : 0;
          matchesAttribute = attributeValue >= minValue;
        } else {
          matchesAttribute = false;
        }
      }

      return matchesSearch && matchesCountry && matchesLevel && matchesGender && 
             matchesProfileType && matchesAge && matchesPosition && matchesAttribute;
    });

    // Sort profiles - default to highest performer
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "highestPerformer":
          // Rank from highest to lowest performer
          return calculatePerformanceScore(b) - calculatePerformanceScore(a);
        case "mostViewed":
          return (b.views || 0) - (a.views || 0);
        case "newest":
          return new Date(b.createdAt || b.lastActive || 0).getTime() - 
                 new Date(a.createdAt || a.lastActive || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || a.lastActive || 0).getTime() - 
                 new Date(b.createdAt || b.lastActive || 0).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [profiles, searchQuery, selectedCountry, selectedLevel, selectedGender, selectedProfileType, 
      selectedAgeMin, selectedAgeMax, selectedPosition, selectedAttribute, attributeMinValue, 
      sortBy]);

  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedLevel("");
    setSelectedGender("");
    setSelectedProfileType("");
    setSelectedAgeMin("");
    setSelectedAgeMax("");
    setSelectedPosition("");
    setSelectedAttribute("");
    setAttributeMinValue("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCountry || selectedLevel || selectedGender || selectedProfileType || 
                           selectedAgeMin || selectedAgeMax || selectedPosition || selectedAttribute || searchQuery;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Scouting Profiles</h1>
          <p className="text-sm text-gray-600 mt-1">Discover talented players from around the world</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, bio, position, or country..."
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
                  {[selectedCountry, selectedLevel, selectedGender, selectedProfileType, selectedAgeMin, selectedAgeMax, selectedPosition, selectedAttribute].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border-2 border-transparent"
              >
                <div className="flex flex-col">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline">
                  {sortBy === "highestPerformer" ? "Highest Performer" : 
                   sortBy === "mostViewed" ? "Most Viewed" : 
                   sortBy === "newest" ? "Newest" : "Oldest"}
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
                      onClick={() => { setSortBy("highestPerformer"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "highestPerformer" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                      }`}
                    >
                      <FiTrendingUp className="w-4 h-4" />
                      Highest Performer
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
                    <button
                      onClick={() => { setSortBy("newest"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "newest" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Newest
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
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Basic Filters (Available to All) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {filterOptions.levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Genders</option>
                    {GENDER_OPTIONS.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                {/* Profile Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Type</label>
                  <select
                    value={selectedProfileType}
                    onChange={(e) => setSelectedProfileType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {PROFILE_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Age Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={selectedAgeMin}
                      onChange={(e) => setSelectedAgeMin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={selectedAgeMax}
                      onChange={(e) => setSelectedAgeMax(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Position and Attribute Filters */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Position Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Positions</option>
                      {POSITION_OPTIONS.map((position) => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>

                  {/* Attribute Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Attribute</label>
                    <select
                      value={selectedAttribute}
                      onChange={(e) => setSelectedAttribute(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Attribute</option>
                      {KEY_ATTRIBUTES.map((attr) => (
                        <option key={attr} value={attr}>
                          {attr.charAt(0).toUpperCase() + attr.slice(1).replace(/([A-Z])/g, ' $1')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Attribute Min Value */}
                  {selectedAttribute && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min {selectedAttribute.charAt(0).toUpperCase() + selectedAttribute.slice(1).replace(/([A-Z])/g, ' $1')} Value
                      </label>
                      <input
                        type="number"
                        placeholder="0-100"
                        value={attributeMinValue}
                        onChange={(e) => setAttributeMinValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}
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
        ) : filteredAndSortedProfiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg mb-2">
              {hasActiveFilters ? "No profiles found with these filters." : "No player profiles available yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters to see all profiles
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              {hasActiveFilters ? (
                <>Showing {filteredAndSortedProfiles.length} of {profiles.length} profiles</>
              ) : (
                <>Showing all {filteredAndSortedProfiles.length} profiles (ranked by performance)</>
              )}
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200 relative"
                  onClick={() => router.push(`/dashboard/scouting-profiles/${profile.id}`)}
                >
                  {/* Rank Badge for Top Performers */}
                  {index < 3 && sortBy === "highestPerformer" && (
                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      #{index + 1}
                    </div>
                  )}

                  {/* Profile Image/Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center relative">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <FiUser className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {profile.scoutScore !== undefined && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <FiTrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-bold text-purple-600">{profile.scoutScore}</span>
                      </div>
                    )}
                    {profile.profileType && (
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
                        {profile.profileType}
                      </div>
                    )}
                  </div>

                  {/* Profile Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
                    
                    {/* Basic Info */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {profile.position && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Position:</span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            {profile.position}
                          </span>
                        </div>
                      )}
                      {profile.age && (
                        <div>
                          <span className="font-medium">Age:</span> <span>{profile.age}</span>
                        </div>
                      )}
                      {profile.country && (
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>{profile.country}</span>
                        </div>
                      )}
                      {profile.level && (
                        <div>
                          <span className="font-medium">Level:</span> <span>{profile.level}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      {profile.totalMatches !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{profile.totalMatches}</div>
                          <div className="text-xs text-gray-500">Matches</div>
                        </div>
                      )}
                      {profile.views !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{profile.views}</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                      )}
                      {profile.scoutScore !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{profile.scoutScore}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/scouting-profiles/${profile.id}`);
                      }}
                      className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
