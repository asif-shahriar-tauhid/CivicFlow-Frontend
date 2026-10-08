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
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: string;
    name: string;
  } | null;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
  departmentId?: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  departmentId?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: User[];
  meta: PaginationMeta;
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
