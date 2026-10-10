"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  HardHat,
  History,
  Info,
  MapPin,
  Navigation,
  RefreshCw,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AssignStaffModal,
  InvestigationNotesCard,
  ResolveTicketModal,
  StatusTransitionControl,
} from "@/components/modules/requests";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useGetServiceRequestById } from "@/hooks/request.hooks";
import type { ServiceRequest } from "@/types/request.types";

const MOCK_FALLBACK_STAFF_DOSSIER: ServiceRequest = {
  id: "demo-staff-1",
  requestNumber: "CF-2026-0941",
  title: "Severe rainwater drainage choke causing road flooding",
  description:
    "Water accumulated over 18 inches after evening rainfall. Pedestrians unable to cross and basement shop entrances at risk of flooding. Immediate suction pump and culvert unblocking required.",
  status: "IN_PROGRESS",
  priority: "HIGH",
  caseType: "COMPLAINT",
  routingStatus: "ASSIGNED",
  address: "Road 5, Block B, Dhanmondi, Dhaka",
  ward: "Ward 15",
  zone: "Zone South",
  landmark: "Beside City Hospital Corner",
  latitude: 23.7465,
  longitude: 90.3762,
  slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
  slaEscalationState: "NONE",
  citizenId: "citizen-sarah",
  createdById: "user-sarah",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  updatedAt: new Date().toISOString(),
  category: {
    id: "cat-1",
    name: "Waterlogging & Drainage Choke",
    feeAmount: 0,
    feeCurrency: "BDT",
    slaMinutes: 1440,
    isActive: true,
  },
  department: {
    id: "dept-1",
    name: "Drainage & Sewerage Department",
    isActive: true,
  },
  assignedTo: {
    id: "staff-1",
    name: "Field Officer Kamal",
    email: "kamal.engineer@civicflow.gov.bd",
  },
  statusHistory: [
    {
      id: "sh-1",
      fromStatus: "SUBMITTED",
      toStatus: "TRIAGED",
      reason: "Automated routing rule applied based on category and ward.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(),
      actor: { name: "System Dispatcher", role: "SYSTEM" },
    },
    {
      id: "sh-2",
      fromStatus: "TRIAGED",
      toStatus: "IN_PROGRESS",
      reason: "Crew dispatched to site with drainage maintenance gear.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      actor: { name: "Field Officer Kamal", role: "STAFF" },
    },
  ],
  investigationNotes: [
    {
      id: "note-1",
      note: "Initial inspection shows blockage caused by discarded building material and polythene at culvert mouth.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
      actor: { name: "Field Officer Kamal", role: "STAFF" },
    },
    {
      id: "note-2",
      note: "Heavy suction machine deployed. Flow restored to 90% normal speed.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      actor: { name: "Field Officer Kamal", role: "STAFF" },
    },
  ],
};

