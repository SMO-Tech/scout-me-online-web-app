"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { 
    FiPlus, FiSearch, FiFilter, FiArrowDown, FiArrowUp, 
    FiEye, FiCalendar, FiFlag, FiLayers
} from "react-icons/fi";

// ============================================================================
// 1. INTERFACES & UTILITIES
// ============================================================================

interface MatchResultData {
    homeScore: number;
    awayScore: number;
}

interface MatchClubData {
    name: string;
    isUsersTeam: boolean;
    jerseyColor: string | null;
    club: {
        logoUrl: string | null;
    } | null;
    country: string;
}

interface UploaderData {
    name: string;
}

// Base Match Interface (from Prisma query)
interface BaseMatch {
    id: string; // UUID from Prisma
    userId: string;
    videoUrl: string;
    lineUpImage: string | null;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    level: string;
    matchDate: string | null;
    competitionName: string | null;
    venue: string | null;
    createdAt: string;
    updatedAt: string;
    
    // Relations
    result: MatchResultData | null;
    matchClubs: MatchClubData[];
    user: UploaderData;
    
    views?: number; // Optional in state
}

// Final Match Interface (with derived fields for UI)
interface Match extends BaseMatch {
    teamName: string;
    opponentName: string;
    score: string;
    country: string | undefined; 
    gender?: string;
    age?: string;
}

type SortOption = "recent" | "oldest" | "mostViewed";

const MATCH_LEVEL_OPTIONS = [
    "PROFESSIONAL",
    "SEMI_PROFESSIONAL",
    "ACADEMIC_TOP_TIER",
    "ACADEMIC_AMATEUR",
    "SUNDAY_LEAGUE"
];

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

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
    });
};

const getTeamsAndScore = (match: BaseMatch) => {
    const homeClub = match.matchClubs.find(c => c.isUsersTeam);
    const awayClub = match.matchClubs.find(c => !c.isUsersTeam);

    const homeScore = match.result?.homeScore ?? '-';
    const awayScore = match.result?.awayScore ?? '-';
    
    return {
        teamName: homeClub?.name || 'Home Team',
        opponentName: awayClub?.name || 'Opponent',
        score: `${homeScore} - ${awayScore}`,
        country: homeClub?.country, 
    };
};

// ============================================================================
// 2. MATCH CARD COMPONENT (Redesigned)
// ============================================================================

interface MatchCardProps {
    match: {
        id: string;
        teamName: string;
        opponentName: string;
        score: string;
        level: string;
        matchDate: string | null;
        country: string | undefined;
        user: { name: string };
        views?: number; 
    };
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const router = useRouter();

    const handleViewAnalysis = () => {
        router.push(`/dashboard/matches/${match.id}`);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
                       overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200"
            onClick={handleViewAnalysis}
        >
            {/* 1. HEADER: METADATA & ACTION */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50/50">
                <div className="flex items-center text-xs font-medium text-gray-600">
                    <FiLayers className="w-3 h-3 mr-1" />
                    {match.level.replace('_', ' ')}
                </div>
                {/* Views */}
                {match.views !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiEye className="w-3 h-3" />
                        <span>{match.views || 0} views</span>
                    </div>
                )}
            </div>

            {/* 2. MATCHUP & SCORELINE */}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex-1 text-center pr-2">
                        <h3 className="text-xl font-extrabold text-gray-900 truncate">
                            {match.teamName}
                        </h3>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0">
                        <p className="text-4xl font-black text-purple-700 bg-purple-100 px-4 py-2 rounded-lg shadow-inner border border-purple-200">
                            {match.score}
                        </p>
                    </div>

                    {/* Opponent Team */}
                    <div className="flex-1 text-center pl-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                            {match.opponentName}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 3. FOOTER: DETAILS & BUTTON */}
            <div className="p-4 pt-0">
                
                {/* Match Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 border-t border-gray-100 pt-4 mb-4">
                    
                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">{formatDate(match.matchDate)}</span>
                    </div>
                    
                    {/* Location/Country */}
                    {match.country && (
                        <div className="flex items-center gap-2">
                            <FiFlag className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">{match.country}</span>
                        </div>
                    )}
                    
                    {/* Uploader Name */}
                    <div className="col-span-2 text-center pt-2">
                        <span className="font-medium text-gray-500">Uploaded by: </span>
                        <span className="font-semibold text-gray-700">{match.user.name}</span>
                    </div>
                </div>

                {/* Action Button - Always "View Analysis" */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents card click trigger
                        handleViewAnalysis();
                    }}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
                >
                    View Analysis
                </button>
            </div>
        </div>
    );
};


