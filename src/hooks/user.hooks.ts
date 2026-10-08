import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUserById,
  softDeleteUser,
  updateUser,
  uploadProfileImage,
} from "@/api/user.api";
import type {
  UpdateUserInput,
  User,
  UserQueryParams,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";

/**
 * Mutation hook to upload user avatar image and update active auth user cache
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: (res: ApiResponse<User>) => {
      if (res?.data) {
        queryClient.setQueryData(["user"], res);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

/**
 * Hook to inspect a single user record by ID
 */
export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to retrieve all users with pagination, filters, and search
 */
export const useGetAllUsers = (query?: UserQueryParams) => {
  return useQuery({
    queryKey: ["admin-users", query],
    queryFn: () => getAllUsers(query),
    staleTime: 15 * 1000,
  });
};

/**
 * Hook to update user role, status, name, or department
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserInput;
    }) => updateUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({
        queryKey: ["user-detail", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });
};

/**
 * Hook to soft-delete / block user
 */
export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => softDeleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({
        queryKey: ["user-detail", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });
};