export default function StaffRequestDetailsPage() {
  const params = useParams();
  const requestId = (params?.id as string) || "";

  const { user: currentUser, role } = useCurrentUser();
  const isAdmin = role === "ADMIN";

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetServiceRequestById(requestId);
  const ticket = response?.data || MOCK_FALLBACK_STAFF_DOSSIER;

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const hasAssignee = Boolean(ticket.assignedToId || ticket.assignedTo?.id);
  const isAssignedToMe =
    ticket.assignedTo?.id === currentUser?.id ||
    ticket.assignedTo?.email === currentUser?.email;
  const isEscalated =
    ticket.slaEscalationState === "ESCALATED" || Boolean(ticket.slaBreachedAt);

  const slaRemainingHours = useMemo(() => {
    if (!ticket.slaDueAt) return null;
    const dueTime = new Date(ticket.slaDueAt).getTime();
    const diffHours = (dueTime - Date.now()) / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10;
  }, [ticket.slaDueAt]);

  const handleCopyRequestNumber = () => {
    if (!ticket.requestNumber) return;
    navigator.clipboard.writeText(ticket.requestNumber);
    gooeyToast.success("Copied to Clipboard", {
      description: `Tracking ID ${ticket.requestNumber} copied.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <Spinner className="size-8 text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Loading field telemetry for ticket #{requestId}...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/staff"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Field Queue</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground">Ticket Dossier</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-mono font-bold text-primary">
            {ticket.requestNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-full h-7 px-2.5"
            title="Synchronize field telemetry"
          >
            <RefreshCw
              className={`size-3 ${isFetching ? "animate-spin text-primary" : ""}`}
            />
            <span>{isFetching ? "Syncing..." : "Sync"}</span>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={handleCopyRequestNumber}
            className="gap-1.5 text-xs rounded-full font-mono h-7 px-2.5"
            title="Copy Tracking ID"
          >
            <Copy className="size-3" />
            <span>{ticket.requestNumber}</span>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs relative z-20">
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-linear-to-r from-blue-600 via-primary to-emerald-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-border/70 pb-5 mb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-primary tracking-wider">
                {ticket.requestNumber}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted font-semibold uppercase tracking-wider text-muted-foreground border border-border/80">
                {ticket.caseType}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {ticket.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                <span>
                  Filed: {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </span>

              {ticket.department && (
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="size-3.5 text-primary" />
                  <span>{ticket.department.name}</span>
                </span>
              )}

              {ticket.category && (
                <span className="text-muted-foreground">
                  Cat: {ticket.category.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssignModalOpen(true)}
                className="gap-1.5 rounded-full border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 shadow-xs text-xs font-semibold h-8 px-3.5"
                title={
                  hasAssignee
                    ? "Reassign designated field technician"
                    : "Assign designated field technician"
                }
              >
                <UserCheck className="size-3.5" />
                <span>
                  {hasAssignee ? "Reassign Officer" : "Assign Officer"}
                </span>
              </Button>
            )}

            {isAdmin && ticket.status === "IN_PROGRESS" && (
              <Button
                size="sm"
                onClick={() => setIsResolveModalOpen(true)}
                className="gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs text-xs font-semibold h-8 px-3.5"
                title="Submit formal field work completion statement"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Mark as Resolved</span>
              </Button>
            )}

            <StatusTransitionControl
              ticket={ticket}
              mode="dropdown"
              onTransitionSuccess={() => refetch()}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {hasAssignee ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium">
                <HardHat className="size-3.5" />
                <span>
                  Technician: {ticket.assignedTo?.name}
                  {isAssignedToMe ? " (You)" : ""}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">
                <AlertTriangle className="size-3.5" />
                <span>
                  {isAdmin
                    ? "Unassigned — Technician Required"
                    : "Unassigned — Pending Administrator Assignment"}
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="underline hover:text-foreground ml-1 font-bold cursor-pointer"
                  >
                    Assign Now
                  </button>
                )}
              </div>
            )}

            {(ticket.ward || ticket.zone) && (
              <span className="px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground font-mono text-[11px]">
                {ticket.ward ? `${ticket.ward}` : ""}
                {ticket.ward && ticket.zone ? " • " : ""}
                {ticket.zone ? `${ticket.zone}` : ""}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {ticket.slaDueAt && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-semibold border ${
                  isEscalated
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : slaRemainingHours !== null && slaRemainingHours <= 4
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-border bg-muted/40 text-foreground"
                }`}
              >
                <Clock className="size-3.5" />
                <span>
                  {slaRemainingHours !== null && slaRemainingHours > 0
                    ? `SLA: ${slaRemainingHours}h remaining`
                    : isEscalated
                      ? "SLA Breached / Escalated"
                      : "SLA Window Expired"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hasAssignee && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold text-sm">
                Field Technician Assignment Required
              </p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300/90 leading-relaxed text-[11px]">
                Under municipal operating procedure, a field technician must be
                assigned before ground repairs can be set to{" "}
                <strong>IN_PROGRESS</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <Button
                size="xs"
                onClick={() => setIsAssignModalOpen(true)}
                className="rounded-full text-xs gap-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <UserCheck className="size-3" />
                <span>Assign Field Technician</span>
              </Button>
            ) : (
              <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                Pending Administrator Assignment
              </span>
            )}
          </div>
        </div>
      )}

      {ticket.status === "IN_PROGRESS" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-300">
          <div className="flex items-start gap-3">
            <Wrench className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="font-bold text-sm">
                Remediation Work Underway in Field
              </p>
              <p className="mt-0.5 text-emerald-800 dark:text-emerald-300/90 leading-relaxed text-[11px]">
                Active repairs are in progress by{" "}
                <strong>
                  {ticket.assignedTo?.name || "the assigned crew"}
                </strong>
                . When on-site work is completed, submit the mandatory
                resolution summary to trigger citizen verification.
              </p>
            </div>
          </div>

          <Button
            size="xs"
            onClick={() => setIsResolveModalOpen(true)}
            className="rounded-full text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            <CheckCircle2 className="size-3" />
            <span>Mark Work as Resolved</span>
          </Button>
        </div>
      )}

      <StatusTransitionControl
        ticket={ticket}
        mode="panel"
        onTransitionSuccess={() => refetch()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <span>Incident Briefing & Citizen Statement</span>
              </h2>
              <span className="text-[11px] font-mono text-muted-foreground">
                Type: {ticket.caseType}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {ticket.description}
            </p>

            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs bg-muted/20 p-3 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  <User className="size-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">
                    Citizen Reporter
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    ID: {ticket.citizenId || "Anonymous / Walk-in"}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground font-mono text-right">
                <span>Received: </span>
                <span className="text-foreground font-semibold">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Geospatial & Site Inspection Details</span>
              </h2>
              {ticket.latitude !== null && ticket.longitude !== null && (
                <a
                  href={`https://www.google.com/maps?q=${ticket.latitude},${ticket.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  <Navigation className="size-3" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="size-2.5" />
                </a>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">
                  Physical Ground Address
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  {ticket.address ||
                    ticket.location ||
                    "No street address recorded"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                    Ward
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {ticket.ward || "Unspecified"}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                    Zone
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {ticket.zone || "Unspecified"}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-2.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                    Landmark
                  </span>
                  <span className="text-xs font-bold text-foreground truncate block">
                    {ticket.landmark || "None reported"}
                  </span>
                </div>
              </div>

              {ticket.latitude !== null && ticket.longitude !== null && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-emerald-900 dark:text-emerald-300 font-semibold text-[11px]">
                      GPS Coordinates: {ticket.latitude}° N, {ticket.longitude}°
                      E
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Verified Pin
                  </span>
                </div>
              )}
            </div>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-bold text-foreground">
                  Citizen Evidence Photos ({ticket.attachments.length})
                </h2>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Site Visuals
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ticket.attachments.map((file, i) => {
                  const fileRaw = file as unknown;
                  const resolvedUrl =
                    (typeof file?.url === "string" && file.url.trim()) ||
                    (typeof file?.fileUrl === "string" &&
                      file.fileUrl.trim()) ||
                    (typeof fileRaw === "string" ? fileRaw.trim() : "");
                  const hasValidUrl = resolvedUrl.length > 0;

                  return (
                    <div
                      key={file?.id || `att-${i}`}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted/30 group"
                    >
                      {hasValidUrl ? (
                        <a
                          href={resolvedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block size-full relative"
                          title={file?.fileName || `Evidence photo ${i + 1}`}
                        >
                          <Image
                            src={resolvedUrl}
                            alt={file?.fileName || `Evidence photo ${i + 1}`}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="size-5 text-white" />
                          </div>
                        </a>
                      ) : (
                        <div className="flex flex-col items-center justify-center size-full p-2 text-center text-muted-foreground text-[10px]">
                          <span>Attachment {i + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <InvestigationNotesCard
            ticket={ticket}
            onNoteAdded={() => refetch()}
          />

          {ticket.resolutionSummary && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-foreground">
                  Official Field Resolution Statement
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed bg-card p-3.5 rounded-xl border border-emerald-500/20 italic">
                &ldquo;{ticket.resolutionSummary}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                <Users className="size-3.5 text-primary" />
                <span>Field Ownership</span>
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  {hasAssignee ? "Reassign" : "Assign"}
                </button>
              )}
            </div>

            {hasAssignee && ticket.assignedTo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {ticket.assignedTo.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {ticket.assignedTo.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {ticket.assignedTo.email}
                    </p>
                  </div>
                </div>

                {isAssignedToMe ? (
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-[11px] text-primary font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>You are assigned to this grievance.</span>
                  </div>
                ) : isAdmin ? (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="w-full rounded-full text-xs"
                  >
                    Transfer to Another Officer
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-2 space-y-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto">
                  <UserPlus className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    No Technician Assigned
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Field work cannot be started until assigned by municipal
                    administration.
                  </p>
                </div>
                {isAdmin ? (
                  <div className="flex flex-col gap-2 pt-1">
                    <Button
                      size="xs"
                      onClick={() => setIsAssignModalOpen(true)}
                      className="rounded-full text-xs gap-1 bg-primary text-primary-foreground"
                    >
                      <UserCheck className="size-3" />
                      <span>Assign Field Technician</span>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <span className="text-[11px] text-muted-foreground italic">
                      Awaiting Administrator Assignment
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono border-b border-border pb-3">
              <Clock className="size-3.5 text-primary" />
              <span>SLA Target Monitor</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">
                  Category SLA Target:
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {ticket.category
                    ? `${ticket.category.slaMinutes / 60} Hours`
                    : "24 Hours"}
                </span>
              </div>

              {ticket.slaDueAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">
                    Deadline:
                  </span>
                  <span className="font-mono font-semibold text-foreground text-[11px]">
                    {new Date(ticket.slaDueAt).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">
                  Escalation State:
                </span>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEscalated
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {ticket.slaEscalationState || "NONE"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono border-b border-border pb-3">
              <History className="size-3.5 text-primary" />
              <span>State Audit Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {ticket.statusHistory && ticket.statusHistory.length > 0 ? (
                ticket.statusHistory.map((item) => (
                  <div key={item.id} className="relative text-xs">
                    <div className="absolute -left-6 top-1 size-2.5 rounded-full bg-primary ring-2 ring-primary/20" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={item.toStatus} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      {item.reason && (
                        <p className="mt-1 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-lg leading-relaxed">
                          {item.reason}
                        </p>
                      )}
                      {item.actor && (
                        <span className="text-[10px] text-muted-foreground block mt-1 font-mono">
                          Actor: {item.actor.name} ({item.actor.role})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  No state transitions recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AssignStaffModal
        ticket={ticket}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <ResolveTicketModal
        ticket={ticket}
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
