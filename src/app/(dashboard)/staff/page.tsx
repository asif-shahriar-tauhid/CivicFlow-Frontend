"use client";

import { cn } from "cn";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Flame,
  HardHat,
  MapPin,
  RefreshCw,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AssignStaffModal,
  ResolveTicketModal,
  StatusTransitionModal,
} from "@/components/modules/requests";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useGetDepartmentQueue, useGetMyQueue } from "@/hooks/request.hooks";
import type { ServiceRequest } from "@/types/request.types";

export default function StaffQueuePage() {
  const { user, role } = useCurrentUser();
  const isAdmin = role === "ADMIN";
  const [queueScope, setQueueScope] = useState<"personal" | "department">(
    "personal",
  );
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedTicketForTransition, setSelectedTicketForTransition] =
    useState<ServiceRequest | null>(null);
  const [selectedTicketForResolve, setSelectedTicketForResolve] =
    useState<ServiceRequest | null>(null);
  const [selectedTicketForAssign, setSelectedTicketForAssign] =
    useState<ServiceRequest | null>(null);

  const {
    data: myQueueData,
    isLoading: isMyLoading,
    refetch: refetchMy,
    isFetching: isMyFetching,
  } = useGetMyQueue();

  const {
    data: deptQueueData,
    isLoading: isDeptLoading,
    refetch: refetchDept,
    isFetching: isDeptFetching,
  } = useGetDepartmentQueue();

  const myRequests = useMemo(() => myQueueData?.data || [], [myQueueData]);
  const deptRequests = useMemo(
    () => deptQueueData?.data || [],
    [deptQueueData],
  );

  const candidateStaffList = useMemo(() => {
    const list: Array<{ id: string; name: string; email: string }> = [];
    const seen = new Set<string>();
    for (const r of deptRequests) {
      if (r.assignedTo && !seen.has(r.assignedTo.id)) {
        seen.add(r.assignedTo.id);
        list.push({
          id: r.assignedTo.id,
          name: r.assignedTo.name,
          email: r.assignedTo.email,
        });
      }
    }
    return list;
  }, [deptRequests]);

  const activeRequests = queueScope === "personal" ? myRequests : deptRequests;
  const isLoading = queueScope === "personal" ? isMyLoading : isDeptLoading;
  const isFetching = isMyFetching || isDeptFetching || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchMy(), refetchDept()]);
      gooeyToast.info("Queue Refreshed", {
        description: "Municipal field queue has been synchronized.",
      });
    } catch {
      gooeyToast.error("Refresh Failed", {
        description: "Unable to reach dispatch server.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return activeRequests.filter((r: ServiceRequest) => {
      if (filterStatus !== "ALL" && r.status !== filterStatus) {
        return false;
      }
      if (filterPriority !== "ALL" && r.priority !== filterPriority) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = r.requestNumber?.toLowerCase().includes(query);
        const matchesTitle = r.title?.toLowerCase().includes(query);
        const matchesLocation = (r.location || r.address || "")
          .toLowerCase()
          .includes(query);
        const matchesWard = (r.ward || "").toLowerCase().includes(query);
        const matchesCategory = (r.category?.name || "")
          .toLowerCase()
          .includes(query);
        const matchesAssignee = (r.assignedTo?.name || "")
          .toLowerCase()
          .includes(query);
        return (
          matchesNumber ||
          matchesTitle ||
          matchesLocation ||
          matchesWard ||
          matchesCategory ||
          matchesAssignee
        );
      }
      return true;
    });
  }, [activeRequests, filterStatus, filterPriority, searchQuery]);

  const activeCount = useMemo(
    () =>
      activeRequests.filter((r) =>
        [
          "SUBMITTED",
          "TRIAGED",
          "ASSIGNED",
          "IN_PROGRESS",
          "REOPENED",
        ].includes(r.status),
      ).length,
    [activeRequests],
  );

  const urgentCount = useMemo(
    () =>
      activeRequests.filter(
        (r) =>
          r.priority === "URGENT" ||
          r.priority === "HIGH" ||
          r.slaEscalationState === "ESCALATED" ||
          Boolean(r.slaBreachedAt),
      ).length,
    [activeRequests],
  );

  const completedCount = useMemo(
    () =>
      activeRequests.filter(
        (r) => r.status === "RESOLVED" || r.status === "CLOSED",
      ).length,
    [activeRequests],
  );

  const departmentName =
    user?.department?.name ||
    activeRequests[0]?.department?.name ||
    "Field Operations Division";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Field Operations Desk
            </h1>
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs"
            >
              Field Crew
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs font-medium text-muted-foreground"
            >
              {departmentName}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage assigned civic complaints, monitor SLA countdowns, and
            execute municipal field work orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="gap-1.5 rounded-4xl"
          >
            <RefreshCw
              className={cn(
                "size-3.5",
                isFetching && "animate-spin text-primary",
              )}
            />
            <span>{isFetching ? "Syncing..." : "Refresh Queue"}</span>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-1.5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setQueueScope("personal")}
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer",
              queueScope === "personal"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  queueScope === "personal"
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                <UserCheck className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">My Personal Queue</div>
                <div
                  className={cn(
                    "text-xs",
                    queueScope === "personal"
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  Work orders assigned specifically to you
                </div>
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold font-mono",
                queueScope === "personal"
                  ? "bg-white text-primary"
                  : "bg-muted text-foreground",
              )}
            >
              {isMyLoading ? "—" : myRequests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setQueueScope("department")}
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer",
              queueScope === "department"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  queueScope === "department"
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Building2 className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Department Queue</div>
                <div
                  className={cn(
                    "text-xs",
                    queueScope === "department"
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  All grievances routed to {departmentName}
                </div>
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold font-mono",
                queueScope === "department"
                  ? "bg-white text-primary"
                  : "bg-muted text-foreground",
              )}
            >
              {isDeptLoading ? "—" : deptRequests.length}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {queueScope === "personal"
                ? "Active Assignments"
                : "Department In-Flight"}
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HardHat className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "—" : activeCount}
            </span>
            <span className="text-xs text-muted-foreground">
              in active triage
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {queueScope === "personal"
              ? "Assigned work orders requiring your direct field response"
              : "All grievances currently undergoing municipal resolution"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Urgent / SLA Critical
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
              {isLoading ? "—" : urgentCount}
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              SLA Priority
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Critical priority or supervisory escalated tickets
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Resolved & Closed
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "—" : completedCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Completed
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Grievances successfully remediated or verified
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {queueScope === "personal"
                  ? "My Assigned Work Orders"
                  : "Department Dispatch Pool"}
              </h2>
              <Badge variant="outline" className="text-xs font-mono">
                {filteredRequests.length}{" "}
                {filteredRequests.length === 1 ? "order" : "orders"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {queueScope === "personal"
                ? "Field grievances assigned directly to your specialist ID"
                : `All active incidents routed to ${departmentName}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search ticket, ward, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 text-xs h-8.5 rounded-4xl bg-card"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-4xl bg-muted/40 p-0.5 border border-border">
              {(["ALL", "URGENT", "HIGH"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPriority(p)}
                  className={cn(
                    "px-2.5 py-1 rounded-4xl text-[11px] font-medium transition-colors cursor-pointer",
                    filterPriority === p
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {[
            { label: "All Tickets", value: "ALL" },
            { label: "Assigned", value: "ASSIGNED" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Reopened", value: "REOPENED" },
            { label: "Resolved", value: "RESOLVED" },
            { label: "Closed", value: "CLOSED" },
          ].map(({ label, value }) => (
            <button
              type="button"
              key={value}
              onClick={() => setFilterStatus(value)}
              className={cn(
                "px-3 py-1 rounded-4xl text-xs font-medium transition-colors cursor-pointer",
                filterStatus === value
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
          {(filterStatus !== "ALL" ||
            filterPriority !== "ALL" ||
            Boolean(searchQuery)) && (
            <button
              type="button"
              onClick={() => {
                setFilterStatus("ALL");
                setFilterPriority("ALL");
                setSearchQuery("");
              }}
              className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4 text-primary" />
              <span>
                Loading{" "}
                {queueScope === "personal"
                  ? "personal queue"
                  : "department queue"}
                ...
              </span>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              {queueScope === "personal" ? (
                <UserCheck className="size-6 text-primary" />
              ) : (
                <Building2 className="size-6 text-primary" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {filterStatus !== "ALL" || filterPriority !== "ALL" || searchQuery
                ? "No work orders matching filters"
                : queueScope === "personal"
                  ? "Your personal queue is all clear"
                  : "No grievances in department dispatch pool"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {filterStatus !== "ALL" || filterPriority !== "ALL" || searchQuery
                ? "Try widening your search terms or clearing status filters."
                : queueScope === "personal"
                  ? "You have no outstanding assignments. Switch to the Department Queue to review unassigned tickets or newly dispatched grievances."
                  : "All department tickets have been processed or moved to resolved status."}
            </p>
            {queueScope === "personal" && myRequests.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQueueScope("department")}
                className="mt-4 gap-1.5 rounded-4xl"
              >
                <Building2 className="size-3.5" />
                <span>View Department Queue ({deptRequests.length})</span>
              </Button>
            )}
            {(filterStatus !== "ALL" ||
              filterPriority !== "ALL" ||
              Boolean(searchQuery)) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterStatus("ALL");
                  setFilterPriority("ALL");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-4xl"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tracking ID</th>
                    <th className="px-4 py-3 font-medium">
                      Incident & Category
                    </th>
                    <th className="px-4 py-3 font-medium">Location & Ward</th>
                    <th className="px-4 py-3 font-medium">Assignee</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Priority & SLA</th>
                    <th className="px-4 py-3 font-medium">Reported</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => {
                    const isAssignedToMe =
                      request.assignedTo?.id === user?.id ||
                      request.assignedTo?.email === user?.email;
                    const isEscalated =
                      request.slaEscalationState === "ESCALATED" ||
                      Boolean(request.slaBreachedAt);

                    return (
                      <tr
                        key={request.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 font-mono font-medium text-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-primary font-bold">
                              {request.requestNumber}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground max-w-xs truncate">
                            {request.title}
                          </div>
                          {request.category && (
                            <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                              {request.category.name}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-[11px] text-foreground font-medium truncate max-w-xs">
                            <MapPin className="size-3 shrink-0 text-muted-foreground" />
                            <span>
                              {request.ward ? `${request.ward} • ` : ""}
                              {request.address ||
                                request.location ||
                                "Location recorded"}
                            </span>
                          </div>
                          {request.landmark && (
                            <div className="text-[10px] text-muted-foreground pl-4 truncate max-w-xs">
                              Near {request.landmark}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {isAdmin ? (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTicketForAssign(request)
                              }
                              className="group/assignee inline-flex items-center gap-1.5 text-left rounded-lg p-1 -m-1 hover:bg-muted/60 transition-colors cursor-pointer"
                              title={
                                request.assignedTo
                                  ? "Click to reassign officer"
                                  : "Click to assign officer"
                              }
                            >
                              {isAssignedToMe ? (
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium group-hover/assignee:border-primary/40">
                                  Assigned to You
                                </Badge>
                              ) : request.assignedTo ? (
                                <div className="flex items-center gap-1 text-muted-foreground group-hover/assignee:text-foreground">
                                  <span className="text-[11px] font-medium text-foreground truncate max-w-[120px]">
                                    {request.assignedTo.name}
                                  </span>
                                  <UserCheck className="size-3 text-muted-foreground opacity-0 group-hover/assignee:opacity-100 transition-opacity" />
                                </div>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] group-hover/assignee:bg-amber-500/20"
                                >
                                  + Assign
                                </Badge>
                              )}
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-left">
                              {isAssignedToMe ? (
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
                                  Assigned to You
                                </Badge>
                              ) : request.assignedTo ? (
                                <span className="text-[11px] font-medium text-foreground truncate max-w-[120px]">
                                  {request.assignedTo.name}
                                </span>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="border-muted bg-muted/30 text-muted-foreground text-[10px]"
                                >
                                  Unassigned
                                </Badge>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge
                            variant={
                              request.status === "RESOLVED" ||
                              request.status === "CLOSED"
                                ? "default"
                                : request.status === "REOPENED"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[10px] uppercase font-mono"
                          >
                            {request.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold",
                                request.priority === "URGENT"
                                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                  : request.priority === "HIGH"
                                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                    : "bg-muted text-muted-foreground",
                              )}
                            >
                              {request.priority || "NORMAL"}
                            </span>
                            {isEscalated && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                <Flame className="size-3" />
                                SLA Breach
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(request.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {isAdmin && (
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() =>
                                  setSelectedTicketForAssign(request)
                                }
                                className="gap-1 rounded-full border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 shadow-xs text-xs font-semibold h-7 px-2.5"
                                title={
                                  request.assignedTo
                                    ? "Reassign field technician"
                                    : "Assign field technician"
                                }
                              >
                                <UserCheck className="size-3" />
                                <span>
                                  {request.assignedTo ? "Reassign" : "Assign"}
                                </span>
                              </Button>
                            )}
                            {isAdmin && request.status === "IN_PROGRESS" && (
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() =>
                                  setSelectedTicketForResolve(request)
                                }
                                className="gap-1 rounded-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 shadow-xs text-xs font-semibold h-7 px-2.5"
                                title="Mark field work as resolved with mandatory summary"
                              >
                                <CheckCircle2 className="size-3 text-emerald-600" />
                                <span>Resolve</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() =>
                                setSelectedTicketForTransition(request)
                              }
                              className="gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/10 shadow-xs text-xs font-semibold h-7 px-2.5"
                              title="Transition ticket lifecycle status"
                            >
                              <HardHat className="size-3" />
                              <span>Transition</span>
                            </Button>
                            <Link
                              href={`/staff/requests/${request.id}`}
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "xs",
                                }),
                                "gap-1 text-primary hover:text-primary cursor-pointer font-medium",
                              )}
                            >
                              <span>Manage</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <StatusTransitionModal
        ticket={selectedTicketForTransition}
        isOpen={Boolean(selectedTicketForTransition)}
        onClose={() => setSelectedTicketForTransition(null)}
        onSuccess={() => {
          setSelectedTicketForTransition(null);
          refetchMy();
          refetchDept();
        }}
      />

      <ResolveTicketModal
        ticket={selectedTicketForResolve}
        isOpen={Boolean(selectedTicketForResolve)}
        onClose={() => setSelectedTicketForResolve(null)}
        onSuccess={() => {
          setSelectedTicketForResolve(null);
          refetchMy();
          refetchDept();
        }}
      />

      <AssignStaffModal
        ticket={selectedTicketForAssign}
        isOpen={Boolean(selectedTicketForAssign)}
        candidateStaffList={candidateStaffList}
        onClose={() => setSelectedTicketForAssign(null)}
        onSuccess={() => {
          setSelectedTicketForAssign(null);
          refetchMy();
          refetchDept();
        }}
      />
    </div>
  );
}
