"use client";

import { AlertTriangle, ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[CivicFlow DashboardError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>

        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
          Dashboard View Error
        </span>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          Unable to Load Operations Desk
        </h2>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          A processing error occurred while fetching operational data or preparing this view.
          Your previous actions remain safely saved.
        </p>

        {error.message && (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-left">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Error Details:
            </span>
            <p className="font-mono text-xs text-foreground break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            variant="default"
            size="sm"
            onClick={() => reset()}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry Desk Action</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Public Portal</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
