import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayments,
  getMyPayments,
  getPaymentById,
  getPaymentInvoice,
  getRequestPaymentStatus,
  initiateRequestPayment,
} from "@/api/payment.api";
import type { PaymentFilterParams } from "@/types/payment.types";

/**
 * Hook to retrieve authenticated citizen's payment history
 */
export const useMyPayments = (params?: PaymentFilterParams) => {
  return useQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
    staleTime: 30 * 1000,
  });
};

/**
 * Hook for administrators to review all municipal payment transactions
 */
export const useAllPayments = (params?: PaymentFilterParams) => {
  return useQuery({
    queryKey: ["all-payments", params],
    queryFn: () => getAllPayments(params),
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to inspect a specific payment record
 */
export const usePaymentById = (paymentId: string) => {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to retrieve or generate official PDF invoice for a payment
 */
export const usePaymentInvoice = (
  paymentId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["payment-invoice", paymentId],
    queryFn: () => getPaymentInvoice(paymentId),
    enabled: Boolean(paymentId) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to poll live payment status for a service request (e.g. after bKash callback)
 */
export const useRequestPaymentStatus = (
  requestId: string,
  options?: {
    enabled?: boolean;
    refetchInterval?:
      | number
      | false
      | ((query: unknown) => number | false | undefined);
  },
) => {
  return useQuery({
    queryKey: ["request-payment-status", requestId],
    queryFn: () => getRequestPaymentStatus(requestId),
    enabled: Boolean(requestId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval ?? false,
    staleTime: 5 * 1000,
  });
};

/**
 * Hook to initiate bKash payment checkout for a ticket
 */
export const useInitiatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => initiateRequestPayment(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-payment-status", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["all-payments"] });
    },
  });
};
