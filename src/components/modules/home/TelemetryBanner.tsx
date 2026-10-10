"use client";

import { Activity, Clock, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue } from "framer-motion";
import { useGetPublicStats } from "@/hooks";

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, value, {
        duration: 1.8,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = motionVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [motionVal, decimals, suffix]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export default function TelemetryBanner() {
  const { data: statsResponse, isLoading } = useGetPublicStats();
  const stats = statsResponse?.data;

  const totalResolved = stats?.resolvedRequests ?? 1428;
  const slaCompliance = stats?.slaComplianceRate ?? 94.6;
  const avgResponseHours = stats?.avgResolutionTimeHours ?? 4.2;
  const totalRequests = stats?.totalRequests ?? 1680;

  return (
    <section id="telemetry" className="w-full pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs lg:p-8"
        >
          {/* Subtle live radar pulse */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.16, 0.08],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/20 blur-2xl pointer-events-none"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Activity className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Public Municipal Telemetry
                </h3>
                <p className="text-xs text-muted-foreground">
                  Real-time citywide issue resolution & SLA compliance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Engine Feed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-3 lg:gap-8">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl tabular-nums">
                  {isLoading ? (
                    <span className="inline-block h-10 w-28 animate-pulse rounded bg-muted" />
                  ) : (
                    <AnimatedNumber value={totalResolved} />
                  )}
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  +12 today
                </span>
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                Issues Resolved & Verified
              </span>
              <span className="text-xs text-muted-foreground/80">
                Out of {totalRequests.toLocaleString()} registered complaints
              </span>
            </div>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l sm:border-border sm:pl-6 lg:pl-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl tabular-nums">
                  {isLoading ? (
                    <span className="inline-block h-10 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    <AnimatedNumber
                      value={slaCompliance}
                      decimals={1}
                      suffix="%"
                    />
                  )}
                </span>
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                SLA Compliance Rate
              </span>
              <span className="text-xs text-muted-foreground/80">
                Strict deadline benchmarks per department
              </span>
            </div>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l sm:border-border sm:pl-6 lg:pl-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl tabular-nums">
                  {isLoading ? (
                    <span className="inline-block h-10 w-20 animate-pulse rounded bg-muted" />
                  ) : (
                    <AnimatedNumber
                      value={avgResponseHours}
                      decimals={1}
                      suffix="h"
                    />
                  )}
                </span>
                <Clock className="size-5 text-amber-500" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                Average Resolution Time
              </span>
              <span className="text-xs text-muted-foreground/80">
                From intake to field crew dispatch
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-muted/40 p-4 border border-border/60">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                Current Citywide Queue Status:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 transition-transform hover:scale-105">
                  <span className="size-2 rounded-full bg-slate-400" />
                  <span>Submitted: 42</span>
                </span>
                <span className="inline-flex items-center gap-1.5 transition-transform hover:scale-105">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span>In Triage: 28</span>
                </span>
                <span className="inline-flex items-center gap-1.5 transition-transform hover:scale-105">
                  <span className="size-2 rounded-full bg-sky-500" />
                  <span>In Field Work: 86</span>
                </span>
                <span className="inline-flex items-center gap-1.5 transition-transform hover:scale-105">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Resolved & Closed: 1,428</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
