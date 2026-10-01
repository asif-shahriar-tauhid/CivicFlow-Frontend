import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, userLogin, userLogout } from "@/api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
  });
};

export const useGetME = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });
};
