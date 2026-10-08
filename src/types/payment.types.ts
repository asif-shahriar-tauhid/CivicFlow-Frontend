export type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface PaymentServiceRequestRef {
  id: string;
  requestNumber: string;
  title: string;
  caseType?: string;
  category?: {
    id: string;
    name: string;
    feeAmount: number;
    feeCurrency: string;
  } | null;
  department?: {
    id: string;
    name: string;
  } | null;
  citizen?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
}

export interface PaymentAppointmentRef {
  id: string;
  appointmentNumber?: string;
  scheduledAt?: string;
  citizen?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  merchantInvoiceNumber: string;
  checkoutUrl?: string | null;
  bkashTrxId?: string | null;
  invoiceUrl?: string | null;
  invoicePublicId?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  appointmentId?: string | null;
  serviceRequestId?: string | null;
  serviceRequest?: PaymentServiceRequestRef | null;
  appointment?: PaymentAppointmentRef | null;
}

export interface PaymentStatusView {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt?: string | null;
  trxID?: string | null;
  serviceRequestId?: string | null;
  invoiceUrl?: string | null;
}

export interface PaymentInitiateResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  checkoutUrl: string;
  merchantInvoiceNumber: string;
}

export interface PaymentFilterParams {
  searchTerm?: string;
  status?: PaymentStatus | "ALL";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "amount" | "status" | "merchantInvoiceNumber";
  sortOrder?: "asc" | "desc";
}

export interface PaymentStatsSummary {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  totalCount: number;
}
