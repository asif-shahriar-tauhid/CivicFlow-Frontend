"use client";

import {
  Activity,
  CheckCircle2,
  FileSearch,
  MapPin,
  Send,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Variants, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onSearchTicket: (ticketId: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HeroSection({ onSearchTicket }: HeroSectionProps) {
  const [ticketInput, setTicketInput] = useState("");
  const _router = useRouter();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    onSearchTicket(ticketInput.trim());
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Dynamic ambient aurora background */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.15, 0.28, 0.15],
          x: ["-50%", "-48%", "-50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[700px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #75D8FC 0%, #0072E5 60%, transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live Municipal Stream</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">24/7 Operations</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.12]"
          >
            Your City, In Real Time. <br className="hidden sm:inline" />
            <span className="text-primary">Report, Track, and Resolve</span>{" "}
            Municipal Issues.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Fast geo-tagged civic complaint intake, automated ward routing, and
            guaranteed SLA resolution for roads, lighting, water, and
            sanitation.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <form
              id="track"
              onSubmit={handleTrackSubmit}
              className="flex w-full sm:flex-1 items-center rounded-full border border-input bg-card p-1 shadow-xs transition-all focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:shadow-md"
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
                className="rounded-full bg-muted/60 hover:bg-muted font-medium px-4 text-xs shrink-0 transition-transform active:scale-95"
              >
                Track
              </Button>
            </form>

            <Button
              variant="default"
              size="default"
              render={<Link href="/login?redirect=/citizen/report" />}
              nativeButton={false}
              className="w-full sm:w-auto shrink-0 gap-2 px-6 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="size-4" />
              <span className="font-semibold">Report an Issue (60s)</span>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <CheckCircle2 className="size-3.5 text-primary" />
              No account required to track
            </span>
            <span className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <MapPin className="size-3.5 text-primary" />
              Auto GPS & photo verification
            </span>
            <span className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <FileSearch className="size-3.5 text-primary" />
              Public transparency records
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg group"
          >
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden">
              <Image
                src="/images/hero-civic.webp"
                alt="Civic municipal operations and smart infrastructure in action"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              {/* Floating live HUD Overlay card */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/85 p-3.5 backdrop-blur-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Activity className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">
                      Active Ward Deployment Grid
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Solar grid sensors, automated dispatch, and field
                      resolution crews
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    94.6% On-Time SLA
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
