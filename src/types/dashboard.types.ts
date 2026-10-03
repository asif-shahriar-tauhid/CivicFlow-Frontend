export interface PublicStats {
  totalRequests: number;
  resolvedRequests: number;
  resolutionRate: number;
  avgResolutionTimeHours: number;
  slaComplianceRate: number;
  statusBreakdown: {
    SUBMITTED?: number;
    TRIAGED?: number;
    ASSIGNED?: number;
    IN_PROGRESS?: number;
    AWAITING_CITIZEN?: number;
    RESOLVED?: number;
    CLOSED?: number;
    REJECTED?: number;
    ON_HOLD?: number;
    REOPENED?: number;
    [key: string]: number | undefined;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
