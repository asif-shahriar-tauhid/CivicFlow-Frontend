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

export interface StatusBreakdownItem {
  status: string;
  count: number;
}

export interface CategoryBreakdownItem {
  categoryId: string | null;
  categoryName: string;
  count: number;
}

export interface DepartmentBreakdownItem {
  departmentId: string | null;
  departmentName: string;
  count: number;
}

export interface SlaAnalytics {
  totalRequests: number;
  breachedRequests: number;
  complianceRate: number;
}

export interface ResolutionAnalytics {
  count: number;
  avgHours: number;
  minHours?: number;
  maxHours?: number;
}

export interface PaymentCategoryAnalytics {
  count: number;
  totalAmount?: string | number;
}

export interface PaymentAnalytics {
  completed: PaymentCategoryAnalytics;
  pending: PaymentCategoryAnalytics;
  failed?: PaymentCategoryAnalytics;
}

export interface AdminAnalyticsParams {
  from?: string;
  to?: string;
  departmentId?: string;
}

export interface AdminDashboardData {
  statusBreakdown: StatusBreakdownItem[];
  categoryBreakdown: CategoryBreakdownItem[];
  departmentBreakdown: DepartmentBreakdownItem[];
  sla: SlaAnalytics;
  resolution: ResolutionAnalytics;
  payments: PaymentAnalytics;
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
