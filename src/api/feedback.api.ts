import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  CreateFeedbackPayload,
  FeedbackReportQueryParams,
  RequestFeedbackItem,
} from "@/types/feedback.types";

/**
 * Fetch citizen satisfaction feedback reports
 */
export const getFeedbackReports = async (
  params?: FeedbackReportQueryParams,
): Promise<ApiResponse<RequestFeedbackItem[]>> => {
  return apiClient("/request-feedback/report", {
    method: "GET",
    query: params,
  });
};

/**
 * Submit citizen rating and comment for a resolved service request
 */
export const submitRequestFeedback = async (
  requestId: string,
  payload: CreateFeedbackPayload,
): Promise<ApiResponse<RequestFeedbackItem>> => {
  return apiClient(`/requests/${requestId}/feedback`, {
    method: "POST",
    body: payload,
  });
};

/**
 * Fetch feedback for a specific request
 */
export const getRequestFeedback = async (
  requestId: string,
): Promise<ApiResponse<RequestFeedbackItem>> => {
  return apiClient(`/requests/${requestId}/feedback`, {
    method: "GET",
  });
};
