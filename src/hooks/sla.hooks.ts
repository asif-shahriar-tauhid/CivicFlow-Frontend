import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  configureCategorySla,
  escalateSlaRequest,
  getOverdueRequests,
  processSlaBreaches,
} from "@/api/sla.api";
import { gooeyToast } from "@/components/ui/goey-toaster";
import type {
  SlaConfigPayload,
  SlaOverdueQueryParams,
} from "@/types/sla.types";

/**
 * Hook to retrieve service requests currently overdue or breaching SLA
 */
export const useGetOverdueRequests = (params?: SlaOverdueQueryParams) => {
  return useQuery({
    queryKey: ["sla-overdue", params],
    queryFn: () => getOverdueRequests(params),
    staleTime: 30 * 1000, // 30 seconds fresh cache for time-sensitive SLA
  });
};

/**
 * Hook to escalate an overdue service request to supervisory queue
 */
export const useEscalateSlaRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => escalateSlaRequest(requestId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["sla-overdue"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.warning("Incident Escalated", {
        description: `Request ${response.data.requestNumber || "ticket"} has been escalated to supervisory review.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Escalation Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          "Could not escalate incident. Please verify permissions.",
      });
    },
  });
};

/**
 * Hook to trigger backend batch processing for overdue SLA breaches
 */
export const useProcessSlaBreaches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (limit?: number) => processSlaBreaches(limit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sla-overdue"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("SLA Batch Scan Completed", {
        description:
          "Municipal queue scanned and SLA breach timestamps updated.",
      });
    },
    onError: (error: any) => {
      gooeyToast.error("SLA Batch Run Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          "An error occurred while running the SLA breach batch process.",
      });
    },
  });
};

/**
 * Hook to configure category SLA duration
 */
export const useConfigureCategorySla = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: SlaConfigPayload;
    }) => configureCategorySla(categoryId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["sla-overdue"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      gooeyToast.success("Category SLA Configured", {
        description: `Target SLA for "${response.data.name}" set to ${response.data.slaMinutes} minutes.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("SLA Configuration Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          "Failed to update category SLA target.",
      });
    },
  });
};
