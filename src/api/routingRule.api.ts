import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  CategoryRoutingRule,
  CreateRoutingRulePayload,
  RoutingRuleQueryParams,
  UpdateRoutingRulePayload,
} from "@/types/routingRule.types";

/**
 * Fetch all category routing rules
 */
export const getRoutingRules = async (
  params?: RoutingRuleQueryParams,
): Promise<ApiResponse<CategoryRoutingRule[]>> => {
  return apiClient("/routing-rules", {
    method: "GET",
    query: params,
  });
};

/**
 * Create a new automated routing rule
 */
export const createRoutingRule = async (
  payload: CreateRoutingRulePayload,
): Promise<ApiResponse<CategoryRoutingRule>> => {
  return apiClient("/routing-rules", {
    method: "POST",
    body: payload,
  });
};

/**
 * Update an existing routing rule (priority, location, department, etc.)
 */
export const updateRoutingRule = async (
  ruleId: string,
  payload: UpdateRoutingRulePayload,
): Promise<ApiResponse<CategoryRoutingRule>> => {
  return apiClient(`/routing-rules/${ruleId}`, {
    method: "PATCH",
    body: payload,
  });
};

/**
 * Archive / Deactivate a routing rule
 */
export const archiveRoutingRule = async (
  ruleId: string,
): Promise<ApiResponse<CategoryRoutingRule>> => {
  return apiClient(`/routing-rules/${ruleId}/archive`, {
    method: "PATCH",
  });
};

/**
 * Restore / Reactivate an archived routing rule
 */
export const unarchiveRoutingRule = async (
  ruleId: string,
): Promise<ApiResponse<CategoryRoutingRule>> => {
  return apiClient(`/routing-rules/${ruleId}/unarchive`, {
    method: "PATCH",
  });
};

/**
 * Fetch active request categories for routing rule configuration
 */
export const getCategories = async (): Promise<
  ApiResponse<Array<{ id: string; name: string }>>
> => {
  return apiClient("/departments/categories", {
    method: "GET",
  });
};
