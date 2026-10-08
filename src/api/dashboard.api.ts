import apiClient from "@/lib/apiClient";
import type {
  AdminAnalyticsParams,
  AdminDashboardData,
  ApiResponse,
  PublicStats,
} from "@/types/dashboard.types";

export const getPublicStats = async (): Promise<ApiResponse<PublicStats>> => {
  return apiClient("/dashboard/public/stats", {
    method: "GET",
  });
};

export const getAdminAnalytics = async (
  params?: AdminAnalyticsParams,
): Promise<ApiResponse<AdminDashboardData>> => {
  return apiClient("/dashboard/admin", {
    method: "GET",
    query: params as Record<string, unknown>,
  });
};
