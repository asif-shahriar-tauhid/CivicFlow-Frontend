import type { RequestStatus } from "./request.types";

export interface RequestFeedbackItem {
  id: string;
  requestId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  request?: {
    id: string;
    requestNumber: string;
    title: string;
    status: RequestStatus;
    category?: {
      id: string;
      name: string;
    } | null;
    department?: {
      id: string;
      name: string;
    } | null;
    citizen?: {
      userId: string;
      name: string;
      email: string;
    } | null;
  } | null;
}

export interface FeedbackReportQueryParams {
  rating?: number;
  status?: RequestStatus;
  categoryId?: string;
  departmentId?: string;
  from?: string;
  to?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface CreateFeedbackPayload {
  rating: number;
  comment?: string;
}
