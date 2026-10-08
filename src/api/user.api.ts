import apiClient from "@/lib/apiClient";
import type { User } from "@/types/auth.types";
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
