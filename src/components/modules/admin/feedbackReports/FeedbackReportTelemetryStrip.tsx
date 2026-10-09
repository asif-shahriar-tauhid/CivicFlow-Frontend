"use client";

import { AlertTriangle, Award, MessageSquare, Star } from "lucide-react";
import type { RequestFeedbackItem } from "@/types/feedback.types";
import { FeedbackStarRating } from "./FeedbackStarRating";

interface FeedbackReportTelemetryStripProps {
  feedbacks: RequestFeedbackItem[];
  totalFeedbacks: number;
  isLoading: boolean;
}

export function FeedbackReportTelemetryStrip({
  feedbacks,
  totalFeedbacks,
  isLoading,
}: FeedbackReportTelemetryStripProps) {
  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
        ).toFixed(1)
      : "5.0";

  const fiveStarCount = feedbacks.filter((f) => f.rating === 5).length;
  const criticalCount = feedbacks.filter((f) => f.rating <= 2).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-amber-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Citizen Satisfaction Score
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Star className="h-4 w-4 fill-amber-500" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : avgRating}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            / 5.0
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <FeedbackStarRating rating={Number(avgRating)} size="sm" />
          <span className="text-[11px] text-muted-foreground">
            overall rating
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Total Verified Reviews
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <MessageSquare className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : totalFeedbacks}
          </span>
          <span className="text-xs text-primary font-medium">
            citizens reviewed
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Post-resolution satisfaction submissions
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            5-Star Perfect Ratings
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : fiveStarCount}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            top ratings
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Delighted civic resolution experiences
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Low Satisfaction Flags
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {isLoading ? "—" : criticalCount}
          </span>
          <span className="text-xs text-destructive font-medium">
            ≤ 2 star alerts
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Candidates for field quality inspection
        </p>
      </div>
    </div>
  );
}
