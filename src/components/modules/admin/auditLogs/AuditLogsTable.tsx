"use client";

import { Database, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "@/types/auditLog.types";

interface AuditLogsTableProps {
  logs: AuditLog[];
  onInspect: (log: AuditLog) => void;
  isLoading: boolean;
}

/**
 * Returns tailored badge colors based on action classification
 */
function getActionBadgeStyle(action: string) {
  const a = action.toUpperCase();
  if (
    a.includes("CREATE") ||
    a.includes("ASSIGN") ||
    a.includes("RESTORE") ||
    a.includes("UNARCHIVE")
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
  if (
    a.includes("DELETE") ||
    a.includes("ARCHIVE") ||
    a.includes("BLOCK") ||
    a.includes("BREACH")
  ) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (
    a.includes("UPDATE") ||
    a.includes("EDIT") ||
    a.includes("TRANSITION") ||
    a.includes("ROUTE")
  ) {
    return "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
  }
  return "border-border/80 bg-muted/60 text-foreground";
}

export function AuditLogsTable({
  logs,
  onInspect,
  isLoading,
}: AuditLogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          <Database className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-foreground">
          No Audit Ledger Entries
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No mutation records match your filter parameters. Try clearing action
          filters or adjusting date bounds.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor</th>
              <th className="py-3.5 px-4">Audit Action</th>
              <th className="py-3.5 px-4">Entity</th>
              <th className="py-3.5 px-4">Network & Route</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-normal">
            {logs.map((log) => {
              const formattedDate = new Date(log.timestamp).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              );

              const badgeStyle = getActionBadgeStyle(log.action);

              return (
                <tr
                  key={log.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {/* 1. Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {formattedDate}
                    </span>
                  </td>

                  {/* 2. Actor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 text-[10px] font-bold">
                        {log.actorEmail
                          ? log.actorEmail.charAt(0).toUpperCase()
                          : "S"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate max-w-[150px]">
                          {log.actorEmail || "System Automation"}
                        </div>
                        {log.actorId && (
                          <div className="font-mono text-[9px] text-muted-foreground truncate max-w-[120px]">
                            {log.actorId.slice(0, 8)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 3. Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono tracking-tight ${badgeStyle}`}
                    >
                      {log.action}
                    </Badge>
                  </td>

                  {/* 4. Entity */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground">
                        {log.entity}
                      </span>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        #{log.entityId ? log.entityId.slice(0, 8) : "—"}
                      </div>
                    </div>
                  </td>

                  {/* 5. Route & IP */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5 max-w-[180px]">
                      <div
                        className="font-mono text-[11px] text-muted-foreground truncate"
                        title={log.route || "Internal"}
                      >
                        {log.route || "Internal Job"}
                      </div>
                      {log.ipAddress && (
                        <div className="text-[10px] text-muted-foreground/70 font-mono">
                          {log.ipAddress}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 6. Inspect Button */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onInspect(log)}
                      className="h-7 px-2.5 text-xs gap-1 border-border/70 hover:bg-muted"
                      title="Inspect state mutations and audit metadata"
                    >
                      <Eye className="h-3 w-3 text-primary" />
                      <span>Diff</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
