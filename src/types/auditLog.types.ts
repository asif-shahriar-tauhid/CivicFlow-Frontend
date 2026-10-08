export interface AuditLog {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entity: string;
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string | null;
  route: string | null;
  userAgent: string | null;
  timestamp: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  actorId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  from?: string;
  to?: string;
  sortOrder?: "asc" | "desc";
}
