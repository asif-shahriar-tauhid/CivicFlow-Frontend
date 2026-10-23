"use client";

import {
  Activity,
  BarChart2,
  Flame,
  GitBranch,
  MapPin,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import type { ServiceRequest } from "@/types/request.types";

interface AdminOperationalChartsProps {
  requests: ServiceRequest[];
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

const LIFECYCLE_STAGES = [
  {
    key: "SUBMITTED",
    label: "Submitted",
    barClass: "bg-sky-500",
    badgeClass: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
  },
  {
    key: "TRIAGED",
    label: "Triaged",
    barClass: "bg-indigo-500",
    badgeClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    barClass: "bg-amber-500",
    badgeClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    key: "RESOLVED",
    label: "Resolved",
    barClass: "bg-emerald-500",
    badgeClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    key: "CLOSED",
    label: "Closed",
    barClass: "bg-teal-500",
    badgeClass: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
  },
  {
    key: "REOPENED",
    label: "Reopened",
    barClass: "bg-rose-500",
    badgeClass: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  },
];

const PRIORITY_SEGMENTS = [
  {
    key: "URGENT",
    label: "Urgent",
    stroke: "#f43f5e",
    dotClass: "bg-rose-500",
  },
  {
    key: "HIGH",
    label: "High",
    stroke: "#f59e0b",
    dotClass: "bg-amber-500",
  },
  {
    key: "NORMAL",
    label: "Normal",
    stroke: "#0ea5e9",
    dotClass: "bg-sky-500",
  },
  {
    key: "LOW",
    label: "Low",
    stroke: "#10b981",
    dotClass: "bg-emerald-500",
  },
];

export function AdminOperationalCharts({
  requests,
  activeStatusFilter,
  onSelectStatusFilter,
}: AdminOperationalChartsProps) {
  const totalRequests = requests.length;

  // 1. Lifecycle Bar Chart Data from real requests
  const stageData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of requests) {
      const normalized =
        r.status === "ASSIGNED" ? "TRIAGED" : r.status || "SUBMITTED";
      counts[normalized] = (counts[normalized] || 0) + 1;
    }

    const maxCount = Math.max(
      1,
      ...LIFECYCLE_STAGES.map((s) => counts[s.key] || 0),
    );

    return LIFECYCLE_STAGES.map((stage) => {
      const count = counts[stage.key] || 0;
      const heightPct =
        count > 0 ? Math.max(16, Math.round((count / maxCount) * 100)) : 6;
      const sharePct =
        totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
      return {
        ...stage,
        count,
        heightPct,
        sharePct,
      };
    });
  }, [requests, totalRequests]);

  // 2. Priority Donut & Routing Triage Data from real requests
  const priorityAndTriage = useMemo(() => {
    const counts: Record<string, number> = {
      URGENT: 0,
      HIGH: 0,
      NORMAL: 0,
      LOW: 0,
    };
    let assignedDeptCount = 0;
    let manualReviewCount = 0;
    let assignedStaffCount = 0;

    const wardMap = new Map<string, number>();

    for (const r of requests) {
      const p = r.priority || "NORMAL";
      counts[p] = (counts[p] || 0) + 1;

      if (r.departmentId && r.routingStatus !== "MANUAL_REVIEW") {
        assignedDeptCount++;
      } else {
        manualReviewCount++;
      }

      if (r.assignedToId || r.assignedTo?.id) {
        assignedStaffCount++;
      }

      const wardKey = r.ward
        ? r.ward.toLowerCase().startsWith("ward")
          ? r.ward
          : `Ward ${r.ward}`
        : "Ward 04";
      wardMap.set(wardKey, (wardMap.get(wardKey) || 0) + 1);
    }

    const total = Math.max(1, requests.length);
    const circumference = 2 * Math.PI * 38; // r=38 -> ~238.76
    let accumulatedPct = 0;

    const segments = PRIORITY_SEGMENTS.map((seg) => {
      const count = counts[seg.key] || 0;
      const pct = requests.length > 0 ? (count / total) * 100 : 0;
      const dashLength = (pct / 100) * circumference;
      const dashOffset = -((accumulatedPct / 100) * circumference);
      accumulatedPct += pct;
      return {
        ...seg,
        count,
        pct: Math.round(pct),
        dashArray: `${dashLength} ${circumference}`,
        dashOffset,
      };
    });

    const topWards = Array.from(wardMap.entries())
      .map(([ward, count]) => ({
        ward,
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      segments,
      assignedDeptCount,
      manualReviewCount,
      assignedStaffCount,
      routedPct:
        requests.length > 0 ? Math.round((assignedDeptCount / total) * 100) : 0,
      staffPct:
        requests.length > 0
          ? Math.round((assignedStaffCount / total) * 100)
          : 0,
      topWards,
    };
  }, [requests]);

  // 3. Velocity Trend Line/Area Graph Data (buckets across timeline / FIFO sequence)
  const trendSeries = useMemo(() => {
    const sorted = [...requests].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const bucketLabels = [
      "Window 1",
      "Window 2",
      "Window 3",
      "Window 4",
      "Window 5",
      "Current",
    ];

    if (sorted.length === 0) {
      return bucketLabels.map((label, i) => ({
        label,
        intake: [1, 2, 2, 3, 4, 5][i],
        resolved: [0, 1, 1, 2, 2, 3][i],
      }));
    }

    // Cumulative intake vs cumulative active/resolved across 6 checkpoints
    return bucketLabels.map((label, idx) => {
      const sliceEnd = Math.max(
        1,
        Math.ceil(((idx + 1) / bucketLabels.length) * sorted.length),
      );
      const subset = sorted.slice(0, sliceEnd);
      const intake = subset.length;
      const resolved = subset.filter(
        (r) =>
          r.status === "RESOLVED" ||
          r.status === "CLOSED" ||
          r.status === "IN_PROGRESS",
      ).length;
      const dateLabel = subset[subset.length - 1]?.createdAt
        ? new Date(subset[subset.length - 1].createdAt).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" },
          )
        : label;
      return {
        label: idx === bucketLabels.length - 1 ? "Now" : dateLabel,
        intake,
        resolved,
      };
    });
  }, [requests]);

  const maxY = Math.max(5, ...trendSeries.map((d) => d.intake));
  const chartWidth = 480;
  const chartHeight = 150;
  const padX = 24;
  const padY = 18;

  const intakePoints = trendSeries.map((pt, i) => {
    const x =
      padX +
      (i / Math.max(1, trendSeries.length - 1)) * (chartWidth - padX * 2);
    const y =
      chartHeight - padY - (pt.intake / maxY) * (chartHeight - padY * 2);
    return { x, y, val: pt.intake, label: pt.label };
  });

  const resolvedPoints = trendSeries.map((pt, i) => {
    const x =
      padX +
      (i / Math.max(1, trendSeries.length - 1)) * (chartWidth - padX * 2);
    const y =
      chartHeight - padY - (pt.resolved / maxY) * (chartHeight - padY * 2);
    return { x, y, val: pt.resolved, label: pt.label };
  });

  const intakePolyline = intakePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const intakeAreaPath =
    intakePoints.length > 0
      ? `M ${intakePoints[0].x},${chartHeight - padY} L ${intakePoints
          .map((p) => `${p.x},${p.y}`)
          .join(" L ")} L ${intakePoints[intakePoints.length - 1].x},${
          chartHeight - padY
        } Z`
      : "";

  const resolvedPolyline = resolvedPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <section
      aria-label="Operational Visuals & Triage Charts"
      className="grid grid-cols-1 gap-6 lg:grid-cols-12"
    >
      {/* Chart 1: Interactive Lifecycle Pipeline Column Bar Graph (5 Cols) */}
      <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart2 className="size-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Lifecycle State Bar Graph
                </h3>
                <p className="text-xs text-muted-foreground">
                  Click any state bar to filter the triage queue below
                </p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              {totalRequests} Total
            </Badge>
          </div>

          {/* Vertical Column Chart */}
          <div className="mt-6 grid grid-cols-6 gap-2.5 items-end h-44 pt-6 px-1 border-b border-border/80">
            {stageData.map((stage) => {
              const isSelected = activeStatusFilter === stage.key;
              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() =>
                    onSelectStatusFilter(isSelected ? "ALL" : stage.key)
                  }
                  className={`group flex flex-col items-center justify-end h-full rounded-t-lg transition-all cursor-pointer focus:outline-none ${
                    isSelected ? "ring-2 ring-primary/40 bg-primary/5" : ""
                  }`}
                  title={`${stage.label}: ${stage.count} tickets (${stage.sharePct}%) — Click to filter`}
                >
                  <span className="mb-1.5 font-mono text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {stage.count}
                  </span>
                  <div className="w-full max-w-[36px] bg-muted/50 rounded-t-lg h-28 flex items-end overflow-hidden p-0.5">
                    <div
                      style={{ height: `${stage.heightPct}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${stage.barClass} group-hover:opacity-90`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="mt-2.5 grid grid-cols-6 gap-1 text-center">
            {stageData.map((stage) => (
              <div key={stage.key} className="flex flex-col items-center">
                <span className="text-[10px] font-semibold text-foreground truncate max-w-full">
                  {stage.label}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  {stage.sharePct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Deterministic 5-stage state machine</span>
          {activeStatusFilter !== "ALL" && (
            <button
              type="button"
              onClick={() => onSelectStatusFilter("ALL")}
              className="font-semibold text-primary hover:underline cursor-pointer"
            >
              Reset Bar Filter ({activeStatusFilter})
            </button>
          )}
        </div>
      </div>

      {/* Chart 2: Cumulative Intake vs. Action Velocity Area/Line Graph (4 Cols) */}
      <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Influx vs. Action Velocity
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cumulative intake vs. active/resolved progression
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-2.5 rounded-full bg-sky-500" />
                <span>Total Intake</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span>Actioned / Resolved</span>
              </span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              FIFO Timeline
            </span>
          </div>

          {/* SVG Line & Area Graph */}
          <div className="mt-3 rounded-xl border border-border/60 bg-muted/15 p-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-36 overflow-visible"
              role="img"
              aria-label="Influx vs Action Velocity Line Chart"
            >
              <title>Influx vs Action Velocity Line Chart</title>
              <defs>
                <linearGradient id="intakeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio) => {
                const y =
                  chartHeight - padY - ratio * (chartHeight - padY * 2);
                return (
                  <line
                    key={ratio}
                    x1={padX}
                    y1={y}
                    x2={chartWidth - padX}
                    y2={y}
                    stroke="currentColor"
                    className="text-border"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Intake Area Fill */}
              {intakeAreaPath && (
                <path d={intakeAreaPath} fill="url(#intakeGradient)" />
              )}

              {/* Intake Line */}
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={intakePolyline}
              />

              {/* Resolved Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={resolvedPolyline}
              />

              {/* Intake Nodes */}
              {intakePoints.map((pt, i) => (
                <g key={`in-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    className="fill-sky-500 stroke-card"
                    strokeWidth="2"
                  />
                </g>
              ))}

              {/* Resolved Nodes */}
              {resolvedPoints.map((pt, i) => (
                <g key={`res-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    className="fill-emerald-500 stroke-card"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </svg>

            <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-muted-foreground">
              {trendSeries.map((pt, idx) => (
                <span key={idx}>{pt.label}</span>
              ))}
            </div>
          </div>

          {/* Triage Routing Funnel Visual Bars */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                <GitBranch className="size-3.5 text-primary" />
                <span>Department Routing Coverage</span>
              </span>
              <span className="font-mono font-bold text-foreground">
                {priorityAndTriage.assignedDeptCount}/{totalRequests} (
                {priorityAndTriage.routedPct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                style={{ width: `${priorityAndTriage.routedPct}%` }}
                className="h-full bg-primary rounded-full transition-all duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                <Activity className="size-3.5 text-emerald-500" />
                <span>Field Technician Dispatch Rate</span>
              </span>
              <span className="font-mono font-bold text-foreground">
                {priorityAndTriage.assignedStaffCount}/{totalRequests} (
                {priorityAndTriage.staffPct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                style={{ width: `${priorityAndTriage.staffPct}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Real-time triage funnel</span>
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
            {priorityAndTriage.manualReviewCount} in Manual Review
          </span>
        </div>
      </div>

      {/* Chart 3: Priority Severity Donut & Active Ward Hotspots (3 Cols) */}
      <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <PieChart className="size-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Severity &amp; Ward Split
                </h3>
                <p className="text-xs text-muted-foreground">
                  Priority distribution &amp; hotspots
                </p>
              </div>
            </div>
          </div>

          {/* Multi-Segment SVG Donut Chart */}
          <div className="mt-5 flex items-center gap-4">
            <div className="relative flex size-24 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="size-full -rotate-90"
                role="img"
                aria-label="Priority Severity Donut Chart"
              >
                <title>Priority Severity Donut Chart</title>
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-muted/50"
                  strokeWidth="12"
                />
                {priorityAndTriage.segments.map((seg) =>
                  seg.count > 0 ? (
                    <circle
                      key={seg.key}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={seg.stroke}
                      strokeWidth="12"
                      strokeDasharray={seg.dashArray}
                      strokeDashoffset={seg.dashOffset}
                      className="transition-all duration-700"
                    />
                  ) : null,
                )}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <Flame className="size-3.5 text-rose-500" />
                <span className="font-mono text-sm font-black text-foreground">
                  {totalRequests}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 text-xs">
              {priorityAndTriage.segments.map((seg) => (
                <div
                  key={seg.key}
                  className="flex items-center justify-between"
                >
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className={`size-2 rounded-full ${seg.dotClass}`} />
                    <span className="font-medium text-foreground">
                      {seg.label}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-foreground">
                    {seg.count} ({seg.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Active Wards */}
          <div className="mt-5 pt-4 border-t border-border/60 space-y-2.5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin className="size-3 text-primary" />
              <span>Top Active Wards</span>
            </span>

            {priorityAndTriage.topWards.map((w) => (
              <div key={w.ward} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{w.ward}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {w.count} tickets ({w.pct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${w.pct}%` }}
                    className="h-full bg-primary/80 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Geospatial ward telemetry</span>
          <span className="font-mono text-primary font-semibold">Live</span>
        </div>
      </div>
    </section>
  );
}
