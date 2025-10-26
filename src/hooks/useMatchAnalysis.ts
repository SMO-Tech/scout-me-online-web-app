import { useState, useEffect } from 'react';
import { MatchAnalysisData } from '@/types/matchAnalysis';
import { mockMatchData } from '@/lib/mockMatchData';

interface UseMatchAnalysisReturn {
  data: MatchAnalysisData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching match analysis data
 * 
 * @param jobUuid - The UUID of the match analysis job
 * @param useMockData - If true, uses mock data instead of API (default: true for development)
 * @returns Object containing data, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useMatchAnalysis('job-uuid-123', false);
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!data) return <NoData />;
 * 
 * return <MatchSummaryWidget data={data} />;
 * ```
 */
export const useMatchAnalysis = (
  jobUuid?: string,
  useMockData: boolean = true
): UseMatchAnalysisReturn => {
  const [data, setData] = useState<MatchAnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    // Use mock data for development
    if (useMockData) {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setData(mockMatchData);
        setLoading(false);
      }, 500);
      return;
    }

    // Production API call
    if (!jobUuid) {
      setError(new Error('Job UUID is required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch match data from your API
      const response = await fetch(`/api/jobs/${jobUuid}/data/`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Transform API response to match MatchAnalysisData interface if needed
      // const transformedData = transformApiResponse(result);
      
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      console.error('Error fetching match analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobUuid, useMockData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

/**
 * Transform API response to MatchAnalysisData format
 * Customize this function based on your actual API response structure
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformApiResponse = (apiResponse: Record<string, unknown>): MatchAnalysisData => {
  // Example transformation - adjust based on your API structure
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, key) => {
      return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined;
    }, obj);
  };

  return {
    jobUuid: (apiResponse.job_uuid || apiResponse.jobUuid || '') as string,
    matchMetadata: {
      homeTeam: (apiResponse.home_team || getNestedValue(apiResponse, 'matchMetadata.homeTeam') || '') as string,
      awayTeam: (apiResponse.away_team || getNestedValue(apiResponse, 'matchMetadata.awayTeam') || '') as string,
      date: (apiResponse.match_date || getNestedValue(apiResponse, 'matchMetadata.date') || '') as string,
      score: (apiResponse.score || getNestedValue(apiResponse, 'matchMetadata.score') || '') as string,
    },
    analysisResult: {
      totalPasses: Number(apiResponse.total_passes || getNestedValue(apiResponse, 'analysisResult.totalPasses') || 0),
      successfulPasses: Number(apiResponse.successful_passes || getNestedValue(apiResponse, 'analysisResult.successfulPasses') || 0),
      passAccuracy: Number(apiResponse.pass_accuracy || getNestedValue(apiResponse, 'analysisResult.passAccuracy') || 0),
      homeTeamPasses: Number(apiResponse.home_team_passes || getNestedValue(apiResponse, 'analysisResult.homeTeamPasses') || 0),
      awayTeamPasses: Number(apiResponse.away_team_passes || getNestedValue(apiResponse, 'analysisResult.awayTeamPasses') || 0),
    },
    // Add more transformations as needed
    homeTeamStats: (apiResponse.homeTeamStats || mockMatchData.homeTeamStats) as typeof mockMatchData.homeTeamStats,
    awayTeamStats: (apiResponse.awayTeamStats || mockMatchData.awayTeamStats) as typeof mockMatchData.awayTeamStats,
    playerStats: (apiResponse.playerStats || mockMatchData.playerStats) as typeof mockMatchData.playerStats,
    passEvents: (apiResponse.passEvents || mockMatchData.passEvents) as typeof mockMatchData.passEvents,
    ballTracking: (apiResponse.ballTracking || mockMatchData.ballTracking) as typeof mockMatchData.ballTracking,
    timeSeriesData: (apiResponse.timeSeriesData || mockMatchData.timeSeriesData) as typeof mockMatchData.timeSeriesData,
  };
};

