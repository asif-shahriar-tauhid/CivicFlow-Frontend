import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, uploadProfileImage } from "@/api/user.api";
import type { User } from "@/types/auth.types";
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
