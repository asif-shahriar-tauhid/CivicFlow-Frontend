"use client";

import { Star } from "lucide-react";

interface FeedbackStarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function FeedbackStarRating({
  rating,
  maxStars = 5,
  size = "md",
  showNumber = false,
}: FeedbackStarRatingProps) {
  const iconSize = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-5 w-5",
  }[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const filled = idx < rating;
          return (
            <Star
              key={idx}
              className={`${iconSize} ${
                filled
                  ? "fill-amber-400 text-amber-500"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-foreground ml-1 font-mono">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
