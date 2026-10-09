"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  GitBranch,
  Inbox,
  Shield,
} from "lucide-react";
import type { Department } from "@/types/department.types";

interface DepartmentTelemetryHeaderProps {
  departments: Department[];
  isLoading?: boolean;
}

export function DepartmentTelemetryHeader({
  departments,
  isLoading = false,
}: DepartmentTelemetryHeaderProps) {
  const total = departments.length;
  const active = departments.filter((d) => !d.isArchived && d.isActive).length;
  const archived = departments.filter(
    (d) => d.isArchived || !d.isActive,
  ).length;

  const totalRoutingRules = departments.reduce(
    (sum, d) => sum + (d._count?.routingRules || 0),
    0,
  );
  const totalServiceRequests = departments.reduce(
    (sum, d) => sum + (d._count?.serviceRequests || 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Municipal Desks
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {isLoading ? "—" : total}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                divisions
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Building2 className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span>Citywide operational divisions</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active & Dispatchable
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {isLoading ? "—" : active}
              </span>
              <span className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
                active
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Receiving real-time grievances</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Routing Rules
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                {isLoading ? "—" : totalRoutingRules}
              </span>
              <span className="text-xs font-medium text-indigo-600/80 dark:text-indigo-400/80">
                rules wired
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <GitBranch className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <Shield className="h-3.5 w-3.5 text-indigo-500" />
          <span>Category-to-division pipelines</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Grievance Load
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
                {isLoading ? "—" : totalServiceRequests}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                assigned tickets
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Inbox className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Archived desks: {archived}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
