"use client";

import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Layers,
  RefreshCw,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetPublicStats } from "@/hooks/dashboard.hooks";
import { useGetServiceRequests } from "@/hooks/request.hooks";

export default function AdminDashboardPage() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetPublicStats();
  const {
    data: requestsData,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useGetServiceRequests();

  const stats = statsData?.data;
  const requests = requestsData?.data || [];

  const filteredRequests =
    filterStatus === "ALL"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const handleRefresh = () => {
    refetchStats();
    refetchRequests();
  };

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Civic Operations & Governance
            </h1>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Live Control
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Municipal incident triage, department routing dispatch, and SLA
            escalation monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/admin/payments" />}
            nativeButton={false}
            className="gap-1.5 rounded-4xl"
          >
            <CircleDollarSign className="size-3.5" />
            <span>Revenue Ledger</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-1.5 rounded-4xl"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh Telemetry</span>
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Ingested
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {statsLoading ? "—" : (stats?.totalRequests ?? requests.length)}
            </span>
            <span className="text-xs text-muted-foreground">tickets</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Lifetime municipal service requests
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Resolution Rate
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {statsLoading ? "—" : `${stats?.resolutionRate ?? 0}%`}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Verified
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {stats?.resolvedRequests ?? 0} confirmed resolved cases
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              SLA Compliance
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {statsLoading ? "—" : `${stats?.slaComplianceRate ?? 100}%`}
            </span>
            <span className="text-xs text-muted-foreground">on-target</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Average turnaround: {stats?.avgResolutionTimeHours ?? "—"} hrs
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Triage Queue
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {
                requests.filter(
                  (r) => r.status === "SUBMITTED" || r.status === "TRIAGED",
                ).length
              }
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Pending action
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Awaiting routing or assignment
          </p>
        </div>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 className="size-4 text-primary" />
              <span>Department Routing Engine</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Define category routing rules, assign department leaders, and
              configure ward dispatch protocols.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Automated rule matching</span>
            <Badge variant="secondary" className="text-[10px]">
              Active
            </Badge>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="size-4 text-amber-500" />
              <span>SLA Escalation Engine</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Batch audit overdue requests, trigger automated supervisor
              escalation, and monitor breach timelines.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Deterministic state timers</span>
            <Badge variant="secondary" className="text-[10px]">
              Monitored
            </Badge>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="size-4 text-primary" />
              <span>System Audit Logs</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Immutable audit trail recording state transitions, staff
              reassignments, and administrative operations.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Prisma tamper-resistant logs</span>
            <Badge variant="secondary" className="text-[10px]">
              Enabled
            </Badge>
          </div>
        </div>
      </div>

      {/* Service Requests Operations Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Municipal Service Influx
            </h2>
            <p className="text-xs text-muted-foreground">
              Complete cross-departmental incident queue with role-scoped
              privileges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(
              (status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-4xl text-xs font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>

        {requestsLoading ? (
          <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4 text-primary" />
              <span>Loading civic incidents...</span>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-12 text-center">
            <p className="text-sm font-medium text-foreground">
              No service requests match the filter criteria
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              New citizen submissions will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tracking ID</th>
                    <th className="px-4 py-3 font-medium">Title & Location</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        {request.requestNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground max-w-xs truncate">
                          {request.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                          {request.address ||
                            request.location ||
                            "Location logged"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            request.status === "RESOLVED" ||
                            request.status === "CLOSED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] uppercase font-mono"
                        >
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            request.priority === "URGENT" ||
                            request.priority === "HIGH"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {request.priority || "NORMAL"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          render={
                            <Link href={`/citizen/requests/${request.id}`} />
                          }
                          nativeButton={false}
                          className="gap-1 text-primary hover:text-primary"
                        >
                          <span>Review</span>
                          <ArrowRight className="size-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
