"use client";

import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Search,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotFound() {
  const [ticketSearch, setTicketSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;
    router.push(`/citizen/requests/${encodeURIComponent(ticketSearch.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Logo size={36} />
            <div className="flex flex-col">
              <span className="text-base font-bold leading-none tracking-tight text-foreground">
                CivicFlow
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Municipal Services
              </span>
            </div>
          </Link>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="gap-1.5 rounded-4xl text-xs"
          >
            <Home className="size-3.5" />
            <span>Home Portal</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs text-center flex flex-col items-center">
          <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Compass className="size-8" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-3.5 rounded-full bg-amber-500" />
            </span>
          </div>

          <span className="font-mono text-5xl sm:text-7xl font-extrabold tracking-tight text-primary tabular-nums">
            404
          </span>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 font-mono text-xs font-semibold text-muted-foreground">
            <ShieldAlert className="size-3 text-amber-500" />
            <span>ROUTE_STATUS: UNMAPPED_SECTOR</span>
          </span>

          <h1 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Municipal Sector or Dossier Not Found
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
            The civic route or complaint dossier ID you requested is not indexed
            in our municipal registry. The page may have moved, or the tracking
            number may contain a typo.
          </p>

          <div className="mt-8 w-full max-w-md rounded-xl border border-border bg-muted/20 p-4 text-left">
            <label
              htmlFor="ticket-input"
              className="text-xs font-semibold text-foreground block mb-1.5"
            >
              Looking for a specific complaint dossier?
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  id="ticket-input"
                  placeholder="e.g. CF-2026-0941"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="pl-8 text-xs font-mono"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={!ticketSearch.trim()}
                className="rounded-4xl text-xs shrink-0"
              >
                Find Ticket
              </Button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
            <Button
              variant="default"
              size="default"
              render={<Link href="/" />}
              nativeButton={false}
              className="gap-2 rounded-4xl shadow-xs"
            >
              <ArrowLeft className="size-4" />
              <span>Return to City Portal</span>
            </Button>

            <Button
              variant="outline"
              size="default"
              render={<Link href="/login?redirect=/citizen/report" />}
              nativeButton={false}
              className="gap-2 rounded-4xl"
            >
              <span>Report an Issue (60s)</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-10 pt-6 border-t border-border w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link
              href="/#services"
              className="hover:text-foreground transition-colors"
            >
              Core Services
            </Link>
            <span>•</span>
            <Link
              href="/#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <span>•</span>
            <Link
              href="/#telemetry"
              className="hover:text-foreground transition-colors"
            >
              Live Telemetry
            </Link>
            <span>•</span>
            <Link
              href="/about-us"
              className="hover:text-foreground transition-colors"
            >
              About CivicFlow
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CivicFlow Public Intake & Verification Engine</span>
          <span className="font-mono text-[11px]">
            Municipal Hotline: 333 / 16100 • Nagar Bhaban Central Dispatch
          </span>
        </div>
      </footer>
    </div>
  );
}
