import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted/80", className)}
      {...props}
    />
  );
}

function ServiceCardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading service card"
      className="flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs"
    >
      <div className="flex flex-col flex-1">
        {/* Image area with icon & SLA badge skeleton */}
        <div className="relative mb-4 h-36 w-full shrink-0 overflow-hidden rounded-lg bg-muted/60 p-2.5 flex items-end justify-between">
          <Skeleton className="size-8 rounded-lg bg-background/70" />
          <Skeleton className="h-5 w-20 rounded-full bg-background/70" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4 rounded-md" />

        {/* Short description 2-line skeleton */}
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-5/6 rounded" />
        </div>

        {/* Meta info grid skeleton */}
        <div className="mt-4 grid grid-cols-2 gap-1.5">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="col-span-2 h-6 w-full rounded-md" />
        </div>
      </div>

      {/* Footer "View Details" button skeleton */}
      <div className="mt-5 pt-3.5 border-t border-border/60 shrink-0">
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}

export { ServiceCardSkeleton, Skeleton };
