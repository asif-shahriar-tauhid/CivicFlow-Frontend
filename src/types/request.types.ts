export type RequestStatus =
  | "SUBMITTED"
  | "TRIAGED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "AWAITING_CITIZEN"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED"
  | "ON_HOLD"
  | "REOPENED";

export type RequestPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type CaseType = "COMPLAINT" | "SERVICE_REQUEST";

export type SlaEscalationState =
  | "NONE"
  | "BREACHED"
  | "ACKNOWLEDGED"
  | "ESCALATED";

export type RoutingStatus = "MANUAL_REVIEW" | "ASSIGNED";

export interface RequestCategory {
  id: string;
  name: string;
  description?: string | null;
  feeAmount: number;
  feeCurrency: string;
  slaMinutes: number;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface RequestAttachment {
  id: string;
  url?: string;
  fileUrl?: string;
  fileName: string;
  mimeType?: string;
  fileType?: string;
  fileSize?: number;
  resourceType?: string;
  format?: string | null;
  caption?: string | null;
  createdAt: string;
}

export interface RequestStatusHistory {
  id: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  reason?: string | null;
  createdAt: string;
  actor?: {
    id?: string;
    name: string;
    role: string;
  } | null;
}

export interface RequestInvestigationNote {
  id: string;
  note: string;
  createdAt: string;
  actor?: {
    id?: string;
    name: string;
    role: string;
  } | null;
}

export interface RequestResolution {
  id: string;
  reason: string;
  createdAt: string;
  actor?: {
    id?: string;
    name: string;
    role: string;
  } | null;
}

export interface RequestFeedback {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface RequestPayment {
  id: string;
  status:
    | "UNPAID"
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";
  amount: number;
  currency: string;
  merchantInvoiceNumber: string;
  checkoutUrl?: string | null;
  bkashTrxId?: string | null;
  invoiceUrl?: string | null;
  invoicePublicId?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  caseType: CaseType;
  status: RequestStatus;
  priority: RequestPriority;
  location?: string | null;
  address?: string | null;
  ward?: string | null;
  zone?: string | null;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  routingStatus: RoutingStatus;
  slaDueAt?: string | null;
  slaBreachedAt?: string | null;
  slaEscalationState: SlaEscalationState;
  citizenId: string;
  categoryId?: string | null;
  departmentId?: string | null;
  createdById: string;
  assignedToId?: string | null;
  resolutionSummary?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: RequestCategory | null;
  department?: Department | null;
  assignedTo?: { id: string; name: string; email: string } | null;
  createdBy?: { id: string; name: string; email: string } | null;
  attachments?: RequestAttachment[];
  statusHistory?: RequestStatusHistory[];
  investigationNotes?: RequestInvestigationNote[];
  resolution?: RequestResolution | null;
  feedback?: RequestFeedback | null;
  payments?: RequestPayment[];
}

export interface RequestFilterParams {
  searchTerm?: string;
  status?: RequestStatus;
  caseType?: CaseType;
  priority?: RequestPriority;
  categoryId?: string;
  ward?: string;
  zone?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status" | "title";
  sortOrder?: "asc" | "desc";
}

export interface CreateServiceRequestInput {
  title: string;
  description: string;
  caseType?: CaseType;
  priority?: RequestPriority;
  location?: string;
  address?: string;
  ward?: string;
  zone?: string;
  landmark?: string;
  latitude?: number | null;
  longitude?: number | null;
  categoryId?: string;
  files?: File[];
}
