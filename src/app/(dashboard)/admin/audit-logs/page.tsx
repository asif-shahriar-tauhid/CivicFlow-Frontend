"use client";

import {
  Activity,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Filter,
  Lock,
  RefreshCw,
  Search,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AuditLogDetailModal,
  AuditLogsTable,
  AuditLogTelemetryStrip,
} from "@/components/modules/admin/auditLogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetAuditLogs } from "@/hooks/auditLog.hooks";
import type { AuditLog } from "@/types/auditLog.types";

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [inspectingLog, setInspectingLog] = useState<AuditLog | null>(null);

  const {
    data: auditResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAuditLogs({
    entity: selectedEntity || undefined,
    sortOrder,
    page,
    limit,
  });

  const rawLogs: AuditLog[] = auditResponse?.data || [];
  const meta = auditResponse?.meta || {
    page: 1,
    limit: 20,
    total: rawLogs.length,
    totalPages: 1,
  };

  // Client search filter across current view for instant matching
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return rawLogs;
    const q = searchTerm.toLowerCase().trim();
    return rawLogs.filter((log) => {
      const matchAction = log.action?.toLowerCase().includes(q);
      const matchActor = log.actorEmail?.toLowerCase().includes(q);
      const matchEntity = log.entity?.toLowerCase().includes(q);
      const matchEntityId = log.entityId?.toLowerCase().includes(q);
      const matchRoute = log.route?.toLowerCase().includes(q);
      return (
        matchAction || matchActor || matchEntity || matchEntityId || matchRoute
      );
    });
  }, [rawLogs, searchTerm]);

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors"
            >
              Admin Desk
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Audit Ledger</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                System Audit Ledger
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Immutable, append-only ledger recording all municipal mutations,
                clearance changes, and routing events.
              </p>
            </div>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 border-border/70"
            title="Refresh audit ledger"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin text-primary" : "text-muted-foreground"}`}
            />
            <span className="hidden sm:inline text-xs">
              {isFetching ? "Syncing..." : "Sync Ledger"}
            </span>
          </Button>
        </div>
      </div>

      {/* 2. Telemetry Strip */}
      <AuditLogTelemetryStrip
        logs={rawLogs}
        totalLogs={meta.total || rawLogs.length}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Entity Filter Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="relative">
              <select
                value={selectedEntity}
                onChange={(e) => {
                  setSelectedEntity(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 pr-8 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                aria-label="Filter by target entity"
              >
                <option value="">All Entities</option>
                <option value="User">User Accounts</option>
                <option value="Department">Departments</option>
                <option value="CategoryRoutingRule">Routing Rules</option>
                <option value="ServiceRequest">Service Requests</option>
                <option value="RequestCategory">Request Categories</option>
              </select>
              <Activity className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
            </div>

            {/* Sort Order Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
                setPage(1);
              }}
              className="h-9 px-3 text-xs gap-1.5 border-border/70"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </span>
            </Button>
          </div>

          {/* Keyword Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search action, actor email, or entity ID..."
              className="pl-8.5 pr-8 h-9 text-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary Banner */}
        {(searchTerm || selectedEntity) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <div>
              <span>Showing </span>
              <strong className="text-foreground">{filteredLogs.length}</strong>
              <span> of {meta.total} audit entries</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedEntity("");
              }}
              className="text-primary hover:underline font-medium text-xs"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Decrypting audit log stream...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AuditLogsTable
            logs={filteredLogs}
            onInspect={(log) => setInspectingLog(log)}
            isLoading={isLoading}
          />

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPages} ({meta.total} total
                events)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Detail Inspection Modal */}
      <AuditLogDetailModal
        log={inspectingLog}
        isOpen={Boolean(inspectingLog)}
        onClose={() => setInspectingLog(null)}
      />
    </div>
  );
}
