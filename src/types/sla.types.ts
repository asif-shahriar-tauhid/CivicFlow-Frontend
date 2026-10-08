import type {
  RequestCategory,
  RequestStatus,
  SlaEscalationState,
} from "./request.types";

export interface SlaOverdueRequest {
  id: string;
  requestNumber: string;
  title: string;
  status: RequestStatus;
  slaDueAt: string | null;
  slaPausedAt: string | null;
  slaPausedDurationSeconds: number;
  slaBreachedAt: string | null;
  slaEscalationState: SlaEscalationState;
  department?: {
    id: string;
    name: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface SlaOverdueQueryParams {
  departmentId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface SlaConfigPayload {
  slaMinutes: number;
}

export interface SlaProcessResult {
  processed?: number;
  count?: number;
  candidates?: number;
  [key: string]: unknown;
}
