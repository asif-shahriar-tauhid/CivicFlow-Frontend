import apiClient from "@/lib/apiClient";
import type { ApiResponse, PublicStats } from "@/types/dashboard.types";

export const getPublicStats = async (): Promise<ApiResponse<PublicStats>> => {
  return apiClient("/dashboard/public/stats", {
    method: "GET",
  });
};
