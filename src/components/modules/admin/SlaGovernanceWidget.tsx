"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  ResolutionAnalytics,
  SlaAnalytics,
} from "@/types/dashboard.types";

interface SlaGovernanceWidgetProps {
  sla: SlaAnalytics;
  resolution?: ResolutionAnalytics;
}

export function SlaGovernanceWidget({
  sla,
  resolution,
}: SlaGovernanceWidgetProps) {
  const compliance = Math.max(0, Math.min(100, sla.complianceRate ?? 100));
  const onTimeRequests = Math.max(
    0,
    (sla.totalRequests || 0) - (sla.breachedRequests || 0),
  );

  // Health tier classification
  const isHealthy = compliance >= 90;
  const isWarning = compliance >= 75 && compliance < 90;

  const strokeDashoffset = 283 - (283 * compliance) / 100;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Widget Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                SLA Compliance Governance
              </h3>
              <p className="text-xs text-muted-foreground">
                Automated turnaround timer &amp; breach detection
              </p>
            </div>
          </div>

          <Badge
            variant={
              isHealthy ? "success" : isWarning ? "warning" : "destructive"
            }
            className="text-[10px] font-bold uppercase tracking-wider"
          >
            {isHealthy ? "Optimal" : isWarning ? "At Risk" : "Breached"}
          </Badge>
        </div>

        {/* Circular Gauge & Hero Metric */}
        <div className="mt-5 flex items-center justify-center gap-6 py-2">
          {/* Radial SVG Gauge */}
          <div className="relative flex size-28 items-center justify-center">
            <svg
              className="size-full -rotate-90"
              viewBox="0 0 100 100"
              role="img"
              aria-label="SLA Compliance Gauge"
            >
              <title>SLA Compliance Gauge: {compliance.toFixed(1)}%</title>
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-muted/60"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className={`transition-all duration-1000 ease-out ${
                  isHealthy
                    ? "stroke-emerald-500"
                    : isWarning
                      ? "stroke-amber-500"
                      : "stroke-rose-500"
                }`}
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black tracking-tight text-foreground">
                {compliance.toFixed(1)}%
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                On-Time
              </span>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="flex flex-col gap-2 min-w-32">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Evaluated Volume
              </span>
              <span className="text-lg font-extrabold text-foreground font-mono">
                {sla.totalRequests}
              </span>
            </div>

            <div
              className={`rounded-xl border p-2.5 ${
                sla.breachedRequests > 0
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "border-border/60 bg-muted/20 text-muted-foreground"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider block">
                Breached SLA
              </span>
              <span className="text-lg font-extrabold font-mono">
                {sla.breachedRequests} Cases
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats Strip */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-0.5">
              <CheckCircle2 className="size-3.5" />
              <span>Compliant</span>
            </div>
            <span className="text-base font-black text-foreground font-mono">
              {onTimeRequests}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Within statutory clock
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold mb-0.5">
              <Zap className="size-3.5 text-primary" />
              <span>Avg Speed</span>
            </div>
            <span className="text-base font-black text-foreground font-mono">
              {resolution?.avgHours !== undefined
                ? `${Math.abs(Math.round(resolution.avgHours))}h`
                : "24h"}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Turnaround duration
            </span>
          </div>
        </div>

        {/* Alert Callout if breach present */}
        {sla.breachedRequests > 0 ? (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">
                {sla.breachedRequests} incident(s) breached statutory deadline.
              </strong>{" "}
              Supervisor escalation triggered.
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Zero outstanding escalations. Municipal queues on schedule.
            </span>
          </div>
        )}
      </div>

      {/* Footer shortcut */}
      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          SLA Timers active 24/7
        </span>
        <Button
          variant="ghost"
          size="xs"
          render={<Link href="/admin/sla" />}
          nativeButton={false}
          className="gap-1 text-primary hover:text-primary text-xs"
        >
          <span>Monitor Escalations</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
