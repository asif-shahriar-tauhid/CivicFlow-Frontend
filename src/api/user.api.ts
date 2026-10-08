import apiClient from "@/lib/apiClient";
import type {
  PaginatedUsersResponse,
  UpdateUserInput,
  User,
  UserQueryParams,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";

/**
 * Upload a new profile avatar photo and update user record
 */
export const uploadProfileImage = async (
  file: File,
): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiClient("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
};

/**
 * Fetch detailed profile telemetry for a single user by ID
 */
export const getUserById = async (
  userId: string,
): Promise<ApiResponse<User>> => {
  return apiClient(`/user/${userId}`, {
    method: "GET",
  });
};

/**
 * Fetch all users with search, role/status filtering, and pagination
 */
export const getAllUsers = async (
  query?: UserQueryParams,
): Promise<PaginatedUsersResponse> => {
  return apiClient("/user", {
    method: "GET",
    query: query as Record<string, any>,
  });
};

/**
 * Update user details, role, status, or department
 */
export const updateUser = async (
  userId: string,
  payload: UpdateUserInput,
): Promise<ApiResponse<User>> => {
  return apiClient(`/user/${userId}`, {
    method: "PATCH",
    body: payload,
  });
};

/**
 * Soft-delete / deactivate user
 */
export const softDeleteUser = async (
  userId: string,
): Promise<ApiResponse<User>> => {
  return apiClient(`/user/${userId}`, {
    method: "DELETE",
  });
};

