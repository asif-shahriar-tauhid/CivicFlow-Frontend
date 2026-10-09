"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HardHat,
  HelpCircle,
  Lock,
  ShieldAlert,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  STATE_MACHINE_TRANSITIONS,
  STATUS_METADATA,
  type StatusMeta,
} from "@/constants/transition.constants";
import { useCurrentUser } from "@/hooks/auth.hooks";
import {
  useResolveServiceRequest,
  useTransitionServiceRequest,
} from "@/hooks/request.hooks";
import type { RequestStatus, ServiceRequest } from "@/types/request.types";

interface StatusTransitionModalProps {
  ticket: ServiceRequest | null;
  targetStatus?: RequestStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedTicket?: ServiceRequest) => void;
}

export function StatusTransitionModal({
  ticket,
  targetStatus: initialTargetStatus,
  isOpen,
  onClose,
  onSuccess,
}: StatusTransitionModalProps) {
  const { role } = useCurrentUser();
  const [activeTarget, setActiveTarget] = useState<RequestStatus | null>(
    initialTargetStatus || null,
  );
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: transitionRequest, isPending: isTransitioning } =
    useTransitionServiceRequest();

  const { mutate: resolveRequest, isPending: isResolving } =
    useResolveServiceRequest();

  const isPending = isTransitioning || isResolving;

  const availableOptions = useMemo(() => {
    if (!ticket) return [];
    const transitions = [...(STATE_MACHINE_TRANSITIONS[ticket.status] || [])];
    // Resolving a grievance is an executive decision restricted strictly to ADMIN
    if (
      role === "ADMIN" &&
      ticket.status === "IN_PROGRESS" &&
      !transitions.includes("RESOLVED")
    ) {
      transitions.push("RESOLVED");
    }
    return transitions;
  }, [ticket, role]);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setErrorMsg("");
      if (initialTargetStatus) {
        setActiveTarget(initialTargetStatus);
      } else if (availableOptions.length > 0) {
        setActiveTarget(availableOptions[0]);
      } else {
        setActiveTarget(null);
      }
    }
  }, [isOpen, initialTargetStatus, availableOptions]);

  if (!isOpen || !ticket) return null;

  const targetMeta: StatusMeta | null = activeTarget
    ? STATUS_METADATA[activeTarget] || {
        status: activeTarget,
        label: activeTarget,
        actionTitle: activeTarget,
        shortDescription: "",
        fullDescription: "",
        requiresReason: false,
        requiresAssignee: false,
        colorClass: "text-foreground",
        borderClass: "border-border",
        bgClass: "bg-muted",
        dotClass: "bg-muted",
        variant: "default",
      }
    : null;

  const hasAssignee = Boolean(ticket.assignedToId || ticket.assignedTo?.id);
  const isMissingRequiredAssignee = Boolean(
    targetMeta?.requiresAssignee && !hasAssignee,
  );
  const isRejection = activeTarget === "REJECTED";
  const isResolution = activeTarget === "RESOLVED";
  const isReasonMandatory = isRejection || isResolution;

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "TRIAGED":
        return <CheckCircle2 className="size-3.5" />;
      case "ASSIGNED":
        return <UserCheck className="size-3.5" />;
      case "IN_PROGRESS":
        return <Wrench className="size-3.5" />;
      case "AWAITING_CITIZEN":
        return <HelpCircle className="size-3.5" />;
      case "ON_HOLD":
        return <Clock className="size-3.5" />;
      case "RESOLVED":
        return <CheckCircle2 className="size-3.5" />;
      case "REJECTED":
        return <ShieldAlert className="size-3.5" />;
      default:
        return <ArrowRight className="size-3.5" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!activeTarget || !targetMeta) {
      setErrorMsg("Please select a target status to proceed.");
      return;
    }

    if (isMissingRequiredAssignee) {
      setErrorMsg(
        `Advancing to ${targetMeta.label} requires an assigned technician. Please assign this ticket before transitioning.`,
      );
      return;
    }

    if (isReasonMandatory && (!reason.trim() || reason.trim().length < 5)) {
      setErrorMsg(
        isRejection
          ? "A justification of at least 5 characters is mandatory to reject a grievance."
          : "A resolution summary of at least 5 characters is mandatory to mark work as resolved.",
      );
      return;
    }

    if (isResolution) {
      if (role !== "ADMIN") {
        setErrorMsg(
          "Only municipal administrators possess executive authority to mark grievances as resolved.",
        );
        return;
      }

      resolveRequest(
        { requestId: ticket.id, reason: reason.trim() },
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
              "Failed to resolve request.";
            setErrorMsg(msg);
            gooeyToast.error("Resolution Failed", { description: msg });
          },
        },
      );
      return;
    }

    transitionRequest(
      {
        requestId: ticket.id,
        payload: {
          status: activeTarget,
          reason: reason.trim() ? reason.trim() : undefined,
        },
      },
      {
        onSuccess: (res) => {
          gooeyToast.success("Status Updated", {
            description: `Ticket ${ticket.requestNumber} transitioned to ${targetMeta.label}.`,
          });
          onSuccess?.(res.data);
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.data?.message ||
            err?.message ||
            "Failed to transition ticket status.";
          setErrorMsg(msg);
          gooeyToast.error("Transition Failed", { description: msg });
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transition-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto">
        <div
          className={`h-1.5 w-full ${
            isRejection
              ? "bg-linear-to-r from-rose-500 via-red-600 to-rose-700"
              : isResolution
                ? "bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600"
                : activeTarget === "ON_HOLD"
                  ? "bg-linear-to-r from-amber-500 via-orange-500 to-amber-600"
                  : "bg-linear-to-r from-primary via-indigo-500 to-sky-500"
          }`}
        />

        <div className="p-6 pb-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl shrink-0 ${
                isRejection
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : isResolution
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : activeTarget === "ON_HOLD"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-primary/15 text-primary"
              }`}
            >
              {isRejection ? (
                <ShieldAlert className="size-5" />
              ) : isResolution ? (
                <CheckCircle2 className="size-5" />
              ) : activeTarget === "ON_HOLD" ? (
                <Clock className="size-5" />
              ) : activeTarget === "ASSIGNED" ? (
                <UserCheck className="size-5" />
              ) : (
                <HardHat className="size-5" />
              )}
            </div>
            <div>
              <h2
                id="transition-modal-title"
                className="text-base font-bold text-foreground"
              >
                Transition Lifecycle Status
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
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

        {availableOptions.length === 0 ? (
          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 flex items-center gap-3 text-xs text-muted-foreground">
              <Lock className="size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">
                  No Available Transitions
                </p>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  Ticket is currently in{" "}
                  <span className="font-mono font-bold text-foreground">
                    {ticket.status}
                  </span>
                  . This stage cannot be transitioned through standard field
                  dispatch (it is either terminal or awaits citizen
                  verification).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-4xl text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-foreground block mb-2">
                Choose Target Lifecycle State:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableOptions.map((optStatus) => {
                  const optMeta = STATUS_METADATA[optStatus];
                  const isSelected = activeTarget === optStatus;
                  const isOptRejection = optStatus === "REJECTED";
                  const isOptResolution = optStatus === "RESOLVED";

                  return (
                    <button
                      key={optStatus}
                      type="button"
                      onClick={() => {
                        setActiveTarget(optStatus);
                        setErrorMsg("");
                      }}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? isOptRejection
                            ? "border-rose-500 bg-rose-500/10 shadow-xs ring-1 ring-rose-500"
                            : isOptResolution
                              ? "border-emerald-500 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-500"
                              : "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                          : "border-border bg-card/60 hover:bg-muted/50 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div
                            className={`size-6 rounded-md flex items-center justify-center shrink-0 ${
                              isSelected
                                ? isOptRejection
                                  ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                                  : isOptResolution
                                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getStatusIcon(optStatus)}
                          </div>
                          <StatusBadge
                            status={optStatus}
                            className="shrink-0"
                          />
                        </div>

                        {optMeta?.requiresAssignee && !hasAssignee && (
                          <span className="text-[9px] font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded shrink-0">
                            No Assignee
                          </span>
                        )}
                      </div>

                      <div
                        className={`text-xs font-bold line-clamp-1 ${
                          isSelected ? "text-foreground" : "text-foreground/90"
                        }`}
                      >
                        {optMeta?.actionTitle || optStatus}
                      </div>

                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {optMeta?.shortDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Current
                </span>
                <StatusBadge status={ticket.status} />
              </div>

              <div className="flex size-6 items-center justify-center rounded-full bg-border text-muted-foreground">
                <ArrowRight className="size-3" />
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Target State
                </span>
                {activeTarget ? (
                  <StatusBadge status={activeTarget} />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>

            {targetMeta && (
              <div className="rounded-xl border border-border/70 bg-card p-3 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground block mb-0.5">
                  Protocol: {targetMeta.label}
                </span>
                {targetMeta.fullDescription}
              </div>
            )}

            {isMissingRequiredAssignee && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    Assignee Required Before Dispatch
                  </p>
                  <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
                    Municipal protocol requires a designated technician before
                    transitioning to {targetMeta?.label}. Please assign a staff
                    officer to this ticket before confirming.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="transition-reason-textarea"
                  className="font-medium text-foreground flex items-center gap-1.5"
                >
                  <span>
                    {isRejection
                      ? "Mandatory Rejection Justification"
                      : isResolution
                        ? "Field Resolution Statement"
                        : "Audit Trail Note"}
                  </span>
                  {isReasonMandatory ? (
                    <span className="text-destructive font-bold">*</span>
                  ) : (
                    <span className="text-muted-foreground font-normal text-[11px]">
                      (Optional)
                    </span>
                  )}
                </label>
                {isReasonMandatory && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Min 5 characters
                  </span>
                )}
              </div>

              <Textarea
                id="transition-reason-textarea"
                rows={3}
                placeholder={
                  isRejection
                    ? "Detail why this ticket cannot be serviced (e.g. out of municipal boundary, duplicate of REQ-..., invalid submission)..."
                    : isResolution
                      ? "Specify the repairs completed on site (e.g. culvert unblocked, 150kg debris removed, water flow restored)..."
                      : "Add optional notes for the department field log or audit history..."
                }
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                required={isReasonMandatory}
                className="resize-none text-xs"
              />
            </div>

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
                  isPending || isMissingRequiredAssignee || !activeTarget
                }
                variant={isRejection ? "destructive" : "default"}
                className={`rounded-4xl text-xs gap-1.5 ${
                  isResolution
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : activeTarget === "ON_HOLD"
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : ""
                }`}
              >
                {isPending ? (
                  <>
                    <Spinner className="size-3.5" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    {isResolution ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : isRejection ? (
                      <ShieldAlert className="size-3.5" />
                    ) : (
                      <ArrowRight className="size-3.5" />
                    )}
                    <span>
                      Confirm{" "}
                      {isRejection
                        ? "Rejection"
                        : isResolution
                          ? "Resolution"
                          : "Transition"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
