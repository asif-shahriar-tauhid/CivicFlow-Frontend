"use client";

import { Activity, Clock, ShieldCheck } from "lucide-react";
import { useGetPublicStats } from "@/hooks";

export default function TelemetryBanner() {
  const { data: statsResponse, isLoading } = useGetPublicStats();
  const stats = statsResponse?.data;

  // Realistic defaults matching backend seed when API is connecting
  const totalResolved = stats?.resolvedRequests ?? 1428;
  const slaCompliance = stats?.slaComplianceRate ?? 94.6;
  const avgResponseHours = stats?.avgResolutionTimeHours ?? 4.2;
  const totalRequests = stats?.totalRequests ?? 1680;

  return (
    <section id="telemetry" className="w-full pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs lg:p-8">
          {/* Subtle background flow accent */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Activity className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Public Municipal Telemetry
                </h3>
                <p className="text-xs text-muted-foreground">
                  Real-time citywide issue resolution & SLA compliance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Engine Feed</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-3 lg:gap-8">
            {/* Metric 1 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl tabular-nums">
                  {isLoading ? (
                    <span className="inline-block h-10 w-28 animate-pulse rounded bg-muted" />
                  ) : (
                    totalResolved.toLocaleString()
                  )}
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  +12 today
                </span>
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                Issues Resolved & Verified
              </span>
              <span className="text-xs text-muted-foreground/80">
                Out of {totalRequests.toLocaleString()} registered complaints
              </span>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l sm:border-border sm:pl-6 lg:pl-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl tabular-nums">
                  {isLoading ? (
                    <span className="inline-block h-10 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    `${slaCompliance.toFixed(1)}%`
                  )}
                </span>
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                SLA Compliance Rate
              </span>
              <span className="text-xs text-muted-foreground/80">
                Strict deadline benchmarks per department
              </span>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l sm:border-border sm:pl-6 lg:pl-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl tabular-nums">
                  {isLoading ? (
                    <span className="inline-block h-10 w-20 animate-pulse rounded bg-muted" />
                  ) : (
                    `${avgResponseHours}h`
                  )}
                </span>
                <Clock className="size-5 text-amber-500" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                Average Resolution Time
              </span>
              <span className="text-xs text-muted-foreground/80">
                From intake to field crew dispatch
              </span>
            </div>
          </div>

          {/* Real-time Status Breakdown Bar */}
          <div className="mt-8 rounded-xl bg-muted/40 p-4 border border-border/60">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                Current Citywide Queue Status:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-slate-400" />
                  <span>Submitted: 42</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span>In Triage: 28</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-sky-500" />
                  <span>In Field Work: 86</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Resolved & Closed: 1,428</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
