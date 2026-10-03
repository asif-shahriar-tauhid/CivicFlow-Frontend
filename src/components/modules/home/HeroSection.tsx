"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  MapPin,
  Send,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeroSectionProps {
  onSearchTicket: (ticketId: string) => void;
}

export default function HeroSection({ onSearchTicket }: HeroSectionProps) {
  const [ticketInput, setTicketInput] = useState("");
  const router = useRouter();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    onSearchTicket(ticketInput.trim());
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background radial accent glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #75D8FC 0%, #0072E5 60%, transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Live Operational Status Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live Municipal Stream</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">24/7 Operations</span>
          </div>

          {/* Main Headline */}
          <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            Your City, In Real Time. <br className="hidden sm:inline" />
            <span className="text-primary">Report, Track, and Resolve</span>{" "}
            Municipal Issues.
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Fast geo-tagged civic complaint intake, automated ward routing, and
            guaranteed SLA resolution for roads, lighting, water, and
            sanitation.
          </p>

          {/* Dual Action Container */}
          <div className="mt-8 flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Quick Ticket Tracking Input */}
            <form
              onSubmit={handleTrackSubmit}
              className="flex w-full sm:flex-1 items-center rounded-full border border-input bg-card p-1 shadow-xs transition-all focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20"
            >
              <div className="flex items-center pl-3.5 pr-2 text-muted-foreground">
                <Ticket className="size-4 shrink-0" />
              </div>
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="Enter Ticket ID (e.g. CF-2026-0941)"
                className="w-full bg-transparent pr-2 text-sm text-foreground outline-none placeholder:text-muted-foreground font-mono"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="rounded-full bg-muted/60 hover:bg-muted font-medium px-4 text-xs shrink-0"
              >
                Track
              </Button>
            </form>

            {/* Primary Action Button */}
            <Button
              variant="default"
              size="default"
              render={<Link href="/login?redirect=/citizen/report" />}
              nativeButton={false}
              className="w-full sm:w-auto shrink-0 gap-2 px-6 shadow-sm"
            >
              <Send className="size-4" />
              <span className="font-semibold">Report an Issue (60s)</span>
            </Button>
          </div>

          {/* Supporting Micro-Proof Cues */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              No account required to track
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              Auto GPS & photo verification
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileSearch className="size-3.5 text-primary" />
              Public transparency records
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
