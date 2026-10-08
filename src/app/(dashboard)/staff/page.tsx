"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HardHat,
  MapPin,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetServiceRequests } from "@/hooks/request.hooks";

export default function StaffQueuePage() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const { data: requestsData, isLoading, refetch } = useGetServiceRequests();

  const requests = requestsData?.data || [];

  const filteredRequests =
    filterStatus === "ALL"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const urgentCount = requests.filter(
    (r) => r.priority === "URGENT" || r.priority === "HIGH",
  ).length;

  const inProgressCount = requests.filter(
    (r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Department Operations Queue
            </h1>
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-600 dark:text-amber-400"
            >
              Field Desk
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage assigned civic complaints, record investigation notes, and
            update resolution status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 rounded-4xl"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh Queue</span>
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Assigned Tickets
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HardHat className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "—" : inProgressCount}
            </span>
            <span className="text-xs text-muted-foreground">in queue</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Active work orders requiring field resolution
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              High Priority / Urgent
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
              SLA Critical
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Expedited dispatch SLA required
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Resolved This Week
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {isLoading
                ? "—"
                : requests.filter(
                    (r) => r.status === "RESOLVED" || r.status === "CLOSED",
                  ).length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Completed
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Awaiting citizen verification or closed
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Work Orders</h2>
            <p className="text-xs text-muted-foreground">
              Filter issues assigned to your municipal operating department.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(
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

        {/* Incidents List */}
        {isLoading ? (
          <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4 text-primary" />
              <span>Loading work orders...</span>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-12 text-center">
            <p className="text-sm font-medium text-foreground">
              No work orders in this category
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Check back for newly routed department incidents.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tracking ID</th>
                    <th className="px-4 py-3 font-medium">
                      Incident & Location
                    </th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Reported</th>
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
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate max-w-xs">
                          <MapPin className="size-3 shrink-0" />
                          <span>
                            {request.address ||
                              request.location ||
                              "Location recorded"}
                          </span>
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
                          <span>Manage</span>
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
