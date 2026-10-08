export type UserRole = "CITIZEN" | "STAFF" | "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  imageUrl?: string | null;
  departmentId?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: string;
    name: string;
  } | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSuccessResponse {
  user?: User;
  citizen?: {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
