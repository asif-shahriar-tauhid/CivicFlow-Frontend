import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveRoutingRule,
  createRoutingRule,
  getCategories,
  getRoutingRules,
  unarchiveRoutingRule,
  updateRoutingRule,
} from "@/api/routingRule.api";
import { gooeyToast } from "@/components/ui/goey-toaster";
import type {
  CreateRoutingRulePayload,
  RoutingRuleQueryParams,
  UpdateRoutingRulePayload,
} from "@/types/routingRule.types";

/**
 * Hook to retrieve category routing rules
 */
export const useGetRoutingRules = (params?: RoutingRuleQueryParams) => {
  return useQuery({
    queryKey: ["routing-rules", params],
    queryFn: () => getRoutingRules(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to retrieve municipal request categories
 */
export const useGetCategories = () => {
  return useQuery({
    queryKey: ["request-categories"],
    queryFn: () => getCategories(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new category routing rule
 */
export const useCreateRoutingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoutingRulePayload) =>
      createRoutingRule(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Routing Rule Configured", {
        description: `Routed "${response.data.category.name}" to "${response.data.department.name}".`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Create Rule", {
        description:
          error?.data?.message ||
          error?.message ||
          "An error occurred while creating routing rule.",
      });
    },
  });
};

/**
 * Hook to update an existing routing rule
 */
export const useUpdateRoutingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ruleId,
      payload,
    }: {
      ruleId: string;
      payload: UpdateRoutingRulePayload;
    }) => updateRoutingRule(ruleId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Routing Rule Updated", {
        description: `Saved changes to "${response.data.category.name}" routing pipeline.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Update Rule", {
        description:
          error?.data?.message ||
          error?.message ||
          "An error occurred while updating routing rule.",
      });
    },
  });
};

/**
 * Hook to archive a routing rule
 */
export const useArchiveRoutingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: string) => archiveRoutingRule(ruleId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.warning("Routing Rule Archived", {
        description: `Rule for "${response.data.category?.name || "Category"}" deactivated.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Archive Rule", {
        description:
          error?.data?.message ||
          error?.message ||
          "An error occurred while archiving routing rule.",
      });
    },
  });
};

/**
 * Hook to restore an archived routing rule
 */
export const useUnarchiveRoutingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: string) => unarchiveRoutingRule(ruleId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Routing Rule Restored", {
        description: `Rule for "${response.data.category?.name || "Category"}" reactivated.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Restore Rule", {
        description:
          error?.data?.message ||
          error?.message ||
          "An error occurred while restoring routing rule.",
      });
    },
  });
};
