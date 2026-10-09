"use client";

import { Building2, ExternalLink, Quote, Star, Tag, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RequestFeedbackItem } from "@/types/feedback.types";
import { FeedbackStarRating } from "./FeedbackStarRating";

interface FeedbackDetailModalProps {
  feedback: RequestFeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
}: FeedbackDetailModalProps) {
  if (!isOpen || !feedback) return null;

  const formattedDate = new Date(feedback.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-emerald-500 to-primary" />

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                <Star className="h-5 w-5 fill-amber-500" />
              </div>
              <div>
                <h3
                  id="feedback-modal-title"
                  className="font-bold text-base text-foreground"
                >
                  Citizen Review Inspection
                </h3>
                <div className="mt-0.5 flex items-center gap-2">
                  <FeedbackStarRating
                    rating={feedback.rating}
                    size="sm"
                    showNumber
                  />
                  <span className="text-xs text-muted-foreground">
                    • {formattedDate}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2">
            <Quote className="h-6 w-6 text-muted-foreground/30 absolute top-3 right-3 pointer-events-none" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              Citizen Commentary
            </span>
            <p className="text-sm text-foreground leading-relaxed italic">
              {feedback.comment
                ? `"${feedback.comment}"`
                : "No written narrative provided with rating."}
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {feedback.request && (
              <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">
                    {feedback.request.requestNumber}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {feedback.request.status}
                  </Badge>
                </div>
                <p className="font-medium text-foreground line-clamp-1">
                  {feedback.request.title}
                </p>
                <div className="flex items-center gap-3 text-muted-foreground text-[11px] pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {feedback.request.department?.name || "Unassigned"}
                  </span>
                  {feedback.request.category?.name && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {feedback.request.category.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 font-bold text-xs">
                  {feedback.request?.citizen?.name
                    ? feedback.request.citizen.name.charAt(0).toUpperCase()
                    : "C"}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {feedback.request?.citizen?.name || "Anonymous Citizen"}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {feedback.request?.citizen?.email || "No email on record"}
                  </div>
                </div>
              </div>

              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium shrink-0 ml-2"
              >
                <span>View Ticket</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
