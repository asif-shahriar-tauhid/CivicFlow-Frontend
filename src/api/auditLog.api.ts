import apiClient from "@/lib/apiClient";
import type { AuditLog, AuditLogQueryParams } from "@/types/auditLog.types";
import type { ApiResponse } from "@/types/dashboard.types";

/**
 * Fetch immutable system audit logs with filtering and pagination
 */
export const getAuditLogs = async (
  params?: AuditLogQueryParams,
): Promise<ApiResponse<AuditLog[]>> => {
  return apiClient("/audit-logs", {
    method: "GET",
    query: params,
  });
};
