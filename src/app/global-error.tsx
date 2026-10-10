"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[CivicFlow GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-neutral-900 p-6 sm:p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertOctagon className="size-6" />
          </div>

          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-red-400">
            Critical System Halt
          </span>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Municipal Portal Exception
          </h1>

          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
            A root-level system error prevented this page from loading. Please reload the interface to restore services.
          </p>

          {error.digest && (
            <p className="mt-4 font-mono text-[11px] text-neutral-500">
              Digest: {error.digest}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <RefreshCw className="size-3.5" />
              <span>Restart Application</span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-4 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <span>Return to Home Portal</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
