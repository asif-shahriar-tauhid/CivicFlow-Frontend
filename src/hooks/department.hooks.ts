import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveDepartment,
  assignStaffDepartment,
  createDepartment,
  getDepartments,
  unarchiveDepartment,
  updateDepartment,
} from "@/api/department.api";
import { gooeyToast } from "@/components/ui/goey-toaster";
import type {
  CreateDepartmentPayload,
  DepartmentQueryParams,
  UpdateDepartmentPayload,
} from "@/types/department.types";

/**
 * Hook to retrieve municipal departments
 */
export const useGetDepartments = (params?: DepartmentQueryParams) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new municipal department
 */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Department Created", {
        description: `Successfully registered "${response.data.name}" in municipal registry.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Create Department", {
        description:
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred while creating department.",
      });
    },
  });
};

/**
 * Hook to update an existing department
 */
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      payload,
    }: {
      departmentId: string;
      payload: UpdateDepartmentPayload;
    }) => updateDepartment(departmentId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Department Updated", {
        description: `Saved changes to "${response.data.name}".`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Update Department", {
        description:
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred while updating department.",
      });
    },
  });
};

/**
 * Hook to archive a department
 */
export const useArchiveDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => archiveDepartment(departmentId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.warning("Department Archived", {
        description: `"${response.data.name}" archived. Linked category routing rules deactivated.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Archive Department", {
        description:
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred while archiving department.",
      });
    },
  });
};

/**
 * Hook to restore an archived department
 */
export const useUnarchiveDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => unarchiveDepartment(departmentId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      gooeyToast.success("Department Restored", {
        description: `"${response.data.name}" has been reactivated in active registry.`,
      });
    },
    onError: (error: any) => {
      gooeyToast.error("Failed to Restore Department", {
        description:
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred while restoring department.",
      });
    },
  });
};

/**
 * Hook to assign or reassign a staff user to a department (or null to unassign)
 */
export const useAssignStaffDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      departmentId,
    }: {
      userId: string;
      departmentId: string | null;
    }) => assignStaffDepartment(userId, departmentId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: ["user-detail", variables.userId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });

      const deptName = response.data?.department?.name;
      if (variables.departmentId && deptName) {
        gooeyToast.success("Staff Roster Updated", {
          description: `Assigned ${response.data.name} to ${deptName}.`,
        });
      } else {
        gooeyToast.info("Staff Unassigned", {
          description: `Removed ${response.data.name} from department roster.`,
        });
      }
    },
    onError: (error: any) => {
      gooeyToast.error("Roster Assignment Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          "Could not update staff department assignment.",
      });
    },
  });
};
