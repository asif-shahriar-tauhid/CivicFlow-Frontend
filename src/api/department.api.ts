import apiClient from "@/lib/apiClient";
import type { User } from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  CreateDepartmentPayload,
  Department,
  UpdateDepartmentPayload,
} from "@/types/department.types";

/**
 * Fetch list of municipal departments
 */
export const getDepartments = async (params?: {
  includeArchived?: boolean;
}): Promise<ApiResponse<Department[]>> => {
  return apiClient("/departments", {
    method: "GET",
    query: params,
  });
};

/**
 * Create a new municipal department
 */
export const createDepartment = async (
  payload: CreateDepartmentPayload,
): Promise<ApiResponse<Department>> => {
  return apiClient("/departments", {
    method: "POST",
    body: payload,
  });
};

/**
 * Update an existing department (name, description, status)
 */
export const updateDepartment = async (
  departmentId: string,
  payload: UpdateDepartmentPayload,
): Promise<ApiResponse<Department>> => {
  return apiClient(`/departments/${departmentId}`, {
    method: "PATCH",
    body: payload,
  });
};

/**
 * Soft-delete / Archive a department (also deactivates linked routing rules)
 */
export const archiveDepartment = async (
  departmentId: string,
): Promise<ApiResponse<Department>> => {
  return apiClient(`/departments/${departmentId}/archive`, {
    method: "PATCH",
  });
};

/**
 * Restore / Unarchive a previously archived department
 */
export const unarchiveDepartment = async (
  departmentId: string,
): Promise<ApiResponse<Department>> => {
  return apiClient(`/departments/${departmentId}/unarchive`, {
    method: "PATCH",
  });
};

/**
 * Assign or reassign a staff user to a department (or null to unassign)
 */
export const assignStaffDepartment = async (
  userId: string,
  departmentId: string | null,
): Promise<ApiResponse<User>> => {
  return apiClient(`/staff/${userId}/department`, {
    method: "PATCH",
    body: { departmentId },
  });
};
