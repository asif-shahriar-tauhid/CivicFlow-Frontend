import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  RequestFilterParams,
  ServiceRequest,
} from "@/types/request.types";

export const createServiceRequest = async (
  formData: FormData,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient("/requests", {
    method: "POST",
    body: formData,
  });
};

export const getServiceRequests = async (
  params?: RequestFilterParams,
): Promise<ApiResponse<ServiceRequest[]>> => {
  return apiClient("/requests", {
    method: "GET",
    query: params as Record<string, any>,
  });
};

export const getServiceRequestById = async (
  requestId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}`, {
    method: "GET",
  });
};

export const updateServiceRequest = async (
  requestId: string,
  payload: Record<string, any>,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}`, {
    method: "PATCH",
    body: payload,
  });
};

export const deleteServiceRequest = async (
  requestId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}`, {
    method: "DELETE",
  });
};

export const confirmServiceRequest = async (
  requestId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/confirm`, {
    method: "POST",
  });
};

export const reopenServiceRequest = async (
  requestId: string,
  reason: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/reopen`, {
    method: "POST",
    body: { reason },
  });
};

export const submitRequestFeedback = async (
  requestId: string,
  payload: { rating: number; comment?: string },
): Promise<ApiResponse<any>> => {
  return apiClient(`/requests/${requestId}/feedback`, {
    method: "POST",
    body: payload,
  });
};

export const routeServiceRequest = async (
  requestId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/route`, {
    method: "POST",
  });
};

export { initiateRequestPayment } from "./payment.api";

