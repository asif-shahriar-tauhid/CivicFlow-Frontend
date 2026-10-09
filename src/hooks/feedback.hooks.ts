import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFeedbackReports,
  getRequestFeedback,
  submitRequestFeedback,
} from "@/api/feedback.api";
import { gooeyToast } from "@/components/ui/goey-toaster";
import type {
  CreateFeedbackPayload,
  FeedbackReportQueryParams,
} from "@/types/feedback.types";

/**
 * Hook to retrieve citizen satisfaction feedback reports
 */
export const useGetFeedbackReports = (params?: FeedbackReportQueryParams) => {
  return useQuery({
    queryKey: ["feedback-reports", params],
    queryFn: () => getFeedbackReports(params),
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to retrieve feedback for a specific request
 */
export const useGetRequestFeedback = (requestId: string) => {
  return useQuery({
    queryKey: ["request-feedback", requestId],
    queryFn: () => getRequestFeedback(requestId),
    enabled: Boolean(requestId),
  });
};

/**
 * Hook to submit feedback on a resolved service request
 */
export const useSubmitRequestFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: CreateFeedbackPayload;
    }) => submitRequestFeedback(requestId, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request-feedback", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["feedback-reports"] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["service-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Feedback Submitted", {
        description: "Thank you for rating your municipal service experience!",
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Submit Feedback", {
        description:
          error?.data?.message ||
          error?.message ||
          "Could not submit feedback. Please try again.",
      });
    },
  });
};
