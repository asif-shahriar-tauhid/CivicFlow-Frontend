import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  RequestFilterParams,
  RequestInvestigationNote,
  RequestStatus,
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

export const getMyQueue = async (
  params?: RequestFilterParams,
): Promise<ApiResponse<ServiceRequest[]>> => {
  return apiClient("/requests/queue/me", {
    method: "GET",
    query: params as Record<string, any>,
  });
};

export const getDepartmentQueue = async (
  params?: RequestFilterParams,
): Promise<ApiResponse<ServiceRequest[]>> => {
  return apiClient("/requests/queue/department", {
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

export const routeServiceRequest = async (
  requestId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/route`, {
    method: "POST",
  });
};

export interface TransitionRequestInput {
  status: RequestStatus;
  reason?: string;
}

export const transitionServiceRequest = async (
  requestId: string,
  payload: TransitionRequestInput,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/transition`, {
    method: "POST",
    body: payload,
  });
};

export const resolveServiceRequest = async (
  requestId: string,
  reason: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/resolve`, {
    method: "POST",
    body: { reason },
  });
};

export const addInvestigationNote = async (
  requestId: string,
  note: string,
): Promise<ApiResponse<RequestInvestigationNote>> => {
  return apiClient(`/requests/${requestId}/notes`, {
    method: "POST",
    body: { note },
  });
};

export const assignServiceRequest = async (
  requestId: string,
  assignedToId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/assign`, {
    method: "POST",
    body: { assignedToId },
  });
};

export const reassignServiceRequest = async (
  requestId: string,
  assignedToId: string,
): Promise<ApiResponse<ServiceRequest>> => {
  return apiClient(`/requests/${requestId}/reassign`, {
    method: "POST",
    body: { assignedToId },
  });
};

export { initiateRequestPayment } from "./payment.api";
