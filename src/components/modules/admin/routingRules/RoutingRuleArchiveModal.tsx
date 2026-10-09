"use client";

import { AlertTriangle, Archive, Globe, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useArchiveRoutingRule } from "@/hooks/routingRule.hooks";
import type { CategoryRoutingRule } from "@/types/routingRule.types";

interface RoutingRuleArchiveModalProps {
  rule: CategoryRoutingRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RoutingRuleArchiveModal({
  rule,
  isOpen,
  onClose,
  onSuccess,
}: RoutingRuleArchiveModalProps) {
  const { mutateAsync: archiveRuleMutate, isPending } = useArchiveRoutingRule();

  if (!isOpen || !rule) return null;

  const handleArchive = async () => {
    try {
      await archiveRuleMutate(rule.id);
      onSuccess?.();
      onClose();
    } catch {
      // Handled by hook toast
    }
  };

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
        aria-labelledby="archive-rule-title"
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
              id="archive-rule-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Deactivate Routing Rule?
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Decommissioning this automated dispatch rule will immediately halt
              automated triage routing for this pathway.
            </p>
          </div>

          {/* Rule Detail Card */}
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-semibold text-foreground line-clamp-1">
                {rule.category?.name || "Category"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Target Dept:</span>
              <span className="font-semibold text-foreground line-clamp-1">
                {rule.department?.name || "Department"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jurisdiction Scope:</span>
              <Badge
                variant="outline"
                className="text-[10px] inline-flex items-center gap-1"
              >
                {rule.location ? (
                  <>
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{rule.location}</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                    <span>Citywide Fallback</span>
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Priority Weight:</span>
              <span className="font-mono font-bold text-foreground">
                Score: {rule.priority}
              </span>
            </div>
          </div>

          {/* Impact Warning */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground leading-relaxed">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p>
              Subsequent reports matching this category and ward will fall back
              to lower-priority rules or divert to the Admin Triage Desk for
              manual dispatch.
            </p>
          </div>

          {/* Actions */}
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
              className="gap-2 min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Archiving...</span>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  <span>Deactivate Rule</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
