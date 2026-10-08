import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmServiceRequest,
  createServiceRequest,
  deleteServiceRequest,
  getServiceRequestById,
  getServiceRequests,
  reopenServiceRequest,
  routeServiceRequest,
  submitRequestFeedback,
  updateServiceRequest,
} from "@/api/request.api";
import type { RequestFilterParams } from "@/types/request.types";

export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useGetServiceRequests = (params?: RequestFilterParams) => {
  return useQuery({
    queryKey: ["service-requests", params],
    queryFn: () => getServiceRequests(params),
    staleTime: 30 * 1000,
  });
};

export const useGetServiceRequestById = (requestId: string) => {
  return useQuery({
    queryKey: ["service-request", requestId],
    queryFn: () => getServiceRequestById(requestId),
    enabled: Boolean(requestId),
    staleTime: 15 * 1000,
  });
};

export const useConfirmServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => confirmServiceRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useReopenServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason: string;
    }) => reopenServiceRequest(requestId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      rating,
      comment,
    }: {
      requestId: string;
      rating: number;
      comment?: string;
    }) => submitRequestFeedback(requestId, { rating, comment }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useUpdateServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: Record<string, any>;
    }) => updateServiceRequest(requestId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useDeleteServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => deleteServiceRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.removeQueries({ queryKey: ["service-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useRouteServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => routeServiceRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["public-stats"] });
    },
  });
};

export { useInitiatePayment } from "./payment.hooks";

