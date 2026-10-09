import type { RequestStatus } from "@/types/request.types";

export interface StatusMeta {
  status: RequestStatus;
  label: string;
  actionTitle: string;
  shortDescription: string;
  fullDescription: string;
  requiresReason: boolean;
  requiresAssignee: boolean;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  dotClass: string;
  variant:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
}

/**
 * Deterministic CivicFlow Municipal State Machine Transition Graph
 * Matches backend `requestStateMachine.service.ts` rules.
 */
export const STATE_MACHINE_TRANSITIONS: Record<RequestStatus, RequestStatus[]> =
  {
    SUBMITTED: ["TRIAGED", "REJECTED"],
    TRIAGED: ["ASSIGNED", "ON_HOLD", "REJECTED"],
    ASSIGNED: ["IN_PROGRESS", "ON_HOLD"],
    IN_PROGRESS: ["AWAITING_CITIZEN", "ON_HOLD"],
    AWAITING_CITIZEN: ["IN_PROGRESS", "ON_HOLD"],
    ON_HOLD: ["TRIAGED", "IN_PROGRESS"],
    REOPENED: ["IN_PROGRESS", "ON_HOLD"],
    RESOLVED: [], // Handled by citizen verification (confirm / reopen)
    CLOSED: [], // Terminal / 7-day citizen reopen window
    REJECTED: [], // Terminal state
  };

export const STATUS_METADATA: Record<RequestStatus, StatusMeta> = {
  SUBMITTED: {
    status: "SUBMITTED",
    label: "Submitted",
    actionTitle: "Return to Intake",
    shortDescription: "Newly submitted grievance in public intake queue.",
    fullDescription:
      "Grievance newly submitted by citizen; awaiting automated or manual department triage.",
    requiresReason: false,
    requiresAssignee: false,
    colorClass: "text-slate-700 dark:text-slate-300",
    borderClass: "border-slate-500/20",
    bgClass: "bg-slate-500/10",
    dotClass: "bg-slate-400",
    variant: "outline",
  },
  TRIAGED: {
    status: "TRIAGED",
    label: "Triaged",
    actionTitle: "Advance to Triaged",
    shortDescription: "Validate classification and approve for field dispatch.",
    fullDescription:
      "The grievance has been verified by the department. Priority, category, and jurisdiction are validated and ready for assignment.",
    requiresReason: false,
    requiresAssignee: false,
    colorClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/10",
    dotClass: "bg-amber-500",
    variant: "warning",
  },
  ASSIGNED: {
    status: "ASSIGNED",
    label: "Assigned",
    actionTitle: "Deploy Field Unit (Assigned)",
    shortDescription: "Designate to field technician or ward maintenance team.",
    fullDescription:
      "Work order assigned to a specific field officer or technical crew for site inspection and repair mobilization.",
    requiresReason: false,
    requiresAssignee: true,
    colorClass: "text-sky-700 dark:text-sky-300",
    borderClass: "border-sky-500/30",
    bgClass: "bg-sky-500/10",
    dotClass: "bg-sky-500",
    variant: "info",
  },
  IN_PROGRESS: {
    status: "IN_PROGRESS",
    label: "In Progress",
    actionTitle: "Commence Field Operation",
    shortDescription: "Field crew is actively executing repairs on site.",
    fullDescription:
      "Technicians have deployed machinery, cleared hazards, or commenced physical infrastructure rectification on site.",
    requiresReason: false,
    requiresAssignee: true,
    colorClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-500/30",
    bgClass: "bg-blue-500/10",
    dotClass: "bg-blue-500 animate-pulse",
    variant: "info",
  },
  AWAITING_CITIZEN: {
    status: "AWAITING_CITIZEN",
    label: "Awaiting Citizen",
    actionTitle: "Request Citizen Action",
    shortDescription: "Paused pending gate access or input from citizen.",
    fullDescription:
      "Crew requires citizen presence, premises gate access, or clarifying photos to proceed with remediation.",
    requiresReason: false,
    requiresAssignee: true,
    colorClass: "text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-500/30",
    bgClass: "bg-purple-500/10",
    dotClass: "bg-purple-500",
    variant: "warning",
  },
  ON_HOLD: {
    status: "ON_HOLD",
    label: "On Hold",
    actionTitle: "Place On Hold",
    shortDescription: "Temporarily pause due to weather, parts, or permits.",
    fullDescription:
      "Work temporarily paused pending heavy machinery procurement, weather safety clearance, or road transit coordination.",
    requiresReason: false,
    requiresAssignee: false,
    colorClass: "text-orange-700 dark:text-orange-300",
    borderClass: "border-orange-500/30",
    bgClass: "bg-orange-500/10",
    dotClass: "bg-orange-500",
    variant: "warning",
  },
  RESOLVED: {
    status: "RESOLVED",
    label: "Resolved",
    actionTitle: "Submit Field Resolution",
    shortDescription: "Remediation complete. Submits resolution to citizen.",
    fullDescription:
      "All physical field work is completed. Technicians submit a resolution statement for citizen inspection and verification.",
    requiresReason: true,
    requiresAssignee: true,
    colorClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/10",
    dotClass: "bg-emerald-500",
    variant: "success",
  },
  CLOSED: {
    status: "CLOSED",
    label: "Verified & Closed",
    actionTitle: "Closed",
    shortDescription: "Citizen satisfied with work; ticket archived.",
    fullDescription:
      "Citizen verified the resolution or system automatically archived the solved grievance.",
    requiresReason: false,
    requiresAssignee: false,
    colorClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/10",
    dotClass: "bg-emerald-600",
    variant: "success",
  },
  REJECTED: {
    status: "REJECTED",
    label: "Rejected",
    actionTitle: "Reject Grievance",
    shortDescription: "Flag invalid, duplicate, or non-jurisdictional.",
    fullDescription:
      "Grievance is determined to be a duplicate, vexatious, or outside municipal city jurisdiction. A formal rejection justification is legally mandatory.",
    requiresReason: true,
    requiresAssignee: false,
    colorClass: "text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-500/30",
    bgClass: "bg-rose-500/10",
    dotClass: "bg-rose-500",
    variant: "destructive",
  },
  REOPENED: {
    status: "REOPENED",
    label: "Reopened (7d)",
    actionTitle: "Reopened",
    shortDescription: "Citizen exercised 7-day guarantee due to defect.",
    fullDescription:
      "Citizen reported that defects persisted within the 7-day warranty window. Prioritized for re-inspection.",
    requiresReason: true,
    requiresAssignee: false,
    colorClass: "text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-500/30",
    bgClass: "bg-rose-500/10",
    dotClass: "bg-rose-500",
    variant: "destructive",
  },
};
