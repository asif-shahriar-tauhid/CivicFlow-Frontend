import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics, getPublicStats } from "@/api/dashboard.api";
import type { AdminAnalyticsParams } from "@/types/dashboard.types";

export const useGetPublicStats = () => {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: getPublicStats,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useGetAdminAnalytics = (params?: AdminAnalyticsParams) => {
  return useQuery({
    queryKey: ["admin-analytics", params],
    queryFn: () => getAdminAnalytics(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
