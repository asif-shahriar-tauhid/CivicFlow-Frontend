import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  Payment,
  PaymentFilterParams,
  PaymentInitiateResponse,
  PaymentStatusView,
} from "@/types/payment.types";

/**
 * Fetch payments for the authenticated citizen (Service requests + Appointments)
 */
export const getMyPayments = async (
  params?: PaymentFilterParams,
): Promise<ApiResponse<Payment[]>> => {
  return apiClient("/payment/my-payments", {
    method: "GET",
    query: params as Record<string, unknown>,
  });
};

/**
 * Fetch all municipal payments for admin review with search & pagination
 */
export const getAllPayments = async (
  params?: PaymentFilterParams,
): Promise<ApiResponse<Payment[]>> => {
  return apiClient("/payment/all-payments", {
    method: "GET",
    query: params as Record<string, unknown>,
  });
};

/**
 * Fetch detailed telemetry for a single payment record
 */
export const getPaymentById = async (
  paymentId: string,
): Promise<ApiResponse<Payment>> => {
  return apiClient(`/payment/${paymentId}`, {
    method: "GET",
  });
};

/**
 * Fetch PDF Invoice link or generate/retrieve cloud invoice receipt
 */
export const getPaymentInvoice = async (
  paymentId: string,
): Promise<ApiResponse<{ invoiceUrl?: string; [key: string]: unknown }>> => {
  return apiClient(`/payment/${paymentId}/invoice`, {
    method: "GET",
  });
};

/**
 * Initiate bKash payment gateway checkout for a specific service request
 */
export const initiateRequestPayment = async (
  requestId: string,
): Promise<ApiResponse<PaymentInitiateResponse>> => {
  return apiClient(`/request-payments/requests/${requestId}/initiate`, {
    method: "POST",
  });
};

/**
 * Poll or inspect the live payment reconciliation status of a service request
 */
export const getRequestPaymentStatus = async (
  requestId: string,
): Promise<ApiResponse<PaymentStatusView>> => {
  return apiClient(`/request-payments/requests/${requestId}/status`, {
    method: "GET",
  });
};
