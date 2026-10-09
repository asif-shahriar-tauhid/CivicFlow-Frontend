import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitRequestFeedback } from "@/api/feedback.api";
import {
  addInvestigationNote,
  assignServiceRequest,
  confirmServiceRequest,
  createServiceRequest,
  deleteRequestAttachment,
  deleteServiceRequest,
  getDepartmentQueue,
  getMyQueue,
  getServiceRequestById,
  getServiceRequests,
  reassignServiceRequest,
  reopenServiceRequest,
  resolveServiceRequest,
  routeServiceRequest,
  type TransitionRequestInput,
  transitionServiceRequest,
  updateServiceRequest,
  uploadRequestAttachment,
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

export const useGetMyQueue = (params?: RequestFilterParams) => {
  return useQuery({
    queryKey: ["service-requests", "my-queue", params],
    queryFn: () => getMyQueue(params),
    staleTime: 30 * 1000,
  });
};

export const useGetDepartmentQueue = (params?: RequestFilterParams) => {
  return useQuery({
    queryKey: ["service-requests", "department-queue", params],
    queryFn: () => getDepartmentQueue(params),
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

export const useTransitionServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: TransitionRequestInput;
    }) => transitionServiceRequest(requestId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["public-stats"] });
    },
  });
};

export const useResolveServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason: string;
    }) => resolveServiceRequest(requestId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["public-stats"] });
    },
  });
};

export const useAddInvestigationNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, note }: { requestId: string; note: string }) =>
      addInvestigationNote(requestId, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
    },
  });
};

export const useAssignServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      assignedToId,
    }: {
      requestId: string;
      assignedToId: string;
    }) => assignServiceRequest(requestId, assignedToId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });
};

export const useReassignServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      assignedToId,
    }: {
      requestId: string;
      assignedToId: string;
    }) => reassignServiceRequest(requestId, assignedToId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });
};

export const useUploadRequestAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      formData,
    }: {
      requestId: string;
      formData: FormData;
    }) => uploadRequestAttachment(requestId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useDeleteRequestAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      attachmentId,
    }: {
      requestId: string;
      attachmentId: string;
    }) => deleteRequestAttachment(requestId, attachmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export { useInitiatePayment } from "./payment.hooks";
