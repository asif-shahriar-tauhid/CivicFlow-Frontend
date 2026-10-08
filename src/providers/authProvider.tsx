"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useGetME, useLogout } from "@/hooks/auth.hooks";
import type { User, UserRole } from "@/types/auth.types";

interface AuthContextType {
  user: User | undefined;
  role: UserRole | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  logout: () => void;
  logoutPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isFetching, isError, refetch } = useGetME();
  const { mutate: logoutMutate, isPending: logoutPending } = useLogout();

  const user = data?.data;
  const role = user?.role;
  const isAuthenticated = Boolean(user);
  const isAuthLoading = isLoading || (isFetching && !user);

  const logout = () => {
    logoutMutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading: isAuthLoading,
        isError,
        refetch,
        logout,
        logoutPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
