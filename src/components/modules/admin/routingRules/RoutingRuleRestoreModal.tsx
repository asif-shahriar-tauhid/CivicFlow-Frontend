"use client";

import { CheckCircle2, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUnarchiveRoutingRule } from "@/hooks/routingRule.hooks";
import type { CategoryRoutingRule } from "@/types/routingRule.types";

interface RoutingRuleRestoreModalProps {
  rule: CategoryRoutingRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RoutingRuleRestoreModal({
  rule,
  isOpen,
  onClose,
  onSuccess,
}: RoutingRuleRestoreModalProps) {
  const { mutateAsync: unarchiveRuleMutate, isPending } =
    useUnarchiveRoutingRule();

  if (!isOpen || !rule) return null;

  const handleRestore = async () => {
    try {
      await unarchiveRuleMutate(rule.id);
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
        className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="restore-rule-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <RotateCcw className="h-6 w-6" />
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
              id="restore-rule-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Reactivate Routing Rule?
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Restore the automated dispatch pipeline for{" "}
              <span className="font-semibold text-foreground">
                "{rule.category?.name}"
              </span>{" "}
              dispatched to{" "}
              <span className="font-semibold text-foreground">
                "{rule.department?.name}"
              </span>
              .
            </p>
          </div>

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
              onClick={handleRestore}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Reactivating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Reactivate Rule</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
