"use client";

import {
  AlertCircle,
  Clock,
  FileText,
  HardHat,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useAddInvestigationNote } from "@/hooks/request.hooks";
import type {
  RequestInvestigationNote,
  ServiceRequest,
} from "@/types/request.types";

interface InvestigationNotesCardProps {
  ticket: ServiceRequest;
  onNoteAdded?: () => void;
  className?: string;
}

const NOTE_TEMPLATES = [
  { label: "Site Inspection", prefix: "Site Inspection: " },
  { label: "Machinery Deployed", prefix: "Heavy Equipment Deployed: " },
  { label: "Citizen Contact", prefix: "Citizen Contacted: " },
  { label: "Obstruction Cleared", prefix: "Obstruction Cleared: " },
];

export function InvestigationNotesCard({
  ticket,
  onNoteAdded,
  className = "",
}: InvestigationNotesCardProps) {
  const { role, user } = useCurrentUser();
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: addNote, isPending } = useAddInvestigationNote();

  const isStaffOrAdmin = role === "STAFF" || role === "ADMIN";
  const notes: RequestInvestigationNote[] = ticket.investigationNotes || [];

  // Check department authorization if staff
  const isAuthorized =
    role === "ADMIN" ||
    (role === "STAFF" &&
      (!ticket.departmentId ||
        !user?.departmentId ||
        ticket.departmentId === user.departmentId));

  const handleTemplateClick = (prefix: string) => {
    if (!note.startsWith(prefix)) {
      setNote((prev) => (prev ? `${prefix}${prev}` : prefix));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = note.trim();
    if (!trimmed) {
      setErrorMsg("Please enter an investigation note before submitting.");
      return;
    }

    if (trimmed.length > 5000) {
      setErrorMsg("Investigation note cannot exceed 5,000 characters.");
      return;
    }

    addNote(
      { requestId: ticket.id, note: trimmed },
      {
        onSuccess: () => {
          gooeyToast.success("Field Note Logged", {
            description: `Investigation log recorded for ticket ${ticket.requestNumber}.`,
          });
          setNote("");
          onNoteAdded?.();
        },
        onError: (err: any) => {
          const msg =
            err?.data?.message ||
            err?.message ||
            "Failed to submit investigation note.";
          setErrorMsg(msg);
          gooeyToast.error("Submission Failed", { description: msg });
        },
      },
    );
  };

  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>Field Crew Investigation Logs</span>
              <Badge
                variant="outline"
                className="text-[11px] font-mono h-5 px-1.5"
              >
                {notes.length}
              </Badge>
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Official on-site logs and field crew observations
            </p>
          </div>
        </div>

        {isStaffOrAdmin && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
            {role === "ADMIN" ? "Admin Desk" : "Staff Field Log"}
          </span>
        )}
      </div>

      {/* Notes Feed */}
      <div className="flex flex-col gap-3">
        {notes.length > 0 ? (
          notes.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-muted/20 p-3.5 text-xs transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <div className="size-5 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <HardHat className="size-3" />
                  </div>
                  <span>{item.actor?.name || "Field Officer"}</span>
                  {item.actor?.role && (
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase tracking-wider font-mono h-4 px-1 py-0 text-muted-foreground"
                    >
                      {item.actor.role}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="size-3 text-muted-foreground/70" />
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap pl-6.5 text-xs">
                {item.note}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-border/80 bg-muted/10">
            <FileText className="size-8 text-muted-foreground/40 mb-1.5" />
            <p className="text-xs font-semibold text-foreground">
              No Investigation Logs Recorded Yet
            </p>
            <p className="text-[11px] text-muted-foreground max-w-sm mt-0.5 leading-relaxed">
              {isStaffOrAdmin
                ? "Use the dispatch form below to record on-site findings, machinery deployment, or citizen communication logs."
                : "Field crew inspection notes and on-site updates will appear here once technicians document progress."}
            </p>
          </div>
        )}
      </div>

      {/* Staff Submission Form (Staff & Admin only) */}
      {isStaffOrAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-2 rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Plus className="size-3.5 text-primary" />
              <span>Record Field Investigation Entry</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {note.length} / 5000
            </span>
          </div>

          {/* Quick Template Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mr-1">
              <Sparkles className="size-2.5 text-primary" />
              <span>Quick tags:</span>
            </span>
            {NOTE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => handleTemplateClick(tmpl.prefix)}
                className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                + {tmpl.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <Textarea
            rows={3}
            placeholder={
              isAuthorized
                ? "Document on-site observations, machinery deployed, water levels, or communication with citizen..."
                : "You cannot post notes for tickets outside your department."
            }
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            disabled={isPending || !isAuthorized}
            className="text-xs resize-none min-h-[76px]"
          />

          {/* Error alert */}
          {errorMsg && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 flex items-start gap-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit button */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-muted-foreground">
              Entries are permanently logged to the municipal audit history.
            </p>

            <Button
              type="submit"
              size="sm"
              disabled={isPending || !note.trim() || !isAuthorized}
              className="gap-1.5 rounded-4xl text-xs h-8 px-3.5"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3" />
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <Send className="size-3" />
                  <span>Log Note</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
