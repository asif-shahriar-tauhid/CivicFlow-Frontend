"use client";

import { AlertOctagon, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEscalateSlaRequest } from "@/hooks/sla.hooks";
import type { SlaOverdueRequest } from "@/types/sla.types";

interface SlaEscalateModalProps {
  request: SlaOverdueRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SlaEscalateModal({
  request,
  isOpen,
  onClose,
  onSuccess,
}: SlaEscalateModalProps) {
  const { mutateAsync: escalateMutate, isPending } = useEscalateSlaRequest();

  if (!isOpen || !request) return null;

  const handleEscalate = async () => {
    try {
      await escalateMutate(request.id);
      onSuccess?.();
      onClose();
    } catch {
      // Handled by hook gooeyToast
    }
  };

  const dueFormatted = request.slaDueAt
    ? new Date(request.slaDueAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-destructive/30 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="escalate-modal-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-rose-500 to-purple-600" />

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="escalate-modal-title"
                  className="font-bold text-base text-foreground"
                >
                  Escalate Incident to Supervisor
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manual supervisory SLA override
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Incident Preview Card */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground">
                {request.requestNumber}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              >
                {request.status}
              </Badge>
            </div>

            <p className="text-xs font-medium text-foreground line-clamp-2">
              {request.title}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
              <span>Division: {request.department?.name || "Unassigned"}</span>
              <span className="text-destructive font-mono">
                Due: {dueFormatted}
              </span>
            </div>
          </div>

          {/* Warning Advisory */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Supervisory Escalation Impact:</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90 pl-5">
              This action will mark the ticket as <strong>ESCALATED</strong>,
              dispatch high-priority notifications to the citizen and assigned
              staff, and create an immutable entry in the municipal SLA audit
              ledger.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleEscalate}
              disabled={isPending}
              className="gap-1.5 font-semibold"
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>{isPending ? "Escalating..." : "Confirm Escalation"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
