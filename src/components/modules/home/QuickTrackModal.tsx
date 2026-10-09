"use client";

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface QuickTrackModalProps {
  ticketId: string | null;
  onClose: () => void;
}

export default function QuickTrackModal({
  ticketId,
  onClose,
}: QuickTrackModalProps) {
  if (!ticketId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Municipal Ticket Telemetry
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Tracking ID: {ticketId.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Current Status
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
              <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
              IN_PROGRESS
            </span>
          </div>

          <div className="border-t border-border/60 pt-3">
            <p className="text-sm font-medium text-foreground">
              Municipal Crew Assigned to Ward 4 Sector
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5 text-muted-foreground" />
                Ward 4, Sector 7
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5 text-amber-500" />
                SLA: 18h remaining
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Progress Milestones:
          </span>
          <div className="flex items-center justify-between text-xs font-medium text-foreground px-2 py-1 bg-muted/20 rounded-lg">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              1. Submitted
            </span>
            <span>➔</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              2. Triaged
            </span>
            <span>➔</span>
            <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1 font-bold">
              3. In Field Work
            </span>
            <span>➔</span>
            <span className="text-muted-foreground">4. Verification</span>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
          <p>
            Log in to your <strong>Citizen Portal</strong> to view attached
            field photos, inspect technician notes, and confirm resolution.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            variant="default"
            size="sm"
            render={<Link href="/login?redirect=/citizen" />}
            nativeButton={false}
            className="w-full sm:w-auto gap-1.5"
          >
            <span>Open Citizen Portal</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
