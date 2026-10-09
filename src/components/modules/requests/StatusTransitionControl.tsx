"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  HardHat,
  HelpCircle,
  Lock,
  ShieldAlert,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  STATE_MACHINE_TRANSITIONS,
  STATUS_METADATA,
} from "@/constants/transition.constants";
import { useCurrentUser } from "@/hooks/auth.hooks";
import type { RequestStatus, ServiceRequest } from "@/types/request.types";
import { AssignStaffModal } from "./AssignStaffModal";
import { ResolveTicketModal } from "./ResolveTicketModal";
import { StatusTransitionModal } from "./StatusTransitionModal";

interface StatusTransitionControlProps {
  ticket: ServiceRequest;
  mode?: "panel" | "dropdown" | "both";
  className?: string;
  onTransitionSuccess?: (updatedTicket?: ServiceRequest) => void;
}

export function StatusTransitionControl({
  ticket,
  mode = "panel",
  className = "",
  onTransitionSuccess,
}: StatusTransitionControlProps) {
  const { role, user } = useCurrentUser();
  const [targetStatus, setTargetStatus] = useState<RequestStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Allowed transitions according to backend state machine
  const allowedTransitions = STATE_MACHINE_TRANSITIONS[ticket.status] || [];

  // Resolving a grievance is an executive decision restricted strictly to municipal administrators
  const canResolve = role === "ADMIN" && ticket.status === "IN_PROGRESS";
  const hasAssignee = Boolean(ticket.assignedToId || ticket.assignedTo?.id);
  const isAdmin = role === "ADMIN";

  // Department authorization check
  const isAuthorizedStaff =
    role === "ADMIN" ||
    (role === "STAFF" &&
      (!ticket.departmentId ||
        !user?.departmentId ||
        ticket.departmentId === user.departmentId));

  const openTransition = (status: RequestStatus) => {
    if (status === "RESOLVED") {
      setIsResolveModalOpen(true);
      setIsDropdownOpen(false);
      return;
    }
    setTargetStatus(status);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

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

  const renderDropdown = () => {
    const hasNextSteps = allowedTransitions.length > 0 || canResolve;

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextSteps || !isAuthorizedStaff}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/10 shadow-xs text-xs font-semibold h-8 px-3.5"
          title={
            !isAuthorizedStaff
              ? "Staff from another department cannot transition this ticket"
              : hasNextSteps
                ? "Advance or update lifecycle status"
                : "Terminal state or citizen confirmation pending"
          }
        >
          <HardHat className="size-3.5" />
          <span>Transition Status</span>
          <ChevronDown
            className={`size-3 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-xl border border-border bg-card p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[min(520px,85vh)] overflow-y-auto">
            <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground block">
                Allowed Next States
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-foreground font-medium">
                <span className="text-muted-foreground text-[11px]">
                  Current:
                </span>
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {allowedTransitions.map((nextStatus) => {
                const meta = STATUS_METADATA[nextStatus];
                const isRejection = nextStatus === "REJECTED";
                const isBlockedByAssignee =
                  meta.requiresAssignee && !hasAssignee;

                return (
                  <button
                    key={nextStatus}
                    type="button"
                    onClick={() => openTransition(nextStatus)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors hover:bg-muted/70 group ${
                      isRejection
                        ? "hover:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : "text-foreground"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary">
                      {getStatusIcon(nextStatus)}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold truncate">
                          {meta.actionTitle}
                        </span>
                        {isBlockedByAssignee && (
                          <span className="text-[9px] font-mono bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded shrink-0">
                            No Assignee
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">
                        {meta.shortDescription}
                      </span>
                    </div>
                  </button>
                );
              })}

              {canResolve && (
                <button
                  type="button"
                  onClick={() => openTransition("RESOLVED")}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-t border-border/50 mt-0.5 pt-2"
                >
                  <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold">Mark as Resolved</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      Complete field repairs & submit summary
                    </span>
                  </div>
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-t border-border/50 mt-0.5 pt-2 cursor-pointer"
                >
                  <div className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                    <UserCheck className="size-3.5" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold">
                      {hasAssignee
                        ? "Reassign Technician"
                        : "Assign Technician"}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {hasAssignee
                        ? `Current: ${ticket.assignedTo?.name || "Assigned"}`
                        : "Dispatch field officer for repairs"}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPanel = () => {
    const isTerminal =
      ticket.status === "CLOSED" || ticket.status === "REJECTED";
    const isResolvedPendingCitizen = ticket.status === "RESOLVED";

    return (
      <div
        className={`rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <HardHat className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Municipal Field Operations Deck
                </h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
                  {role === "ADMIN" ? "Admin Authority" : "Field Staff"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deterministic state machine transition controls for ticket{" "}
                <span className="font-mono font-medium text-foreground">
                  {ticket.requestNumber}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium text-[11px]">
              Current State:
            </span>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        {isTerminal ? (
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 flex items-center gap-3 text-xs text-muted-foreground">
            <Lock className="size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">
                Lifecycle State Finalized
              </p>
              <p className="text-[11px] mt-0.5">
                This grievance is currently marked as{" "}
                <span className="font-mono font-bold">{ticket.status}</span>.
                Terminal states cannot undergo further operational transitions
                unless reopened by the citizen under the 7-day guarantee.
              </p>
            </div>
          </div>
        ) : isResolvedPendingCitizen ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <Clock className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">Pending Citizen Verification</p>
              <p className="text-[11px] mt-0.5 text-emerald-700 dark:text-emerald-400/90 leading-relaxed">
                Field technicians have resolved this case. The citizen now holds
                the verification window to verify repairs or exercise their
                7-day defect reopen guarantee.
              </p>
            </div>
          </div>
        ) : allowedTransitions.length > 0 || canResolve ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                Available Lifecycle Transitions:
              </span>
              {!hasAssignee &&
                (isAdmin ? (
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    title="Assign a field technician to enable active work"
                  >
                    <AlertTriangle className="size-3" />
                    <span>No technician assigned yet — Assign</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    <span>
                      No technician assigned (Pending Admin assignment)
                    </span>
                  </span>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allowedTransitions.map((nextStatus) => {
                const meta = STATUS_METADATA[nextStatus];
                const isRejection = nextStatus === "REJECTED";
                const isMissingAssignee = meta.requiresAssignee && !hasAssignee;

                return (
                  <button
                    key={nextStatus}
                    type="button"
                    onClick={() => openTransition(nextStatus)}
                    className={`group relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-150 hover:shadow-md cursor-pointer ${
                      isRejection
                        ? "border-rose-500/30 bg-card hover:bg-rose-500/5 hover:border-rose-500/50"
                        : meta.variant === "warning"
                          ? "border-amber-500/30 bg-card hover:bg-amber-500/5 hover:border-amber-500/50"
                          : meta.variant === "info"
                            ? "border-sky-500/30 bg-card hover:bg-sky-500/5 hover:border-sky-500/50"
                            : "border-border bg-card hover:bg-muted/30 hover:border-primary/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div
                          className={`flex size-7 items-center justify-center rounded-lg ${
                            isRejection
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              : meta.variant === "warning"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                          }`}
                        >
                          {getStatusIcon(nextStatus)}
                        </div>
                        <StatusBadge status={nextStatus} />
                      </div>

                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {meta.actionTitle}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {meta.shortDescription}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[10px]">
                      {isMissingAssignee ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="size-2.5" />
                          Assignee Needed
                        </span>
                      ) : meta.requiresReason ? (
                        <span className="text-muted-foreground font-mono">
                          Reason Mandatory
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono">
                          Ready to Apply
                        </span>
                      )}

                      <span className="font-semibold text-primary inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Advance</span>
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </button>
                );
              })}

              {canResolve && (
                <button
                  type="button"
                  onClick={() => openTransition("RESOLVED")}
                  className="group relative flex flex-col justify-between p-3.5 rounded-xl border border-emerald-500/40 bg-card hover:bg-emerald-500/5 hover:border-emerald-500/60 transition-all duration-150 hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <StatusBadge status="RESOLVED" />
                    </div>

                    <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Mark Grievance as Resolved
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      Field work is finished. Submit formal technician
                      resolution summary to citizen.
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      Summary Required
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Resolve</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            No further state machine transitions available for this request.
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mode === "dropdown" && renderDropdown()}
      {mode === "panel" && renderPanel()}
      {mode === "both" && (
        <>
          {renderDropdown()}
          {renderPanel()}
        </>
      )}

      <StatusTransitionModal
        ticket={ticket}
        targetStatus={targetStatus}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTargetStatus(null);
        }}
        onSuccess={(updated) => {
          onTransitionSuccess?.(updated);
        }}
      />

      <ResolveTicketModal
        ticket={ticket}
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onSuccess={(updated) => {
          onTransitionSuccess?.(updated);
        }}
      />

      <AssignStaffModal
        ticket={ticket}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={(updated) => {
          onTransitionSuccess?.(updated);
        }}
      />
    </>
  );
}
