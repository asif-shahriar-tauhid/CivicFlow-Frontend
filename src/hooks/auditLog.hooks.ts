import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/api/auditLog.api";
import type { AuditLogQueryParams } from "@/types/auditLog.types";

/**
 * Hook to retrieve immutable system audit logs
 */
export const useGetAuditLogs = (params?: AuditLogQueryParams) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
    staleTime: 60 * 1000, // 1 minute stale time
  });
};
