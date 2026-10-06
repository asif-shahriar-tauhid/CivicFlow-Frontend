import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";
import type { RequestPriority, RequestStatus } from "@/types/request.types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 h-6 px-2.5 rounded-4xl text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default: "border border-border bg-muted/50 text-foreground",
        primary: "border border-primary/20 bg-primary/10 text-primary",
        outline: "border border-border bg-transparent text-muted-foreground",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive",
        success:
          "border border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        warning:
          "border border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
        info: "border border-sky-500/20 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string;
}

function Badge({
  className,
  variant,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dotColor && (
        <span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
      )}
      <span>{children}</span>
    </div>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: RequestStatus;
  className?: string;
}) {
  switch (status) {
    case "RESOLVED":
    case "CLOSED":
      return (
        <Badge
          variant="success"
          dotColor="bg-emerald-500"
          className={className}
        >
          {status === "CLOSED" ? "Verified & Closed" : "Resolved"}
        </Badge>
      );
    case "IN_PROGRESS":
    case "ASSIGNED":
      return (
        <Badge
          variant="info"
          dotColor="bg-sky-500 animate-pulse"
          className={className}
        >
          {status === "IN_PROGRESS" ? "In Field Work" : "Assigned"}
        </Badge>
      );
    case "TRIAGED":
    case "AWAITING_CITIZEN":
    case "ON_HOLD":
    case "REOPENED":
      return (
        <Badge variant="warning" dotColor="bg-amber-500" className={className}>
          {status === "AWAITING_CITIZEN"
            ? "Action Required"
            : status === "REOPENED"
              ? "Reopened (7d)"
              : status === "ON_HOLD"
                ? "On Hold"
                : "Triaged"}
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="destructive"
          dotColor="bg-rose-500"
          className={className}
        >
          Rejected
        </Badge>
      );
    case "SUBMITTED":
    default:
      return (
        <Badge variant="outline" dotColor="bg-slate-400" className={className}>
          Submitted
        </Badge>
      );
  }
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: RequestPriority;
  className?: string;
}) {
  switch (priority) {
    case "URGENT":
      return (
        <Badge
          variant="destructive"
          dotColor="bg-red-500"
          className={className}
        >
          Urgent
        </Badge>
      );
    case "HIGH":
      return (
        <Badge variant="warning" dotColor="bg-amber-500" className={className}>
          High
        </Badge>
      );
    case "LOW":
      return (
        <Badge variant="outline" dotColor="bg-slate-400" className={className}>
          Low
        </Badge>
      );
    case "NORMAL":
    default:
      return (
        <Badge variant="default" dotColor="bg-sky-400" className={className}>
          Normal
        </Badge>
      );
  }
}

export { Badge, badgeVariants };
