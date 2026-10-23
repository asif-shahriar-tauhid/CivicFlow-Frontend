"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  HardHat,
  History,
  Info,
  Lock,
  MapPin,
  RotateCcw,
  Route,
  ShieldCheck,
  Star,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { resolveCategoryImage } from "@/components/modules/home/RecentPublicIssuesSection";
import { RequestFeePanel } from "@/components/modules/payments";
import {
  AssignStaffModal,
  DeleteTicketModal,
  EditTicketModal,
  InvestigationNotesCard,
  ResolveTicketModal,
  StatusTransitionControl,
} from "@/components/modules/requests";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useGetRequestFeedback } from "@/hooks/feedback.hooks";
import {
  useConfirmServiceRequest,
  useGetPublicServiceRequestById,
  useGetPublicServiceRequests,
  useReopenServiceRequest,
  useRouteServiceRequest,
  useSubmitFeedback,
} from "@/hooks/request.hooks";

export default function RequestDossierPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = (params?.id as string) || "";

  const { user, role, isAuthenticated } = useCurrentUser();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetPublicServiceRequestById(requestId);
  const ticket = response?.data;

  const { data: publicListResponse } = useGetPublicServiceRequests();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Strict authentication & authorization flags for CRUD operations
  const isAdmin = Boolean(isAuthenticated && user && role === "ADMIN");
  const isStaff = Boolean(isAuthenticated && user && role === "STAFF");
  const isStaffOrAdmin = isAdmin || isStaff;
  const isTicketOwner = Boolean(
    isAuthenticated &&
      user &&
      role === "CITIZEN" &&
      ticket &&
      (user.id === ticket.citizenId ||
        user.id === ticket.createdById ||
        user.id === ticket.citizen?.id ||
        (user.email &&
          (user.email === ticket.citizen?.email ||
            user.email === ticket.createdBy?.email))),
  );

  const { mutate: confirmResolution, isPending: isConfirming } =
    useConfirmServiceRequest();
  const { mutate: reopenRequest, isPending: isReopening } =
    useReopenServiceRequest();
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } =
    useSubmitFeedback();
  const { data: existingFeedbackResponse } = useGetRequestFeedback(
    isAuthenticated && isTicketOwner && ticket?.id ? ticket.id : "",
  );
  const recordedFeedback = ticket?.feedback || existingFeedbackResponse?.data;
  const { mutateAsync: routeRequest, isPending: isRerouting } =
    useRouteServiceRequest();

  const relatedItems = useMemo(() => {
    const rawList = publicListResponse?.data;
    if (!Array.isArray(rawList) || !ticket) return [];

    // FIFO order (oldest first), prioritizing same category if available
    return [...rawList]
      .filter(
        (candidate) =>
          candidate.id !== ticket.id &&
          candidate.requestNumber !== ticket.requestNumber,
      )
      .sort((a, b) => {
        const aSameCat =
          a.categoryId && a.categoryId === ticket.categoryId ? 0 : 1;
        const bSameCat =
          b.categoryId && b.categoryId === ticket.categoryId ? 0 : 1;
        if (aSameCat !== bSameCat) return aSameCat - bSameCat;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      })
      .slice(0, 3);
  }, [publicListResponse, ticket]);

  const handleReroute = async () => {
    if (!isAdmin || !ticket?.id) {
      gooeyToast.error("Authorization Required", {
        description: "Only authenticated administrators can re-route tickets.",
      });
      return;
    }
    try {
      const res = await routeRequest(ticket.id);
      const updated = res?.data;
      const deptName = updated?.department?.name;
      const isAssigned =
        updated?.routingStatus === "ASSIGNED" && Boolean(deptName);

      if (isAssigned) {
        gooeyToast.success("Request Routed", {
          description: `Ticket ${ticket.requestNumber} successfully assigned to ${deptName}.`,
        });
      } else {
        gooeyToast.info("Manual Review Flagged", {
          description: `Ticket ${ticket.requestNumber} could not be auto-routed and remains in Manual Review.`,
        });
      }
      refetch();
    } catch (err: any) {
      gooeyToast.error("Re-route Failed", {
        description: err?.message || "Failed to re-evaluate routing rules.",
      });
    }
  };

  const handleConfirmResolution = () => {
    if (!isTicketOwner || !ticket?.id) {
      gooeyToast.error("Authorization Required", {
        description:
          "Only the authenticated reporting citizen can confirm resolution.",
      });
      return;
    }
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
    if (!isTicketOwner || !ticket?.id) {
      gooeyToast.error("Authorization Required", {
        description:
          "Only the authenticated reporting citizen can reopen this ticket.",
      });
      return;
    }
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
    if (!isTicketOwner || !ticket?.id) {
      gooeyToast.error("Authorization Required", {
        description:
          "Only the authenticated reporting citizen can rate this service request.",
      });
      return;
    }
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
          const errMsg =
            err?.data?.message || err?.message || "Could not submit rating.";
          if (
            err?.statusCode === 409 ||
            err?.status === 409 ||
            errMsg.includes("already been submitted")
          ) {
            setFeedbackSubmitted(true);
            refetch();
            gooeyToast.info("Feedback Already Recorded", {
              description:
                "Your feedback for this service request was already recorded.",
            });
            return;
          }
          gooeyToast.error("Feedback Error", {
            description: errMsg,
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

  if (isError || !ticket) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center space-y-4">
        <Badge variant="outline" className="font-mono text-xs">
          404 • Grievance Record Not Found
        </Badge>
        <h1 className="text-2xl font-bold text-foreground">
          Issue Dossier Unavailable
        </h1>
        <p className="text-xs text-muted-foreground">
          We could not find a public grievance record matching{" "}
          <span className="font-mono font-semibold text-foreground">
            {requestId}
          </span>
          .
        </p>
        <div className="pt-2">
          <Button
            variant="default"
            size="sm"
            render={<Link href={isAuthenticated ? "/citizen" : "/"} />}
            nativeButton={false}
            className="gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>{isAuthenticated ? "Back to Dashboard" : "Back to Home"}</span>
          </Button>
        </div>
      </div>
    );
  }

  const isResolved = ticket.status === "RESOLVED";
  const isClosed = ticket.status === "CLOSED";
  const feeAmount = Number(ticket.category?.feeAmount ?? 0);
  const slaHours = ticket.category?.slaMinutes
    ? Math.max(1, Math.round(Number(ticket.category.slaMinutes) / 60))
    : 24;

  const backHref = !isAuthenticated
    ? "/#recent-issues"
    : role === "ADMIN"
      ? "/admin"
      : role === "STAFF"
        ? "/staff"
        : "/citizen";

  const backLabel = !isAuthenticated
    ? "Back to Live Ward Ledger"
    : role === "ADMIN"
      ? "Back to Admin Desk"
      : role === "STAFF"
        ? "Back to Staff Queue"
        : "Back to All Tickets";

  return (
    <div className="mx-auto max-w-5xl pb-16 animate-in fade-in duration-200 flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>{backLabel}</span>
          </Link>

          {!isTicketOwner && !isStaffOrAdmin && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Lock className="size-3 text-primary" />
              <span>Public Read-Only View • Auth Required for Actions</span>
            </span>
          )}
        </div>

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

              {/* CRUD Action Toolbar — strictly requires authentication & role/ownership authorization */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="gap-1.5 rounded-full border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 shadow-xs text-xs font-semibold h-8 px-3.5"
                    title={
                      ticket.assignedTo
                        ? "Reassign field technician"
                        : "Assign field technician"
                    }
                  >
                    <UserCheck className="size-3.5" />
                    <span>
                      {ticket.assignedTo ? "Reassign" : "Assign Staff"}
                    </span>
                  </Button>
                )}

                {isAdmin && ticket.status === "IN_PROGRESS" && (
                  <Button
                    size="sm"
                    onClick={() => setIsResolveModalOpen(true)}
                    className="gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs text-xs font-semibold h-8 px-3.5"
                    title="Mark field work as resolved with mandatory summary"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Mark Resolved</span>
                  </Button>
                )}

                {isStaffOrAdmin && (
                  <StatusTransitionControl
                    ticket={ticket}
                    mode="dropdown"
                    onTransitionSuccess={() => refetch()}
                  />
                )}

                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReroute}
                    disabled={isRerouting}
                    className="gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/10 shadow-xs text-xs font-semibold h-8 px-3.5"
                    title="Re-evaluate automated routing rules for this ticket"
                  >
                    {isRerouting ? (
                      <>
                        <Spinner className="size-3.5" />
                        <span>Routing...</span>
                      </>
                    ) : (
                      <>
                        <Route className="size-3.5" />
                        <span>Re-route Ticket</span>
                      </>
                    )}
                  </Button>
                )}

                {ticket.status === "SUBMITTED" && isTicketOwner && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/10 shadow-xs text-xs font-semibold h-8 px-3.5"
                    >
                      <Edit3 className="size-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="gap-1.5 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 shadow-xs text-xs font-semibold h-8 px-3.5"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Cancel Ticket</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {ticket.department && (
              <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 font-medium text-foreground">
                Dept: {ticket.department.name}
              </span>
            )}
            {ticket.category && (
              <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 font-medium text-foreground">
                Category: {ticket.category.name} ({slaHours}h SLA)
              </span>
            )}
            <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 font-medium text-foreground">
              Tariff:{" "}
              {feeAmount > 0
                ? `${feeAmount} ${ticket.category?.feeCurrency || "BDT"}`
                : "Free Intake"}
            </span>
            {ticket.assignedTo ? (
              <span className="rounded-4xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-medium text-blue-700 dark:text-blue-300 inline-flex items-center gap-1.5">
                <UserCheck className="size-3.5" />
                <span>Assigned: {ticket.assignedTo.name}</span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="underline hover:text-foreground text-[10px] ml-1 cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </span>
            ) : (
              <span className="rounded-4xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-medium text-amber-700 dark:text-amber-400 inline-flex items-center gap-1.5">
                <HardHat className="size-3.5" />
                <span>Unassigned</span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="underline hover:text-foreground text-[10px] ml-1 cursor-pointer font-bold"
                  >
                    Assign Now
                  </button>
                )}
              </span>
            )}
            <span className="rounded-4xl border border-border bg-muted/30 px-3 py-1 text-muted-foreground font-mono text-[11px]">
              Type: {ticket.caseType}
            </span>
          </div>
        </div>
      </div>

      {/* Staff/Admin State Machine Control Panel (Authenticated & Authorized Only) */}
      {isStaffOrAdmin && (
        <StatusTransitionControl
          ticket={ticket}
          mode="panel"
          onTransitionSuccess={() => refetch()}
        />
      )}

      {/* Citizen Editable Triage Banner (Authenticated & Ticket Owner Only) */}
      {ticket.status === "SUBMITTED" && isTicketOwner && (
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
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full sm:w-auto gap-1.5 rounded-4xl border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
            >
              <Trash2 className="size-3.5" />
              <span>Cancel Request</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="w-full sm:w-auto gap-2 rounded-4xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-xs text-xs"
            >
              <Edit3 className="size-4" />
              <span>Edit Grievance</span>
            </Button>
          </div>
        </div>
      )}

      {/* Resolution Details & Citizen Verification Actions */}
      {isResolved && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isTicketOwner
                  ? "Citizen Verification Required: Municipal Work Completed"
                  : "Municipal Field Work Completed"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {isTicketOwner
                  ? "The municipal field crew has resolved this grievance and provided completion notes. Please verify the ground reality. If the issue is resolved to your satisfaction, confirm closure. If defects persist, you have the legal guarantee to reopen the case within 7 days."
                  : "The designated municipal field crew has marked this grievance as resolved and awaiting final citizen confirmation."}
              </p>
            </div>
          </div>

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

          {isTicketOwner && (
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
                    <span>Verify &amp; Confirm Resolution</span>
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
          )}
        </div>
      )}

      {/* Payment Checkout Panel — Authenticated & Authorized Owner/Admin/Staff Only */}
      {isAuthenticated && (isTicketOwner || isStaffOrAdmin) && (
        <RequestFeePanel ticket={ticket} onPaymentUpdated={() => refetch()} />
      )}

      {/* Municipal Quality Review — Read-Only for Public, Writable Only for Ticket Owner */}
      {isClosed && (recordedFeedback || feedbackSubmitted || isTicketOwner) && (
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Municipal Quality Review
            </h2>
          </div>

          {recordedFeedback || feedbackSubmitted ? (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold">Review recorded:</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-3.5 ${
                        star <= (recordedFeedback?.rating || rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono font-bold">
                  ({recordedFeedback?.rating || rating} of 5 stars)
                </span>
              </div>
              {recordedFeedback?.comment && (
                <p className="mt-2 text-foreground/80 bg-background/60 p-2.5 rounded-md border border-border/50 text-xs italic">
                  &ldquo;{recordedFeedback.comment}&rdquo;
                </p>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                Verified citizen satisfaction audit on the public ledger.
              </p>
            </div>
          ) : isTicketOwner ? (
            <form
              onSubmit={handleFeedbackSubmit}
              className="flex flex-col gap-3"
            >
              <p className="text-xs text-muted-foreground">
                How satisfied are you with the timeliness and quality of this
                municipal repair?
              </p>

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
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>Grievance Description</span>
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                <span>Location Metadata</span>
              </span>
              <p className="text-xs text-muted-foreground">
                {ticket.address || ticket.location || "Dhaka Municipal Zone"}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-1">
                {ticket.ward && <span>Ward: {ticket.ward}</span>}
                {ticket.zone && <span>Zone: {ticket.zone}</span>}
                {ticket.landmark && <span>Landmark: {ticket.landmark}</span>}
              </div>

              {ticket.latitude !== null &&
                ticket.latitude !== undefined &&
                ticket.longitude !== null &&
                ticket.longitude !== undefined && (
                  <div className="mt-2 rounded-lg bg-muted/40 p-2 font-mono text-[11px] text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>
                      GPS: {ticket.latitude}° N, {ticket.longitude}° E
                    </span>
                  </div>
                )}
            </div>
          </div>

          <InvestigationNotesCard
            ticket={ticket}
            onNoteAdded={() => refetch()}
          />

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

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="size-4 text-primary" />
              <span>Lifecycle State Progression</span>
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {ticket.statusHistory && ticket.statusHistory.length > 0 ? (
                ticket.statusHistory.map((item) => (
                  <div key={item.id} className="relative">
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

          {ticket.assignedTo && (
            <div className="rounded-xl border border-border bg-card p-4 text-xs">
              <span className="text-muted-foreground block mb-1">
                Assigned Field Technician
              </span>
              <p className="font-semibold text-foreground">
                {ticket.assignedTo.name}
              </p>
              {isStaffOrAdmin && (
                <p className="text-muted-foreground">
                  {ticket.assignedTo.email}
                </p>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Lock className="size-3.5 text-primary" />
                <span>Citizen &amp; Staff Actions</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Issue details are publicly accessible. Sign in to edit your own
                submitted tickets, verify resolutions, or perform staff actions.
              </p>
              <Button
                variant="default"
                size="sm"
                render={
                  <Link
                    href={`/login?redirect=/citizen/requests/${encodeURIComponent(ticket.id)}`}
                  />
                }
                nativeButton={false}
                className="w-full text-xs font-semibold"
              >
                Sign In for Authorized Actions
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Related Public Grievances Section */}
      {relatedItems.length > 0 && (
        <section
          aria-labelledby="related-grievances-heading"
          className="pt-6 border-t border-border space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Connected Public Ledger
              </span>
              <h2
                id="related-grievances-heading"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                Related Public Grievances
              </h2>
            </div>
            <Link
              href="/#recent-issues"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Live Ward Ledger
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {relatedItems.map((rel) => {
              const relSlaHours = rel.category?.slaMinutes
                ? Math.max(1, Math.round(Number(rel.category.slaMinutes) / 60))
                : 24;
              const relImage =
                rel.attachments?.[0]?.url ||
                rel.attachments?.[0]?.fileUrl ||
                resolveCategoryImage(rel.category?.name);
              const relWard = rel.ward
                ? rel.ward.toLowerCase().startsWith("ward")
                  ? rel.ward
                  : `Ward ${rel.ward}`
                : "Ward 04";

              return (
                <div
                  key={rel.id}
                  className="group flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col flex-1">
                    <div className="relative mb-3.5 h-36 w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={relImage}
                        alt={rel.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <StatusBadge status={rel.status} />
                      </div>
                      <div className="absolute top-2 right-2">
                        <PriorityBadge priority={rel.priority || "NORMAL"} />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                        <span className="rounded bg-background/90 px-2 py-0.5 font-bold text-primary backdrop-blur-md">
                          {rel.requestNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-background/90 px-2 py-0.5 font-medium text-foreground backdrop-blur-md">
                          <ShieldCheck className="size-3 text-emerald-500" />
                          {relSlaHours}h SLA
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {rel.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {rel.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">
                          {relWard} • {rel.address || rel.location || "Dhaka"}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[10px]">
                        <Calendar className="size-3" />
                        {new Date(rel.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      render={
                        <Link
                          href={`/citizen/requests/${encodeURIComponent(rel.id)}`}
                        />
                      }
                      nativeButton={false}
                      className="w-full gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="size-3.5" />
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Modals — Rendered only for authenticated & authorized roles */}
      {isTicketOwner && isReopenModalOpen && (
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

      {isStaffOrAdmin && (
        <ResolveTicketModal
          ticket={ticket}
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {isAdmin && (
        <AssignStaffModal
          ticket={ticket}
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {isTicketOwner && (
        <>
          <EditTicketModal
            ticket={ticket}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => refetch()}
          />

          <DeleteTicketModal
            ticket={ticket}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onSuccess={() => {
              router.push("/citizen");
            }}
          />
        </>
      )}
    </div>
  );
}
