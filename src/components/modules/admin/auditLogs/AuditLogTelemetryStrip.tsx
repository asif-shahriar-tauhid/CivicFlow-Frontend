"use client";

import { Activity, Database, Lock, UserCheck } from "lucide-react";
import type { AuditLog } from "@/types/auditLog.types";

interface AuditLogTelemetryStripProps {
  logs: AuditLog[];
  totalLogs: number;
  isLoading: boolean;
}

export function AuditLogTelemetryStrip({
  logs,
  totalLogs,
  isLoading,
}: AuditLogTelemetryStripProps) {
  // Unique entities tracked in current view
  const uniqueEntities = new Set(logs.map((l) => l.entity)).size;

  // Unique actors in current view
  const uniqueActors = new Set(logs.map((l) => l.actorEmail).filter(Boolean))
    .size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Audit Entries */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Total Ledger Entries
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Database className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : totalLogs}
          </span>
          <span className="text-xs text-primary font-medium">
            events recorded
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Append-only immutable system trail
        </p>
      </div>

      {/* 2. Target Entities Covered */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-indigo-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Monitored Entities
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : uniqueEntities}
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            entity models
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Users, Depts, Routing Rules, Tickets
        </p>
      </div>

      {/* 3. Authorised Actors */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Active Operators
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <UserCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : uniqueActors}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            authorized actors
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          RBAC administrators and automated cron jobs
        </p>
      </div>

      {/* 4. Security & Compliance Guarantee */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Security Guarantee
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground border border-border">
            <Lock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-foreground">
            Tamper-Proof
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Level 4
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Cryptographically timestamped & un-editable
        </p>
      </div>
    </div>
  );
}
