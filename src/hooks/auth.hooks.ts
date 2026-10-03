import {
  type LoginPayload,
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  userLogin,
  userLogout,
  userRegister,
  verifyEmail,
} from "@/api/auth.api";
import { removeCookie, setCookie } from "@/lib/cookieUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = (await userLogin(payload)) as any;
      if (res?.data?.accessToken) {
        setCookie("accessToken", res.data.accessToken, 1);
      }
      if (res?.data?.refreshToken) {
        setCookie("refreshToken", res.data.refreshToken, 7);
      }
      return res;
    },
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await userLogout();
      } catch (err) {
        console.error("Logout request encountered error:", err);
      } finally {
        removeCookie("accessToken");
        removeCookie("refreshToken");
      }
    },
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
