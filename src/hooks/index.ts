"use client"
import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/api/client";
import { catchAsyncError } from "@/lib/AsyncError";

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


export const useFetchComparisonPlayers = (ids: string[]) => {

  const query = useQuery({
    queryKey: ["player-comparison", ids],
    queryFn: async () => {
      const client = await getClient();
      // Promise.all ensures the network requests happen simultaneously
      const res = await Promise.all(
        ids.map((id) => client.get(`/match/${id}`))
      );
      return res
    },
  });

  // Centralized error notification for comparison failures
  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
    }
  }, [query.error]);

  return query;
};

export const useFetchMatchResult = (id: string) => {
  const query = useQuery({
    queryKey: ["player-comparison", id],
    queryFn: async () => {
      const client = await getClient();
      const response = await client.get(`/match/${id}`);
      return response
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
