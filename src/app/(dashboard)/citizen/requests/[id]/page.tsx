"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  FileCheck2,
  FileText,
  HelpCircle,
  History,
  Info,
  MapPin,
  MessageSquare,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RequestFeePanel } from "@/components/modules/payments";
import { EditTicketModal } from "@/components/modules/requests";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useConfirmServiceRequest,
  useGetServiceRequestById,
  useReopenServiceRequest,
  useSubmitFeedback,
} from "@/hooks/request.hooks";
import type { ServiceRequest } from "@/types/request.types";

// Fallback mock detail for preview when API is idle
const MOCK_FALLBACK_DOSSIER: ServiceRequest = {
  id: "demo-1",
  requestNumber: "CF-2026-0941",
  title: "Severe rainwater drainage choke causing road flooding",
  description:
    "Water accumulated over 18 inches after evening rainfall. Pedestrians unable to cross and basement shop entrances at risk of flooding.",
  status: "RESOLVED",
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
  resolutionSummary:
    "Drainage crew mobilized high-capacity suction pumps, cleared 150kg of plastic sediment from the main culvert mouth, and applied disinfectant.",
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
    email: "staff.drainage@civicflow.org",
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
    {
      id: "sh-3",
      fromStatus: "IN_PROGRESS",
      toStatus: "RESOLVED",
      reason: "Culvert choke removed; water draining freely.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
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

export default function RequestDossierPage() {
  const params = useParams();
  const requestId = (params?.id as string) || "";

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetServiceRequestById(requestId);
  const ticket = response?.data || MOCK_FALLBACK_DOSSIER;

  // Verification & Action States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Mutations
  const { mutate: confirmResolution, isPending: isConfirming } =
    useConfirmServiceRequest();
  const { mutate: reopenRequest, isPending: isReopening } =
    useReopenServiceRequest();
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } =
    useSubmitFeedback();

  // Handlers
  const handleConfirmResolution = () => {
    confirmResolution(ticket.id, {
      onSuccess: () => {
        gooeyToast.success("Resolution Verified & Closed", {
          description: "Thank you for confirming resolution of this grievance.",
        });
        refetch();
      },
      onError: (err: any) => {
        gooeyToast.error("Confirmation Failed", {
          description: err.message || "Could not confirm resolution.",
        });
      },
    });
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim() || reopenReason.trim().length < 5) {
      gooeyToast.error("Reason Required", {
        description: "Please specify why the grievance is not yet resolved.",
      });
      return;
    }

    reopenRequest(
      { requestId: ticket.id, reason: reopenReason.trim() },
      {
        onSuccess: () => {
          gooeyToast.warning("Case Reopened", {
            description:
              "The grievance has been returned to the department work queue.",
          });
          setIsReopenModalOpen(false);
          refetch();
        },
        onError: (err: any) => {
          gooeyToast.error("Reopen Failed", {
            description:
              err.message ||
              "Could not reopen case. The 7-day window may have expired.",
          });
        },
      },
    );
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(
      { requestId: ticket.id, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          gooeyToast.success("Feedback Submitted", {
            description: "Thank you for rating our municipal service quality.",
          });
          setFeedbackSubmitted(true);
          refetch();
        },
        onError: (err: any) => {
          gooeyToast.error("Feedback Error", {
            description: err.message || "Could not submit rating.",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <Spinner />
        <span className="text-xs text-muted-foreground font-mono">
          Loading ticket telemetry...
        </span>
      </div>
    );
  }

  const isResolved = ticket.status === "RESOLVED";
  const isClosed = ticket.status === "CLOSED";
  const hasFee =
    ticket.caseType === "SERVICE_REQUEST" &&
    ticket.category &&
    ticket.category.feeAmount > 0;

  return (
    <div className="mx-auto max-w-4xl pb-16 animate-in fade-in duration-200 flex flex-col gap-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/citizen"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Tickets</span>
        </Link>

        {/* Dossier Header Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-bold text-primary tracking-wider">
                  {ticket.requestNumber}
                </span>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {ticket.title}
              </h1>
            </div>

            <div className="flex flex-col sm:items-end gap-2 text-xs text-muted-foreground">
              <div className="flex flex-col sm:items-end gap-1">
                <span className="font-mono text-[11px]">
                  Filed: {new Date(ticket.createdAt).toLocaleString()}
                </span>
                {ticket.slaDueAt && (
                  <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="size-3" />
                    SLA Due: {new Date(ticket.slaDueAt).toLocaleString()}
                  </span>
                )}
              </div>

              {ticket.status === "SUBMITTED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/10 shadow-xs text-xs font-semibold h-8 px-3.5"
                >
                  <Edit3 className="size-3.5" />
                  <span>Edit Ticket</span>
                </Button>
              )}
            </div>
          </div>

          {/* Department & Meta pill tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {ticket.department && (
              <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 font-medium text-foreground">
                Dept: {ticket.department.name}
              </span>
            )}
            {ticket.category && (
              <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 font-medium text-foreground">
                Category: {ticket.category.name} (
                {ticket.category.slaMinutes / 60}h SLA)
              </span>
            )}
            <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 text-muted-foreground font-mono text-[11px]">
              Type: {ticket.caseType}
            </span>
          </div>
        </div>
      </div>

      {/* CITIZEN SUBMITTED TRIAGE BANNER */}
      {ticket.status === "SUBMITTED" && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-sky-600 text-white shrink-0 mt-0.5">
              <Info className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Ticket In Triage Queue — Editable Mode Active
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Your grievance is currently queued for department triage. You
                can refine the title, description, category, priority, street
                address, and GPS coordinates before dispatch.
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="w-full sm:w-auto gap-2 rounded-4xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-xs"
          >
            <Edit3 className="size-4" />
            <span>Edit Grievance</span>
          </Button>
        </div>
      )}

      {/* THE CITIZEN VERIFICATION LOOP BANNER */}
      {isResolved && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Citizen Verification Required: Municipal Work Completed
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                The municipal field crew has resolved this grievance and
                provided completion notes. Please verify the ground reality. If
                the issue is resolved to your satisfaction, confirm closure. If
                defects persist, you have the legal guarantee to reopen the case
                within 7 days.
              </p>
            </div>
          </div>

          {/* Technician resolution notes */}
          {ticket.resolutionSummary && (
            <div className="rounded-lg bg-card/80 border border-emerald-500/20 p-3.5 mb-4 text-xs">
              <span className="font-semibold text-foreground block mb-1">
                Technician Resolution Statement:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;{ticket.resolutionSummary}&rdquo;
              </p>
            </div>
          )}

          {/* Verification buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="default"
              size="default"
              onClick={handleConfirmResolution}
              disabled={isConfirming}
              className="w-full sm:w-auto gap-2 rounded-4xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isConfirming ? (
                <Spinner>Closing Ticket...</Spinner>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Verify & Confirm Resolution</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={() => setIsReopenModalOpen(true)}
              className="w-full sm:w-auto gap-2 rounded-4xl border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="size-4" />
              <span>Issue Not Fixed? Reopen Case (7d)</span>
            </Button>
          </div>
        </div>
      )}

      {/* MUNICIPAL SERVICE FEE & PAYMENT RECONCILIATION PANEL */}
      <RequestFeePanel ticket={ticket} onPaymentUpdated={() => refetch()} />

      {/* CITIZEN FEEDBACK FORM (on CLOSED tickets) */}
      {isClosed && (
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Municipal Quality Review
            </h2>
          </div>

          {ticket.feedback || feedbackSubmitted ? (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold">Review recorded:</span> You rated
              this resolution {ticket.feedback?.rating || rating} / 5 stars.
              Thank you for helping maintain city standards.
            </div>
          ) : (
            <form
              onSubmit={handleFeedbackSubmit}
              className="flex flex-col gap-3"
            >
              <p className="text-xs text-muted-foreground">
                How satisfied are you with the timeliness and quality of this
                municipal repair?
              </p>

              {/* Star selector */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`size-5 ${
                        star <= rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-foreground ml-2">
                  {rating} of 5 Stars
                </span>
              </div>

              <Textarea
                placeholder="Optional feedback for the department team or municipal council..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[72px]"
              />

              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={isSubmittingFeedback}
                className="self-end rounded-4xl"
              >
                {isSubmittingFeedback ? (
                  <Spinner>Recording...</Spinner>
                ) : (
                  "Submit Public Rating"
                )}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Main Grid: Details + State Machine Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Problem Description & Evidence */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Incident Description */}
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>Grievance Description</span>
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>

            {/* Geotag & Location card */}
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                <span>Location Metadata</span>
              </span>
              <p className="text-xs text-muted-foreground">{ticket.address}</p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-1">
                {ticket.ward && <span>Ward: {ticket.ward}</span>}
                {ticket.zone && <span>Zone: {ticket.zone}</span>}
                {ticket.landmark && <span>Landmark: {ticket.landmark}</span>}
              </div>

              {ticket.latitude !== null && ticket.longitude !== null && (
                <div className="mt-2 rounded-lg bg-muted/40 p-2 font-mono text-[11px] text-foreground flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>
                    GPS: {ticket.latitude}° N, {ticket.longitude}° E
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Field Investigation Notes */}
          {ticket.investigationNotes &&
            ticket.investigationNotes.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  <span>Field Crew Investigation Logs</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {ticket.investigationNotes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-border bg-muted/20 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span className="font-semibold text-foreground">
                          {note.actor?.name || "Technician"}
                        </span>
                        <span className="font-mono">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Evidence Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Attached Evidence Photos ({ticket.attachments.length})
              </h2>
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
                      className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center"
                    >
                      {hasValidUrl ? (
                        <a
                          href={resolvedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block size-full"
                          title={file?.fileName || `Evidence ${i + 1}`}
                        >
                          <Image
                            src={resolvedUrl}
                            alt={file?.fileName || `Evidence ${i + 1}`}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ExternalLink className="size-4 text-white drop-shadow-md" />
                          </div>
                        </a>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-muted-foreground">
                          <FileText className="size-6 mb-1 text-muted-foreground/60" />
                          <span className="text-[11px] truncate max-w-full px-1 text-muted-foreground font-mono">
                            {file?.fileName || `Attachment ${i + 1}`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Deterministic State Machine Progression */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="size-4 text-primary" />
              <span>Lifecycle State Progression</span>
            </h2>

            {/* Stages Flow */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {ticket.statusHistory && ticket.statusHistory.length > 0 ? (
                ticket.statusHistory.map((item, idx) => (
                  <div key={item.id} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-6 top-0.5 size-3 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">
                        {item.toStatus}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      {item.reason && (
                        <p className="mt-1 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-md">
                          {item.reason}
                        </p>
                      )}
                      {item.actor && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          By: {item.actor.name} ({item.actor.role})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  Ticket logged and queued for automatic triage.
                </div>
              )}
            </div>
          </div>

          {/* Assigned Technician Card */}
          {ticket.assignedTo && (
            <div className="rounded-xl border border-border bg-card p-4 text-xs">
              <span className="text-muted-foreground block mb-1">
                Assigned Field Technician
              </span>
              <p className="font-semibold text-foreground">
                {ticket.assignedTo.name}
              </p>
              <p className="text-muted-foreground">{ticket.assignedTo.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* 7-DAY REOPEN DIALOG MODAL */}
      {isReopenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsReopenModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <RotateCcw className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Exercise 7-Day Reopen Guarantee
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Ticket #{ticket.requestNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              If the reported civic defect was not properly fixed or has
              reoccurred, you have the unconditional right to reopen this
              complaint within 7 days of field completion. The department head
              will be alerted.
            </p>

            <form onSubmit={handleReopenSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="reopen-reason-input"
                  className="text-xs font-medium text-foreground block mb-1"
                >
                  Why is this issue still unresolved?{" "}
                  <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="reopen-reason-input"
                  rows={3}
                  placeholder="e.g. The drain is still clogged at the mouth and water continues to pool during drizzle..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReopenModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={isReopening}
                  className="rounded-4xl gap-1.5"
                >
                  {isReopening ? (
                    <Spinner>Reopening...</Spinner>
                  ) : (
                    <>
                      <RotateCcw className="size-3.5" />
                      <span>Reopen Case for Action</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TICKET MODAL */}
      <EditTicketModal
        ticket={ticket}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
