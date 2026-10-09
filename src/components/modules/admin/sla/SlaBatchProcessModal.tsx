"use client";

import { ShieldAlert, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProcessSlaBreaches } from "@/hooks/sla.hooks";

interface SlaBatchProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SlaBatchProcessModal({
  isOpen,
  onClose,
  onSuccess,
}: SlaBatchProcessModalProps) {
  const [limit, setLimit] = useState<number>(100);
  const { mutateAsync: processMutate, isPending } = useProcessSlaBreaches();

  if (!isOpen) return null;

  const handleRun = async () => {
    try {
      await processMutate(limit);
      onSuccess?.();
      onClose();
    } catch {
    }
  };

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
        className="relative w-full max-w-md rounded-2xl border border-primary/30 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="batch-modal-title"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-indigo-500 to-sky-400" />

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="batch-modal-title"
                  className="font-bold text-base text-foreground"
                >
                  Run SLA Breach Batch Engine
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automated background breach evaluator
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

          <p className="text-xs text-muted-foreground leading-relaxed">
            The batch engine queries all non-terminal tickets across departments
            whose SLA deadline has passed and records formal breach audit
            stamps.
          </p>

          <div className="space-y-1.5">
            <label
              htmlFor="batch-size"
              className="text-xs font-semibold text-foreground"
            >
              Maximum Candidate Batch Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLimit(val)}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                    limit === val
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                      : "border-border/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {val} Tickets
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              <span>Audit Compliance Guarantee:</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-5">
              Updates <code>slaBreachedAt</code> timestamps and broadcasts
              breach alerts to assigned department specialists and citizens.
            </p>
          </div>

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
              size="sm"
              onClick={handleRun}
              disabled={isPending}
              className="gap-1.5 font-semibold"
            >
              <Zap
                className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
              />
              <span>
                {isPending ? "Evaluating Queues..." : "Run Batch Scan Now"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
