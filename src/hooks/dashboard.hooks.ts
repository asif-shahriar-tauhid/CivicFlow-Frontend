import { useQuery } from "@tanstack/react-query";
import { getPublicStats } from "@/api/dashboard.api";

export const useGetPublicStats = () => {
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: getPublicStats,
    staleTime: 60 * 1000, // 1 minute
  });
};
