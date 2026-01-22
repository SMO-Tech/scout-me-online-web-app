"use client"
import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/api/client";
import { catchAsyncError } from "@/lib/AsyncError";
import { LegacyMatchResponse } from "@/@types/legacyMatch";

const fetchPlayerById = async (id: string): Promise<any> => {
  const client = await getClient();
  const { data } = await client.get(`/player/${id}`);
  return data?.data || data;
};


export const useFetchPlayerProfile = (id: string) => {


  const query = useQuery({
    queryKey: ["player-profile", id],
    queryFn: () => fetchPlayerById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 mins
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
     
    }
  }, [query.error]);

  return query;
};



export const useFetchMatchResult = (id: string) => {
  const query = useQuery({
    queryKey: ["match-result", id],
    queryFn: async () => {
      try{

        const client = await getClient();
        const response = await client.get(`/match/${id}`);
        console.log(response)
        return response
      }catch(e){
        console.log(e)
      }
    },
    enabled: !!id, // only fetch if id exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Centralized error notification
  useEffect(() => {
    if (query.error) {
      catchAsyncError(query.error);
    }
  }, [query.error]);

  return query;
};

export const useFetchLegacyMatchResult = (matchId: string) => {
  const query = useQuery<LegacyMatchResponse>({
    queryKey: ["legacy-match-analysis", matchId],
    queryFn: async () => {
      if (!matchId) return null;
      const client = await getClient();
      const response = await client.get(`/match/legacy-match-analysis/${matchId}`);
      return response.data; // or response.data.data if your API nests it
    },
    enabled: !!matchId, // only fetch if matchId exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Centralized error handling
  useEffect(() => {
    if (query.error) {
      catchAsyncError(query.error);
    }
  }, [query.error]);

  return query;
};

