import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/api/department.api";

/**
 * Hook to retrieve municipal departments
 */
export const useGetDepartments = (params?: { includeArchived?: boolean }) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
    staleTime: 5 * 60 * 1000,
  });
};
