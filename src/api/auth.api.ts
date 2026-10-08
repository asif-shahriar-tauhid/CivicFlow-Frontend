import apiClient from "@/lib/apiClient";
import type { AuthSuccessResponse, AuthTokens, User } from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  patient?: {
    contactNumber?: string;
  };
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

export interface GoogleOAuthPayload {
  idToken: string;
}

export const googleOAuth = (
  payload: GoogleOAuthPayload,
): Promise<ApiResponse<AuthTokens>> => {
  return apiClient("/auth/google", { method: "POST", body: payload });
};

export const userLogin = (
  payload: LoginPayload,
): Promise<ApiResponse<AuthTokens>> => {
  return apiClient("/auth/login", { method: "POST", body: payload });
};

export const userRegister = (payload: RegisterPayload) => {
  return apiClient("/auth/register", { method: "POST", body: payload });
};

export const verifyEmail = (
  payload: VerifyEmailPayload,
): Promise<ApiResponse<AuthSuccessResponse>> => {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
};

export const userLogout = (): Promise<ApiResponse<null>> => {
  return apiClient("/auth/logout", { method: "POST" });
};

export const getMe = (): Promise<ApiResponse<User>> => {
  return apiClient("/auth/me");
};

export const forgotPassword = (payload: ForgotPasswordPayload) => {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
};

export const resetPassword = (payload: ResetPasswordPayload) => {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
};

export interface ResendOtpPayload {
  email: string;
}

export const resendOtp = (
  payload: ResendOtpPayload,
): Promise<ApiResponse<null>> => {
  return apiClient("/auth/resend-otp", { method: "POST", body: payload });
};
