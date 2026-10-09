import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type { RequestCategory } from "@/types/request.types";
import type {
  SlaConfigPayload,
  SlaOverdueQueryParams,
  SlaOverdueRequest,
  SlaProcessResult,
} from "@/types/sla.types";

/**
 * Fetch list of overdue service requests breaching SLA
 */
export const getOverdueRequests = async (
  params?: SlaOverdueQueryParams,
): Promise<ApiResponse<SlaOverdueRequest[]>> => {
  return apiClient("/sla/overdue", {
    method: "GET",
    query: params,
  });
};

/**
 * Escalate an incident breaching SLA to supervisor
 */
export const escalateSlaRequest = async (
  requestId: string,
): Promise<ApiResponse<SlaOverdueRequest>> => {
  return apiClient(`/sla/requests/${requestId}/escalate`, {
    method: "POST",
  });
};

/**
 * Trigger backend batch job to process and record SLA breaches
 */
export const processSlaBreaches = async (
  limit = 100,
): Promise<ApiResponse<SlaProcessResult>> => {
  return apiClient("/sla/process", {
    method: "POST",
    body: { limit },
  });
};

/**
 * Configure target SLA duration (in minutes) for a specific category
 */
export const configureCategorySla = async (
  categoryId: string,
  payload: SlaConfigPayload,
): Promise<ApiResponse<RequestCategory>> => {
  return apiClient(`/sla/categories/${categoryId}`, {
    method: "PATCH",
    body: payload,
  });
};

/**
 * Fetch active request categories and their SLA duration configurations
 */
export const getCategorySlaConfigs = async (): Promise<
  ApiResponse<RequestCategory[]>
> => {
  return apiClient("/departments/categories", {
    method: "GET",
  });
};
