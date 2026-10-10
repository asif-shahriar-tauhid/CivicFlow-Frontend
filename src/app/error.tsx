"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    // Log unexpected runtime exception to telemetry console
    console.error("[CivicFlow RootError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-3">
          <Logo size={40} />
        </div>

        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-destructive">
          Service Interruption
        </span>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Application Error Encountered
        </h1>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          An unexpected exception occurred while rendering this civic portal view.
          Your session and records remain secure.
        </p>

        {error.digest && (
          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-2 font-mono text-[11px] text-muted-foreground">
            Error Digest: <span className="text-foreground">{error.digest}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            variant="default"
            size="sm"
            onClick={() => reset()}
            className="w-full justify-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Attempt Safe Recovery</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span>Return to Municipal Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
