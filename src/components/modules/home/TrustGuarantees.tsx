"use client";

import {
  ArrowRight,
  Camera,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  History,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { type Variants, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function TrustGuarantees() {
  return (
    <section
      id="accountability"
      className="w-full py-16 lg:py-24 bg-card border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Public Accountability
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built on Trust, Verified by Evidence.
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Traditional municipal portals lose reports in bureaucratic limbo.
              CivicFlow enforces deterministic safeguards that keep field
              operations honest, timely, and verifiable by citizens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="default"
              size="default"
              render={<Link href="/login?redirect=/citizen/report" />}
              nativeButton={false}
              className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Submit Grievance Now</span>
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="default"
              render={<Link href="/about-us" />}
              nativeButton={false}
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Read Citizen Charter
            </Button>
          </div>
        </motion.div>

        {/* Bento Box Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12 auto-rows-fr"
        >
          {/* Bento Tile 1 (Wide Hero Tile - 7 columns on desktop): 7-Day Reopening Right */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative md:col-span-6 lg:col-span-7 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <RotateCcw className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-primary/30 text-primary bg-background/80"
                >
                  Unconditional Citizen Veto
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                7-Day Citizen Reopening Guarantee
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">
                Municipal field crews cannot unilaterally close a ticket. If a
                pothole reappears or waste is only partially cleared, residents
                reopen the dossier with one click within 7 days—returning it
                immediately to active priority dispatch.
              </p>
            </div>

            {/* Interactive Bento Visual Pipeline */}
            <div className="mt-6 rounded-xl border border-border/80 bg-card/90 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  RESOLVED (Crew Claim)
                </span>
                <span className="text-muted-foreground">➔</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                  Citizen Inspects (7d Window)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                100% Resident Controlled
              </span>
            </div>
          </motion.div>

          {/* Bento Tile 2 (5 columns on desktop): Photographic Evidence Gate */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative md:col-span-3 lg:col-span-5 rounded-2xl border border-border bg-muted/20 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:bg-muted/35 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Camera className="size-5" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  Mandatory Proof Gate
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                Photographic Evidence Gate
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Every field resolution requires before-and-after photo
                attachments and mandatory technician investigation notes before
                the state machine permits a resolved transition.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 pt-3 border-t border-border/60 text-[11px]">
              <div className="rounded-lg border border-border bg-card p-2.5 flex items-center gap-2">
                <FileCheck2 className="size-4 text-primary shrink-0" />
                <div>
                  <span className="block font-semibold text-foreground">
                    Up to 5 Photos
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Geo-tagged intake
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-2.5 flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="block font-semibold text-foreground">
                    Repair Summary
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Required on close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Tile 3 (5 columns on desktop): Digital bKash & Invoicing */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative md:col-span-3 lg:col-span-5 rounded-2xl border border-border bg-muted/20 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:bg-muted/35 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <CreditCard className="size-5" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Tokenized Checkout
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                Digital bKash &amp; PDF Invoicing
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Excavation permits and specialized haulage requests checkout
                securely via tokenized bKash with instant transaction IDs and
                downloadable municipal PDF receipts.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Gateway Status</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                bKash Live • Instant Receipt
              </span>
            </div>
          </motion.div>

          {/* Bento Tile 4 (Wide Tile - 7 columns on desktop): Immutable Audit Trail */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative md:col-span-6 lg:col-span-7 rounded-2xl border border-border bg-gradient-to-tl from-primary/10 via-background to-background p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <History className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-border bg-card"
                >
                  <Lock className="size-3 mr-1 text-primary" />
                  Append-Only Ledger
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Immutable Cryptographic Audit Trail
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">
                Every status transition, actor email, routing rule evaluation,
                and SLA escalation timestamp is permanently recorded in an
                append-only system audit ledger for full municipal oversight.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="rounded-lg border border-border/80 bg-card/90 px-3 py-2">
                <span className="block text-[10px] text-muted-foreground">
                  STATE MACHINE
                </span>
                <span className="font-bold text-foreground">
                  5 Verified Stages
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-card/90 px-3 py-2">
                <span className="block text-[10px] text-muted-foreground">
                  ACTOR TRACEABILITY
                </span>
                <span className="font-bold text-primary">
                  Role + Timestamp
                </span>
              </div>
              <div className="rounded-lg border border-border/80 bg-card/90 px-3 py-2">
                <span className="block text-[10px] text-muted-foreground">
                  SLA GOVERNANCE
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Auto-Escalated
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
