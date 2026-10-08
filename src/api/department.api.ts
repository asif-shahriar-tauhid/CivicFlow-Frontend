import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type { Department } from "@/types/request.types";

/**
 * Fetch list of municipal departments
 */
export const getDepartments = async (params?: {
  includeArchived?: boolean;
}): Promise<ApiResponse<Department[]>> => {
  return apiClient("/departments", {
    method: "GET",
    query: params,
  });
};
