"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteServiceRequest } from "@/hooks/request.hooks";
import type { ServiceRequest } from "@/types/request.types";

interface DeleteTicketModalProps {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteTicketModal({
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: DeleteTicketModalProps) {
  const { mutate: deleteRequest, isPending: isDeleting } =
    useDeleteServiceRequest();

  if (!isOpen || !ticket) return null;

  const handleDelete = () => {
    deleteRequest(ticket.id, {
      onSuccess: () => {
        gooeyToast.success("Ticket Cancelled", {
          description: `Grievance ${ticket.requestNumber || "ticket"} has been successfully withdrawn.`,
        });
        onSuccess?.();
        onClose();
      },
      onError: (err: Error) => {
        gooeyToast.error("Cancellation Failed", {
          description:
            err.message ||
            "Could not cancel ticket. Tickets can only be cancelled while in Submitted status.",
        });
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-destructive/25 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="alertdialog"
        aria-labelledby="delete-ticket-title"
        aria-describedby="delete-ticket-description"
        aria-modal="true"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-destructive via-red-500 to-amber-500" />

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3
                  id="delete-ticket-title"
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  Cancel Civic Request?
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {ticket.requestNumber || "TICKET"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <p className="font-semibold text-foreground line-clamp-2">
              {ticket.title}
            </p>
            {ticket.address && (
              <p className="text-[11px] text-muted-foreground truncate">
                📍 {ticket.address}
              </p>
            )}
          </div>

          <p
            id="delete-ticket-description"
            className="text-xs text-muted-foreground leading-relaxed"
          >
            Are you sure you want to cancel this grievance? Once withdrawn, it
            will be permanently removed from the municipal triage desk. This
            action cannot be undone.
          </p>
        </div>

        <div className="border-t border-border px-6 py-3.5 bg-muted/20 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-4xl px-4 text-xs"
          >
            Keep Ticket
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 rounded-4xl px-4 text-xs font-semibold shadow-xs"
          >
            {isDeleting ? (
              <>
                <Spinner className="size-3.5" />
                <span>Cancelling...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Yes, Cancel Ticket</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
