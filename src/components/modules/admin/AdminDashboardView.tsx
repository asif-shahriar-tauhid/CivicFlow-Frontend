"use client";

import { cn } from "cn";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Layers,
  RefreshCw,
  Route,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminAnalyticsBreakdown } from "@/components/modules/admin";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { useGetPublicStats } from "@/hooks/dashboard.hooks";
import {
  useGetServiceRequests,
  useRouteServiceRequest,
} from "@/hooks/request.hooks";

export default function AdminDashboardView() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedDeptId, setSelectedDeptId] = useState<string | undefined>(
    undefined,
  );
  const [reroutingId, setReroutingId] = useState<string | null>(null);
  const [isBatchRouting, setIsBatchRouting] = useState(false);

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

  const { mutateAsync: routeRequest } = useRouteServiceRequest();

  const stats = statsData?.data;
  const requests = requestsData?.data || [];

  const unroutedCount = requests.filter(
    (r) => !r.departmentId || r.routingStatus === "MANUAL_REVIEW",
  ).length;

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === "UNROUTED") {
      if (r.departmentId && r.routingStatus !== "MANUAL_REVIEW") return false;
    } else if (filterStatus !== "ALL" && r.status !== filterStatus) {
      return false;
    }
    if (selectedDeptId !== undefined) {
      if (selectedDeptId === "" && r.departmentId) return false;
      if (selectedDeptId !== "" && r.departmentId !== selectedDeptId)
        return false;
    }
    return true;
  });

  const handleRefresh = () => {
    refetchStats();
    refetchRequests();
  };

  const handleReroute = async (requestId: string, requestNumber: string) => {
    try {
      setReroutingId(requestId);
      const res = await routeRequest(requestId);
      const updated = res?.data;
      const deptName = updated?.department?.name;
      const isAssigned =
        updated?.routingStatus === "ASSIGNED" && Boolean(deptName);

      if (isAssigned) {
        gooeyToast.success("Request Routed", {
          description: `Ticket ${requestNumber} successfully assigned to ${deptName}.`,
        });
      } else {
        gooeyToast.info("Manual Review Flagged", {
          description: `Ticket ${requestNumber} could not be auto-routed by current rules and remains in Manual Review.`,
        });
      }
    } catch (error: any) {
      gooeyToast.error("Re-route Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          `Unable to re-evaluate routing rules for ${requestNumber}.`,
      });
    } finally {
      setReroutingId(null);
    }
  };

  const handleRerouteAllUnrouted = async () => {
    const unrouted = requests.filter(
      (r) => !r.departmentId || r.routingStatus === "MANUAL_REVIEW",
    );
    if (unrouted.length === 0) {
      gooeyToast.info("Queue Up To Date", {
        description: "All tickets are already routed to departments.",
      });
      return;
    }

    try {
      setIsBatchRouting(true);
      let successCount = 0;
      let newlyAssignedCount = 0;

      for (const req of unrouted) {
        try {
          const res = await routeRequest(req.id);
          successCount++;
          if (res?.data?.department?.name) {
            newlyAssignedCount++;
          }
        } catch {}
      }

      gooeyToast.success("Batch Routing Complete", {
        description: `Re-evaluated ${successCount} requests. ${newlyAssignedCount} tickets matched and routed to departments.`,
      });
    } catch (error: any) {
      gooeyToast.error("Batch Routing Issue", {
        description:
          error?.message || "Encountered an issue running batch routing.",
      });
    } finally {
      setIsBatchRouting(false);
    }
  };

  return (
    <div className="space-y-8">
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
            render={<Link href="/admin/users" />}
            nativeButton={false}
            className="gap-1.5 rounded-4xl"
          >
            <Users className="size-3.5" />
            <span>Personnel Directory</span>
          </Button>

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

      <AdminAnalyticsBreakdown
        selectedDepartmentId={selectedDeptId}
        onDepartmentFilterChange={(deptId) => setSelectedDeptId(deptId)}
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Municipal Service Influx
              </h2>
              {selectedDeptId !== undefined && (
                <button
                  type="button"
                  onClick={() => setSelectedDeptId(undefined)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold hover:bg-primary/20 transition-colors"
                >
                  <span>Dept Filter Active</span>
                  <span className="font-bold">×</span>
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Complete cross-departmental incident queue with role-scoped
              privileges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              "ALL",
              "UNROUTED",
              "SUBMITTED",
              "IN_PROGRESS",
              "RESOLVED",
              "CLOSED",
            ].map((status) => (
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
                {status === "UNROUTED" ? `UNROUTED (${unroutedCount})` : status}
              </button>
            ))}
            {unroutedCount > 0 && (
              <Button
                variant="outline"
                size="xs"
                onClick={handleRerouteAllUnrouted}
                disabled={isBatchRouting}
                className="gap-1.5 rounded-4xl border-primary/30 text-primary hover:bg-primary/10 text-xs font-medium h-7 px-3 ml-1"
              >
                {isBatchRouting ? (
                  <Spinner className="size-3" />
                ) : (
                  <Route className="size-3" />
                )}
                <span>Auto-Route All ({unroutedCount})</span>
              </Button>
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
                    <th className="px-4 py-3 font-medium">
                      Department & Routing
                    </th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Actions
                    </th>
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
                        {request.department?.name ? (
                          <div className="space-y-1">
                            <div
                              className="flex items-center gap-1.5 font-medium text-foreground max-w-[170px] truncate"
                              title={request.department.name}
                            >
                              <Building2 className="size-3 text-primary shrink-0" />
                              <span className="truncate">
                                {request.department.name}
                              </span>
                            </div>
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                              Assigned
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[11px] text-muted-foreground italic">
                              Unassigned
                            </span>
                            <div>
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold">
                                Manual Review
                              </span>
                            </div>
                          </div>
                        )}
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
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() =>
                              handleReroute(request.id, request.requestNumber)
                            }
                            disabled={
                              reroutingId === request.id || isBatchRouting
                            }
                            className="gap-1 rounded-4xl border-primary/25 text-primary hover:bg-primary/10 hover:text-primary font-medium text-[11px] h-7 px-2.5 shadow-2xs transition-all"
                            title="Re-evaluate automated routing rules for this ticket"
                          >
                            {reroutingId === request.id ? (
                              <>
                                <Spinner className="size-3" />
                                <span>Routing...</span>
                              </>
                            ) : (
                              <>
                                <Route className="size-3" />
                                <span>Re-route</span>
                              </>
                            )}
                          </Button>

                          <Link
                            href={`/admin/requests/${request.id}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "xs" }),
                              "gap-1 text-muted-foreground hover:text-foreground h-7 px-2 cursor-pointer",
                            )}
                          >
                            <span>Review</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </div>
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
