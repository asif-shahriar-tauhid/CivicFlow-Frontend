"use client";

import Logo from "@/asset/svg/Logo";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock4,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  mode: "login" | "register" | "verify";
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  mode,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-12 bg-background">
      {/* Left: Form Viewport */}
      <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 xl:col-span-5 lg:p-12">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <Logo size={32} />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
                CivicFlow
              </span>
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Municipal Services
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to City Portal</span>
          </Link>
        </div>

        {/* Center: Auth Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-8">
          <div className="mb-6 flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Bottom Security / Privacy Note */}
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Secure Municipal Encryption</span>
          </span>
          <span className="font-mono text-xs">Auth v1.0 • TLS 1.3</span>
        </div>
      </div>

      {/* Right: Architectural Civic Showcase Panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-l border-border bg-muted/20 p-12 lg:col-span-6 xl:col-span-7">
        {/* Real Civic Skyline WebP Image Backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/auth-skyline.webp"
            alt="Civic panoramic municipal skyline"
            fill
            priority
            className="object-cover object-center opacity-25 dark:opacity-20"
            sizes="(max-width: 1200px) 50vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </div>

        {/* Subtle geometric background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top telemetry badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live City Operations Feed</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Ward 1–12 Active
          </span>
        </div>

        {/* Center: Miniature Telemetry & Flow Showcase Card */}
        <div className="relative z-10 my-auto flex flex-col gap-6 max-w-lg mx-auto w-full">
          {/* Main Statement */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl leading-tight">
              A single, transparent conduit for urban governance.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              CivicFlow eliminates lost paper trails. Every complaint is tracked
              against deterministic SLAs with photographic evidence gates and
              citizen closure rights.
            </p>
          </div>

          {/* Interactive Miniature Ticket Simulation */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-foreground">
                  CF-2026-0941
                </span>
                <span className="rounded-full bg-sky-100 dark:bg-sky-950 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
                  IN_PROGRESS
                </span>
              </div>
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
                <Clock4 className="size-3" />
                <span>SLA: 18h left</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-foreground">
              Damaged street lighting pole near Ward 4 public garden
            </p>

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3 text-muted-foreground" />
                Ward 4, Sector 7
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="size-3" />
                Crew Dispatched
              </span>
            </div>
          </div>

          {/* Micro Stat Highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums">
                94.6%
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                SLA Compliance Rate across all municipal categories
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums">
                7 Days
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Citizen reopening protection on every completed ticket
              </p>
            </div>
          </div>
        </div>

        {/* Bottom quotation */}
        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Municipal Ordinance No. 2026-CF</span>
          <span>Verified Citizen Protection</span>
        </div>
      </div>
    </div>
  );
}
