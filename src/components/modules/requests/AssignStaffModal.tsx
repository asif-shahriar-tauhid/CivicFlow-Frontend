"use client";

import {
  AlertCircle,
  Building2,
  Check,
  HardHat,
  Search,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/auth.hooks";
import {
  useAssignServiceRequest,
  useReassignServiceRequest,
} from "@/hooks/request.hooks";
import { useGetAllUsers } from "@/hooks/user.hooks";
import type { ServiceRequest } from "@/types/request.types";

interface AssignStaffModalProps {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedTicket?: ServiceRequest) => void;
  /**
   * Optional list of known staff candidates passed from queue pages
   */
  candidateStaffList?: Array<{
    id: string;
    name: string;
    email: string;
    departmentId?: string | null;
  }>;
}

export function AssignStaffModal({
  ticket,
  isOpen,
  onClose,
  onSuccess,
  candidateStaffList = [],
}: AssignStaffModalProps) {
  const { user: currentUser } = useCurrentUser();
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [manualIdInput, setManualIdInput] = useState<string>("");
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isReassignment = Boolean(
    ticket?.assignedToId || ticket?.assignedTo?.id,
  );

  // Queries
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetAllUsers({
    role: "STAFF",
    departmentId: ticket?.departmentId || undefined,
    limit: 100,
  });

  // Mutations
  const { mutate: assignRequest, isPending: isAssigning } =
    useAssignServiceRequest();
  const { mutate: reassignRequest, isPending: isReassigning } =
    useReassignServiceRequest();

  const isPending = isAssigning || isReassigning;

  // Initialize or reset selections
  useEffect(() => {
    if (isOpen && ticket) {
      setErrorMsg("");
      setSearchTerm("");
      setManualIdInput("");
      setShowManualInput(false);
      // Pre-select current assignee if reassignment
      if (ticket.assignedToId || ticket.assignedTo?.id) {
        setSelectedStaffId(ticket.assignedToId || ticket.assignedTo?.id || "");
      } else if (currentUser?.role === "STAFF") {
        // Pre-select current staff user for quick dispatch
        setSelectedStaffId(currentUser.id);
      } else {
        setSelectedStaffId("");
      }
    }
  }, [isOpen, ticket, currentUser]);

  // Consolidate staff candidates from:
  // 1. API users response (admin / authorized)
  // 2. Candidate list passed via props
  // 3. Current assignee of ticket
  // 4. Current user (if staff)
  const staffCandidates = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        departmentId?: string | null;
        role?: string;
      }
    >();

    // 1. From API
    if (usersResponse?.data && Array.isArray(usersResponse.data)) {
      for (const u of usersResponse.data) {
        if (u.role === "STAFF" || u.role === "ADMIN") {
          map.set(u.id, {
            id: u.id,
            name: u.name,
            email: u.email,
            departmentId: u.departmentId,
            role: u.role,
          });
        }
      }
    }

    // 2. From candidate props
    for (const c of candidateStaffList) {
      if (c && c.id && !map.has(c.id)) {
        map.set(c.id, {
          id: c.id,
          name: c.name,
          email: c.email,
          departmentId: c.departmentId,
        });
      }
    }

    // 3. From ticket assignedTo
    if (ticket?.assignedTo && !map.has(ticket.assignedTo.id)) {
      map.set(ticket.assignedTo.id, {
        id: ticket.assignedTo.id,
        name: ticket.assignedTo.name,
        email: ticket.assignedTo.email,
        departmentId: ticket.departmentId,
      });
    }

    // 4. From current logged-in user if staff
    if (
      currentUser &&
      currentUser.role === "STAFF" &&
      !map.has(currentUser.id)
    ) {
      map.set(currentUser.id, {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        departmentId: currentUser.departmentId,
        role: currentUser.role,
      });
    }

    return Array.from(map.values());
  }, [usersResponse, candidateStaffList, ticket, currentUser]);

  // Filter candidates by search term
  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return staffCandidates;
    const query = searchTerm.toLowerCase().trim();
    return staffCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query),
    );
  }, [staffCandidates, searchTerm]);

  if (!isOpen || !ticket) return null;

  const currentAssigneeName = ticket.assignedTo?.name;
  const currentAssigneeId = ticket.assignedToId || ticket.assignedTo?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const targetId = showManualInput
      ? manualIdInput.trim()
      : selectedStaffId.trim();

    if (!targetId) {
      setErrorMsg("Please select a municipal field officer to assign.");
      return;
    }

    if (isReassignment && targetId === currentAssigneeId) {
      setErrorMsg(
        "The selected officer is already assigned to this grievance.",
      );
      return;
    }

    const selectedCandidate = staffCandidates.find((c) => c.id === targetId);
    const targetName =
      selectedCandidate?.name ||
      (targetId === currentUser?.id ? currentUser.name : targetId);

    if (isReassignment) {
      reassignRequest(
        { requestId: ticket.id, assignedToId: targetId },
        {
          onSuccess: (res) => {
            gooeyToast.success("Staff Reassigned", {
              description: `Ticket ${ticket.requestNumber} reassigned to ${targetName}.`,
            });
            onSuccess?.(res.data);
            onClose();
          },
          onError: (err: any) => {
            const msg =
              err?.data?.message ||
              err?.message ||
              "Failed to reassign service request.";
            setErrorMsg(msg);
            gooeyToast.error("Reassignment Failed", { description: msg });
          },
        },
      );
    } else {
      assignRequest(
        { requestId: ticket.id, assignedToId: targetId },
        {
          onSuccess: (res) => {
            gooeyToast.success("Staff Assigned", {
              description: `Ticket ${ticket.requestNumber} assigned to ${targetName}.`,
            });
            onSuccess?.(res.data);
            onClose();
          },
          onError: (err: any) => {
            const msg =
              err?.data?.message ||
              err?.message ||
              "Failed to assign service request.";
            setErrorMsg(msg);
            gooeyToast.error("Assignment Failed", { description: msg });
          },
        },
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-staff-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto">
        {/* Accent Top Border */}
        <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-sky-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0">
              <UserCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="assign-staff-title"
                  className="text-base font-bold text-foreground"
                >
                  {isReassignment
                    ? "Reassign Field Technician"
                    : "Assign Field Technician"}
                </h2>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                  {isReassignment ? "Ownership Transfer" : "Dispatch"}
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
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Ticket Context Pill Row */}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[11px]">Ticket:</span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Building2 className="size-3.5 text-primary" />
              <span className="font-medium text-foreground">
                {ticket.department?.name || "General Department"}
              </span>
            </div>
          </div>

          {/* Current Assignee Status Callout */}
          {isReassignment ? (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-300">
              <UserCheck className="size-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Currently Assigned:{" "}
                  <span className="underline underline-offset-2">
                    {currentAssigneeName || "Designated Officer"}
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-blue-800 dark:text-blue-300/90 leading-relaxed">
                  Selecting a new officer will reassign the task order and
                  notify the replacement technician for field mobilization.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
              <HardHat className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">Currently Unassigned</p>
                <p className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  Assigning a designated technician unlocks the ability to move
                  this ticket into <strong>IN_PROGRESS</strong> status and
                  perform repairs.
                </p>
              </div>
            </div>
          )}

          {/* Quick 1-Click "Assign to Myself" for Staff */}
          {currentUser &&
            (currentUser.role === "STAFF" || currentUser.role === "ADMIN") && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/15 text-primary font-medium">
                        You
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                {selectedStaffId === currentUser.id && !showManualInput ? (
                  <span className="text-[11px] font-semibold text-primary flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full">
                    <Check className="size-3" /> Selected
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setSelectedStaffId(currentUser.id);
                      setShowManualInput(false);
                      setErrorMsg("");
                    }}
                    className="rounded-full text-xs gap-1"
                  >
                    <UserPlus className="size-3" />
                    <span>Assign to Myself</span>
                  </Button>
                )}
              </div>
            )}

          {/* Candidate Selection Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="staff-search-input"
                className="font-semibold text-foreground flex items-center gap-1.5"
              >
                <Users className="size-3.5 text-primary" />
                <span>Select Department Officer</span>
                <span className="text-destructive font-bold">*</span>
              </label>

              <button
                type="button"
                onClick={() => setShowManualInput((prev) => !prev)}
                className="text-[11px] text-primary hover:underline font-mono"
              >
                {showManualInput ? "Choose from list" : "Enter UUID manually"}
              </button>
            </div>

            {showManualInput ? (
              <div>
                <Input
                  id="manual-staff-id-input"
                  placeholder="Paste User ID (UUID) e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={manualIdInput}
                  onChange={(e) => {
                    setManualIdInput(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="text-xs font-mono"
                  required
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Target field technician's unique user identifier.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Search Filter Box */}
                {staffCandidates.length > 3 && (
                  <div className="relative">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="staff-search-input"
                      placeholder="Search officer by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 text-xs h-8"
                    />
                  </div>
                )}

                {/* Candidate Selection List */}
                <div className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border/60 bg-muted/10">
                  {isLoadingUsers && staffCandidates.length === 0 ? (
                    <div className="p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
                      <Spinner className="size-4" />
                      <span>Loading municipal roster...</span>
                    </div>
                  ) : filteredCandidates.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      {searchTerm
                        ? "No officers match the search query."
                        : "No departmental staff found in roster."}
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => setShowManualInput(true)}
                          className="rounded-full text-xs"
                        >
                          Enter Staff UUID Manually
                        </Button>
                      </div>
                    </div>
                  ) : (
                    filteredCandidates.map((candidate) => {
                      const isSelected = selectedStaffId === candidate.id;
                      const isCurrent = candidate.id === currentAssigneeId;
                      const isSelf = candidate.id === currentUser?.id;

                      return (
                        <button
                          key={candidate.id}
                          type="button"
                          onClick={() => {
                            setSelectedStaffId(candidate.id);
                            if (errorMsg) setErrorMsg("");
                          }}
                          className={`w-full p-2.5 text-left text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted/40 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`flex size-7 items-center justify-center rounded-lg font-bold text-xs shrink-0 ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {candidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex flex-col">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-semibold text-foreground truncate">
                                  {candidate.name}
                                </span>
                                {isSelf && (
                                  <span className="text-[9px] font-mono px-1 rounded bg-primary/15 text-primary">
                                    You
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="text-[9px] font-mono px-1 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground truncate font-mono">
                                {candidate.email}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {candidate.role && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border border-border text-muted-foreground">
                                {candidate.role}
                              </span>
                            )}
                            <div
                              className={`size-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {isSelected && (
                                <Check className="size-2.5 stroke-[3]" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 flex items-start gap-2 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Actions */}
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
                (showManualInput ? !manualIdInput.trim() : !selectedStaffId) ||
                (isReassignment &&
                  (showManualInput
                    ? manualIdInput.trim() === currentAssigneeId
                    : selectedStaffId === currentAssigneeId))
              }
              className="rounded-4xl text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>
                    {isReassignment ? "Reassigning..." : "Assigning..."}
                  </span>
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5" />
                  <span>
                    {isReassignment
                      ? "Confirm Reassignment"
                      : "Confirm Assignment"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
