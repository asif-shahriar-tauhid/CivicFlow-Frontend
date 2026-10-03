import { getPublicStats } from "@/api/dashboard.api";
import { useQuery } from "@tanstack/react-query";

export const useGetPublicStats = () => {
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: getPublicStats,
    staleTime: 60 * 1000, // 1 minute
  });
};
