"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PublicErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: PublicErrorProps) {
  useEffect(() => {
    console.error("[CivicFlow PublicError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
          Public Portal Notice
        </span>

        <h2 className="mt-2 text-lg font-bold text-foreground">
          Unable to Load Requested Resource
        </h2>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          A temporary network or rendering error occurred. Please refresh or try again.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            variant="default"
            size="sm"
            onClick={() => reset()}
            className="w-full justify-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span>Return to Homepage</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
