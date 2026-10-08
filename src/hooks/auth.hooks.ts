import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  googleOAuth,
  resendOtp,
  resetPassword,
  userLogin,
  userLogout,
  userRegister,
  verifyEmail,
} from "@/api/auth.api";

export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: async () => {
      try {
        const me = await getMe();
        queryClient.setQueryData(["user"], me);
      } catch {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: async () => {
      try {
        const me = await getMe();
        queryClient.setQueryData(["user"], me);
      } catch {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: async (res) => {
      if (res?.data?.user) {
        queryClient.setQueryData(["user"], {
          success: true,
          statusCode: 200,
          message: "User profile",
          data: res.data.user,
        });
      }
      try {
        const me = await getMe();
        queryClient.setQueryData(["user"], me);
      } catch {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useGetME = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCurrentUser = () => {
  const { data, isLoading, isError, refetch } = useGetME();
  const user = data?.data;
  return {
    user,
    role: user?.role,
    isAuthenticated: Boolean(user),
    isLoading,
    isError,
    refetch,
  };
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
