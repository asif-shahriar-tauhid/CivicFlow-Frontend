"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HardHat,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useResolveServiceRequest } from "@/hooks/request.hooks";
import type { ServiceRequest } from "@/types/request.types";

interface ResolveTicketModalProps {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedTicket?: ServiceRequest) => void;
}

const RESOLUTION_TEMPLATES = [
  {
    label: "Drainage / Culvert Cleared",
    text: "Culvert mouth unblocked; sediment and plastic debris cleared; water flow tested and normal.",
  },
  {
    label: "Road / Pothole Patched",
    text: "Sub-base excavated and leveled; fresh asphalt aggregate compacted with roller; road open to traffic.",
  },
  {
    label: "Waste / Garbage Transported",
    text: "Waste accumulation cleared by municipal compactors; area disinfected with bleaching powder.",
  },
  {
    label: "Streetlight / Electrical Fixed",
    text: "Damaged fixture replaced; wiring insulated and grounded; evening illumination verified.",
  },
];

export function ResolveTicketModal({
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: ResolveTicketModalProps) {
  const { role } = useCurrentUser();
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [isWorkVerified, setIsWorkVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: resolveRequest, isPending } = useResolveServiceRequest();

  useEffect(() => {
    if (isOpen) {
      setResolutionSummary("");
      setIsWorkVerified(false);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen || !ticket) return null;

  const hasAssignee = Boolean(ticket.assignedToId || ticket.assignedTo?.id);

  // Resolution is an executive decision restricted strictly to municipal administrators
  const isAuthorized = role === "ADMIN";

  const handleApplyTemplate = (text: string) => {
    setResolutionSummary(text);
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!hasAssignee) {
      setErrorMsg(
        "A technician must be assigned to this grievance before field work can be marked as resolved.",
      );
      return;
    }

    const trimmed = resolutionSummary.trim();
    if (!trimmed || trimmed.length < 10) {
      setErrorMsg(
        "A detailed resolution statement of at least 10 characters is legally required for citizen sign-off.",
      );
      return;
    }

    if (!isWorkVerified) {
      setErrorMsg(
        "Please check the verification box confirming on-site field work standards.",
      );
      return;
    }

    resolveRequest(
      { requestId: ticket.id, reason: trimmed },
      {
        onSuccess: (res) => {
          gooeyToast.success("Work Marked as Resolved", {
            description: `Ticket ${ticket.requestNumber} resolution statement recorded. Citizen verification initiated.`,
          });
          onSuccess?.(res.data);
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.data?.message ||
            err?.message ||
            "Failed to resolve service request.";
          setErrorMsg(msg);
          gooeyToast.error("Resolution Failed", { description: msg });
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resolve-ticket-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto">
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        <div className="p-6 pb-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="resolve-ticket-title"
                  className="text-base font-bold text-foreground"
                >
                  Mark Grievance as Resolved
                </h2>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {ticket.requestNumber} • {ticket.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isAuthorized && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 flex items-start gap-3 text-xs text-destructive">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Executive Authority Restricted</p>
                <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                  Resolving service requests is strictly restricted to Municipal
                  Administrators. Field technicians must submit field
                  investigation notes for administrative review.
                </p>
              </div>
            </div>
          )}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[11px]">
                Current:
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <HardHat className="size-3.5 text-primary" />
              <span>
                {ticket.assignedTo ? ticket.assignedTo.name : "No Assignee"}
              </span>
            </div>
          </div>

          {!hasAssignee && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">Technician Assignment Required</p>
                <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
                  Municipal protocol requires a designated field technician
                  before a ticket can be resolved. Please assign a technician
                  first.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold">
                Initiates 7-Day Citizen Verification
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400/90 leading-relaxed">
                Submitting this statement notifies the citizen to inspect the
                site. If satisfied, the citizen confirms closure. If defects
                persist, they hold the unconditional guarantee to reopen the
                case within 7 days.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="resolution-statement-textarea"
                className="font-semibold text-foreground flex items-center gap-1"
              >
                <span>Technician Resolution Statement</span>
                <span className="text-destructive font-bold">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {resolutionSummary.length} / 5000 (Min 10)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mr-1">
                <Sparkles className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                <span>Templates:</span>
              </span>
              {RESOLUTION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl.text)}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>

            <Textarea
              id="resolution-statement-textarea"
              rows={4}
              placeholder="Detail the exact remediation work completed on site (e.g. Cleared 150kg debris from culvert, operated suction pump, replaced broken cover, tested flow, left site clean)..."
              value={resolutionSummary}
              onChange={(e) => {
                setResolutionSummary(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              required
              disabled={isPending || !isAuthorized}
              className="resize-none text-xs leading-relaxed"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border/80 bg-muted/20 text-xs cursor-pointer select-none hover:bg-muted/30 transition-colors">
            <input
              type="checkbox"
              checked={isWorkVerified}
              onChange={(e) => {
                setIsWorkVerified(e.target.checked);
                if (errorMsg) setErrorMsg("");
              }}
              disabled={isPending}
              className="mt-0.5 size-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-foreground/90 leading-relaxed text-[11px]">
              I certify that physical field remediation has been completed in
              accordance with municipal standards, the site has been cleaned,
              and this statement is accurate for public inspection.
            </span>
          </label>

          {errorMsg && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 flex items-start gap-2 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="rounded-4xl text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={
                isPending ||
                !hasAssignee ||
                resolutionSummary.trim().length < 10 ||
                !isWorkVerified ||
                !isAuthorized
              }
              className="rounded-4xl text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Recording Resolution...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Submit Field Resolution</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
