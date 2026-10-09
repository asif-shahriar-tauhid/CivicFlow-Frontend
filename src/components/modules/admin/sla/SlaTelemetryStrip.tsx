"use client";

import { AlertOctagon, ClockAlert, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SlaOverdueRequest } from "@/types/sla.types";

interface SlaTelemetryStripProps {
  overdueRequests: SlaOverdueRequest[];
  totalOverdue: number;
  isLoading: boolean;
  onRunBatchProcess: () => void;
  isProcessingBatch: boolean;
}

export function SlaTelemetryStrip({
  overdueRequests,
  totalOverdue,
  isLoading,
  onRunBatchProcess,
  isProcessingBatch,
}: SlaTelemetryStripProps) {
  const escalatedCount = overdueRequests.filter(
    (r) => r.slaEscalationState === "ESCALATED",
  ).length;

  const breachedCount = overdueRequests.filter(
    (r) => Boolean(r.slaBreachedAt) || r.slaEscalationState === "BREACHED",
  ).length;

  const _urgentPendingCount = overdueRequests.filter(
    (r) => r.slaEscalationState === "NONE" || !r.slaEscalationState,
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-destructive/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-destructive/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Total Overdue Incidents
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            <ClockAlert className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : totalOverdue}
          </span>
          <span className="text-xs text-destructive font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            Active breaches
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Passed target resolution SLA timers
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-amber-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Recorded Breaches
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : breachedCount}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            breached tickets
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Formally stamped by batch engine
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-purple-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Supervisory Escalations
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <AlertOctagon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : escalatedCount}
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            escalated
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Elevated for executive oversight
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-primary/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              SLA Batch Engine
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Scan open cases & evaluate breach state
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onRunBatchProcess}
          disabled={isProcessingBatch}
          className="mt-3 w-full h-8 text-xs font-medium gap-1.5 shadow-xs"
        >
          <Zap
            className={`h-3.5 w-3.5 ${isProcessingBatch ? "animate-spin" : ""}`}
          />
          <span>
            {isProcessingBatch ? "Scanning Breaches..." : "Trigger Batch Scan"}
          </span>
        </Button>
      </div>
    </div>
  );
}
