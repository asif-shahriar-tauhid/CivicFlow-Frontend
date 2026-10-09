"use client";

import {
  AlertOctagon,
  Building2,
  ClockAlert,
  ExternalLink,
  ShieldAlert,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SlaOverdueRequest } from "@/types/sla.types";

interface SlaOverdueTableProps {
  requests: SlaOverdueRequest[];
  onEscalate: (request: SlaOverdueRequest) => void;
  isLoading: boolean;
}

/**
 * Format duration since SLA due date
 */
function getOverdueDuration(dueAtString: string | null): string {
  if (!dueAtString) return "Overdue";
  const dueDate = new Date(dueAtString);
  const diffMs = Date.now() - dueDate.getTime();
  if (diffMs <= 0) return "Due soon";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h overdue`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m overdue`;
  }
  return `${minutes}m overdue`;
}

export function SlaOverdueTable({
  requests,
  onEscalate,
  isLoading,
}: SlaOverdueTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
          <ClockAlert className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-foreground">
          No Overdue Incidents Found
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          All active municipal grievances and service requests are currently
          within their SLA target turnaround times.
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
              <th className="py-3.5 px-4">Incident Ticket</th>
              <th className="py-3.5 px-4">Division & Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">SLA Breach Elapsed</th>
              <th className="py-3.5 px-4">Escalation State</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {requests.map((req) => {
              const isEscalated = req.slaEscalationState === "ESCALATED";
              const isBreached =
                Boolean(req.slaBreachedAt) ||
                req.slaEscalationState === "BREACHED";
              const overdueText = getOverdueDuration(req.slaDueAt);

              const formattedDeadline = req.slaDueAt
                ? new Date(req.slaDueAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—";

              return (
                <tr
                  key={req.id}
                  className={`group transition-colors ${
                    isEscalated
                      ? "bg-purple-500/5 hover:bg-purple-500/10"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive border border-destructive/20 shrink-0 mt-0.5">
                        <ClockAlert className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                            {req.requestNumber}
                          </span>
                        </div>
                        <p
                          className="text-xs text-muted-foreground line-clamp-1 mt-0.5"
                          title={req.title}
                        >
                          {req.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {req.department?.name || "Unassigned"}
                        </span>
                      </div>
                      {req.category?.name && (
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                          <Tag className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {req.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border/80 bg-muted/60 text-foreground font-medium"
                    >
                      {req.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[11px] font-semibold border border-destructive/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
                        <span>{overdueText}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Deadline: {formattedDeadline}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isEscalated ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center gap-1 w-fit font-semibold"
                      >
                        <AlertOctagon className="h-3 w-3" />
                        <span>Escalated to Supervisor</span>
                      </Badge>
                    ) : isBreached ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-1 w-fit font-medium"
                      >
                        <ShieldAlert className="h-3 w-3" />
                        <span>Breached SLA</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1 w-fit"
                      >
                        <ClockAlert className="h-3 w-3" />
                        <span>Overdue Pending</span>
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {!isEscalated && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEscalate(req)}
                          className="h-7 px-2.5 text-xs gap-1 border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold"
                          title="Escalate to supervisory review"
                        >
                          <AlertOctagon className="h-3 w-3" />
                          <span>Escalate</span>
                        </Button>
                      )}

                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-1 h-7 px-2 text-xs rounded-md border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View in Admin Incident Triage"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Triage</span>
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
  );
}