// ============================================================================
// 3. MAIN PAGE COMPONENT (FILTERS RESTORED)
// ============================================================================

export default function Matches() {
  const router = useRouter();
  const [matches, setMatches] = useState<BaseMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const client = await getClient();
      const res = await client.get("/match/all-match"); 
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

  const filterOptions = useMemo(() => {
    const levels = MATCH_LEVEL_OPTIONS;
    const ages: string[] = ["U16", "U18", "Senior"]; 
    return { levels, ages };
  }, []);

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    // 1. Map matches to derive required display/search fields
    let matchesWithDerivedData: Match[] = matches.map(match => {
        const derived = getTeamsAndScore(match);
        return { 
            ...match, 
            ...derived 
        } as Match;
    });

    // 2. Filter matches
    let filtered = matchesWithDerivedData.filter((match) => {
      const matchesSearch = !searchQuery || 
        match.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.opponentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.country?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCountry = !selectedCountry || match.country === selectedCountry;
      const matchesLevel = !selectedLevel || match.level === selectedLevel;
      const matchesGender = !selectedGender || match.gender === selectedGender;
      const matchesAge = !selectedAge || match.age === selectedAge;

      return matchesSearch && matchesCountry && matchesLevel && matchesGender && matchesAge;
    });

    // 3. Sort matches
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "mostViewed":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [matches, searchQuery, selectedCountry, selectedLevel, selectedGender, selectedAge, sortBy]);

  const handleCreateMatch = () => {
    router.push("/dashboard/form");
  };

  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedLevel("");
    setSelectedGender("");
    setSelectedAge("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCountry || selectedLevel || selectedGender || selectedAge || searchQuery;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyzed Matches</h1>
            <p className="text-sm text-gray-600 mt-1">Browse all completed match analyses on the platform</p>
          </div>
          <button
            onClick={handleCreateMatch}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" />
            <span>Upload New Match</span>
          </button>
        </div>

        {/* Search and Filter Bar - RESTORED */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search matches by team, opponent, or country..."
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
                  {[selectedCountry, selectedLevel, selectedGender, selectedAge].filter(Boolean).length}
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
                  <FiArrowUp className="w-3 h-3" />
                  <FiArrowDown className="w-3 h-3 -mt-1" />
                </div>
                <span className="hidden sm:inline">
                  {sortBy === "recent" ? "Recent" : sortBy === "oldest" ? "Oldest" : "Most Viewed"}
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
                      onClick={() => { setSortBy("recent"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "recent" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Recent Matches
                    </button>
                    <button
                      onClick={() => { setSortBy("oldest"); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        sortBy === "oldest" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Oldest Matches
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
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <option key={level} value={level}>{level.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter (Placeholder) */}
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

              {/* Age Filter (Placeholder) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Ages</option>
                  {filterOptions.ages.map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

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

        {/* Loading/Empty State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAndSortedMatches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg mb-2">
              {hasActiveFilters ? "No matches found with these filters." : "No completed match analyses available yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters to see all matches
              </button>
            )}
            {!hasActiveFilters && (
              <button
                onClick={handleCreateMatch}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Upload Your First Match
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              {hasActiveFilters ? (
                <>Showing {filteredAndSortedMatches.length} of {matches.length} completed matches</>
              ) : (
                <>Showing all {filteredAndSortedMatches.length} completed matches from the platform</>
              )}
            </div>

            {/* Match Tiles Grid (Using the enhanced MatchCard) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedMatches.map((match) => (
                <MatchCard 
                    key={match.id}
                    match={match}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}