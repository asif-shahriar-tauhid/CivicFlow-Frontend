export type NotificationEventKey =
  | "REQUEST_SUBMITTED"
  | "REQUEST_STATUS_CHANGED"
  | "REQUEST_ASSIGNED"
  | "REQUEST_ACTION_REQUIRED"
  | "REQUEST_RESOLVED"
  | "REQUEST_REOPENED"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUNDED"
  | "PAYMENT_RECONCILED"
  | "SLA_BREACHED"
  | "SLA_BREACH_ALERT"
  | "NEW_HIGH_PRIORITY_REQUEST"
  | "NEW_CITIZEN_FEEDBACK"
  | string;

export interface NotificationMetadata {
  requestId?: string;
  requestNumber?: string;
  paymentId?: string;
  trxId?: string;
  status?: string;
  priority?: string;
  rating?: number;
  department?: string;
  zone?: string;
  amount?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  recipientId?: string;
  eventKey: NotificationEventKey;
  eventId: string;
  title: string;
  message: string;
  metadata?: NotificationMetadata | null;
  readAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
}

export interface NotificationUnreadCount {
  count: number;
}

