"use client";

import { AlertTriangle, Archive, Building2, GitBranch, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useArchiveDepartment } from "@/hooks/department.hooks";
import type { Department } from "@/types/department.types";

interface DepartmentArchiveModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DepartmentArchiveModal({
  department,
  isOpen,
  onClose,
  onSuccess,
}: DepartmentArchiveModalProps) {
  const { mutateAsync: archiveDeptMutate, isPending } = useArchiveDepartment();

  if (!isOpen || !department) return null;

  const handleArchive = async () => {
    try {
      await archiveDeptMutate(department.id);
      onSuccess?.();
      onClose();
    } catch {
      // Handled by hook toast
    }
  };

  const routingRuleCount = department._count?.routingRules ?? 0;
  const ticketCount = department._count?.serviceRequests ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-destructive/30 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="archive-dept-title"
      >
        {/* Warning Accent */}
        <div className="h-1.5 w-full bg-linear-to-r from-destructive via-red-500 to-amber-500" />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
              <Archive className="h-6 w-6" />
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

          <div className="mt-4">
            <h2
              id="archive-dept-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Archive Municipal Department?
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              You are about to archive{" "}
              <span className="font-semibold text-foreground">
                "{department.name}"
              </span>
              . This will immediately decommission its active dispatch queue.
            </p>
          </div>

          {/* Department Highlight Card */}
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-semibold text-foreground">
                {department.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Linked Routing Rules:
              </span>
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600 text-[10px]"
              >
                {routingRuleCount} active rule
                {routingRuleCount === 1 ? "" : "s"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Existing Grievances:
              </span>
              <span className="font-mono font-medium text-foreground">
                {ticketCount} tickets
              </span>
            </div>
          </div>

          {/* Caution callout */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground leading-relaxed">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p>
              <strong className="text-destructive font-semibold">
                Important Impact:
              </strong>{" "}
              All {routingRuleCount} automated routing rules mapped to this
              department will be deactivated. Subsequent citizen reports in
              those categories will divert to manual admin triage until
              re-routed.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleArchive}
              disabled={isPending}
              className="gap-2 min-w-[150px]"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Archiving...</span>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  <span>Archive Division</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
