"use client";

import {
  AlertOctagon,
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClockAlert,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  SlaBatchProcessModal,
  SlaEscalateModal,
  SlaOverdueTable,
  SlaTelemetryStrip,
} from "@/components/modules/admin/sla";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import {
  useGetOverdueRequests,
  useProcessSlaBreaches,
} from "@/hooks/sla.hooks";
import type { SlaOverdueRequest } from "@/types/sla.types";

export default function AdminSlaOverduePage() {
  // Query & Filter states
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(25);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusTab, setStatusTab] = useState<
    "ALL" | "ESCALATED" | "BREACHED" | "NONE"
  >("ALL");

  // Modals state
  const [escalatingRequest, setEscalatingRequest] =
    useState<SlaOverdueRequest | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);

  // Queries
  const {
    data: overdueResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetOverdueRequests({
    departmentId: selectedDepartmentId ? selectedDepartmentId : undefined,
    page,
    limit,
  });

  const { data: deptResponse } = useGetDepartments();
  const departments = deptResponse?.data || [];

  const rawOverdueRequests: SlaOverdueRequest[] = overdueResponse?.data || [];
  const meta = overdueResponse?.meta || {
    page: 1,
    limit: 25,
    total: rawOverdueRequests.length,
    totalPages: 1,
  };

  const { isPending: isBatchRunning } = useProcessSlaBreaches();

  // Client-side filtering for search & escalation tabs
  const filteredRequests = useMemo(() => {
    return rawOverdueRequests.filter((req) => {
      // 1. Escalation tab filter
      if (statusTab === "ESCALATED" && req.slaEscalationState !== "ESCALATED") {
        return false;
      }
      if (
        statusTab === "BREACHED" &&
        !req.slaBreachedAt &&
        req.slaEscalationState !== "BREACHED"
      ) {
        return false;
      }
      if (
        statusTab === "NONE" &&
        (req.slaEscalationState === "ESCALATED" ||
          req.slaEscalationState === "BREACHED")
      ) {
        return false;
      }

      // 2. Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesNum = req.requestNumber?.toLowerCase().includes(q);
        const matchesTitle = req.title?.toLowerCase().includes(q);
        const matchesCat = req.category?.name?.toLowerCase().includes(q);
        const matchesDept = req.department?.name?.toLowerCase().includes(q);
        return matchesNum || matchesTitle || matchesCat || matchesDept;
      }

      return true;
    });
  }, [rawOverdueRequests, statusTab, searchTerm]);

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
            <span className="text-foreground font-semibold">
              SLA Monitoring
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <ClockAlert className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                SLA Overdue Incidents
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Supervisory oversight of municipal service breaches, deadline
                timeouts, and escalation queues.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 border-border/70"
            title="Refresh SLA queue"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin text-primary" : "text-muted-foreground"}`}
            />
            <span className="hidden sm:inline text-xs">
              {isFetching ? "Syncing..." : "Sync"}
            </span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsBatchModalOpen(true)}
            disabled={isBatchRunning}
            className="h-9 px-3.5 gap-2 text-xs font-semibold shadow-sm"
          >
            <Zap className="h-4 w-4" />
            <span>Trigger Batch Scan</span>
          </Button>
        </div>
      </div>

      {/* 2. Telemetry Strip */}
      <SlaTelemetryStrip
        overdueRequests={rawOverdueRequests}
        totalOverdue={meta.total || rawOverdueRequests.length}
        isLoading={isLoading}
        onRunBatchProcess={() => setIsBatchModalOpen(true)}
        isProcessingBatch={isBatchRunning}
      />

      {/* 3. Toolbar & Filters */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setStatusTab("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusTab === "ALL"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All Overdue</span>
              <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] text-muted-foreground font-mono">
                {rawOverdueRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab("ESCALATED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusTab === "ESCALATED"
                  ? "bg-background text-purple-600 dark:text-purple-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Escalated</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-mono">
                {
                  rawOverdueRequests.filter(
                    (r) => r.slaEscalationState === "ESCALATED",
                  ).length
                }
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab("BREACHED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusTab === "BREACHED"
                  ? "bg-background text-destructive shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Breached</span>
              <span className="px-1.5 py-0.2 rounded-full bg-destructive/10 text-destructive text-[10px] font-mono">
                {
                  rawOverdueRequests.filter(
                    (r) =>
                      Boolean(r.slaBreachedAt) ||
                      r.slaEscalationState === "BREACHED",
                  ).length
                }
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab("NONE")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusTab === "NONE"
                  ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Pending Action</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-mono">
                {
                  rawOverdueRequests.filter(
                    (r) =>
                      r.slaEscalationState === "NONE" || !r.slaEscalationState,
                  ).length
                }
              </span>
            </button>
          </div>

          {/* Department Filter & Search */}
          <div className="flex items-center gap-2.5 flex-1 md:max-w-md md:justify-end">
            {/* Department Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedDepartmentId}
                onChange={(e) => {
                  setSelectedDepartmentId(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 pr-8 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                aria-label="Filter by department division"
              >
                <option value="">All Divisions</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <Building2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
            </div>

            {/* Keyword Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket # or title..."
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
        </div>

        {/* Filter Summary Banner */}
        {(searchTerm || selectedDepartmentId || statusTab !== "ALL") && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <div>
              <span>Showing </span>
              <strong className="text-foreground">
                {filteredRequests.length}
              </strong>
              <span> of {meta.total} overdue incidents</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedDepartmentId("");
                setStatusTab("ALL");
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
            Auditing SLA overdue incidents...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <SlaOverdueTable
            requests={filteredRequests}
            onEscalate={(req) => setEscalatingRequest(req)}
            isLoading={isLoading}
          />

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
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

      {/* 5. Modals */}
      <SlaEscalateModal
        request={escalatingRequest}
        isOpen={Boolean(escalatingRequest)}
        onClose={() => setEscalatingRequest(null)}
        onSuccess={() => refetch()}
      />

      <SlaBatchProcessModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
