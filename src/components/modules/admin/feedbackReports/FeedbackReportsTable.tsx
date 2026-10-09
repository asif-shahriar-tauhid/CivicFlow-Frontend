"use client";

import { Building2, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RequestFeedbackItem } from "@/types/feedback.types";
import { FeedbackStarRating } from "./FeedbackStarRating";

interface FeedbackReportsTableProps {
  feedbacks: RequestFeedbackItem[];
  onInspect: (feedback: RequestFeedbackItem) => void;
  isLoading: boolean;
}

export function FeedbackReportsTable({
  feedbacks,
  onInspect,
  isLoading,
}: FeedbackReportsTableProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-foreground">
          No Feedback Submissions Found
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No citizen satisfaction ratings match your filter criteria. Try
          clearing the star filter or adjusting keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Citizen Feedback Narrative</th>
              <th className="py-3.5 px-4">Service Incident</th>
              <th className="py-3.5 px-4">Division</th>
              <th className="py-3.5 px-4">Submitted By</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {feedbacks.map((fb) => {
              const formattedDate = new Date(fb.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              );

              return (
                <tr
                  key={fb.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <FeedbackStarRating
                      rating={fb.rating}
                      size="sm"
                      showNumber
                    />
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p
                      className="text-foreground line-clamp-2 leading-relaxed"
                      title={fb.comment || "No comment"}
                    >
                      {fb.comment ? (
                        fb.comment
                      ) : (
                        <span className="italic text-muted-foreground/60">
                          Rating only (no written review)
                        </span>
                      )}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {fb.request ? (
                      <div className="space-y-0.5 max-w-[180px]">
                        <span className="font-mono font-bold text-foreground truncate block">
                          {fb.request.requestNumber}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {fb.request.title}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-muted-foreground">
                        {fb.requestId.slice(0, 8)}...
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[120px]">
                        {fb.request?.department?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5 max-w-[140px]">
                      <span className="font-medium text-foreground truncate block">
                        {fb.request?.citizen?.name || "Citizen"}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate block">
                        {fb.request?.citizen?.email || "—"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground text-[11px]">
                    {formattedDate}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onInspect(fb)}
                      className="h-7 px-2.5 text-xs gap-1 border-border/70 hover:bg-muted"
                      title="Inspect full feedback details"
                    >
                      <Eye className="h-3 w-3 text-primary" />
                      <span>Review</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
