"use client";

import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { type Variants, motion } from "framer-motion";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceCardSkeleton } from "@/components/ui/skeleton";
import { useGetPublicServiceRequests } from "@/hooks/request.hooks";
import type { RequestPriority, RequestStatus } from "@/types/request.types";

export interface PublicIssueCardItem {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  categoryName: string;
  departmentName: string;
  ward: string;
  address: string;
  status: RequestStatus;
  priority: RequestPriority;
  slaLabel: string;
  createdAt: string;
  image: string;
}

export function resolveCategoryImage(categoryName?: string): string {
  const lower = (categoryName || "").toLowerCase();
  if (lower.includes("drain") || lower.includes("water")) {
    return "/images/service-drainage.webp";
  }
  if (lower.includes("light") || lower.includes("electric")) {
    return "/images/service-lighting.webp";
  }
  if (
    lower.includes("waste") ||
    lower.includes("garbage") ||
    lower.includes("demolition")
  ) {
    return "/images/service-waste.webp";
  }
  return "/images/service-roads.webp";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

interface RecentPublicIssuesSectionProps {
  onInspectTicket: (ticketNumber: string) => void;
}

export default function RecentPublicIssuesSection({
  onInspectTicket,
}: RecentPublicIssuesSectionProps) {
  const { data: requestsRes, isLoading } = useGetPublicServiceRequests();

  const displayIssues: PublicIssueCardItem[] = useMemo(() => {
    const raw = requestsRes?.data;
    if (!Array.isArray(raw) || raw.length === 0) {
      return [];
    }

    // FIFO order: First-In, First-Out (oldest createdAt first), single row of 3 cards
    const fifoSorted = [...raw]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .slice(0, 3);

    return fifoSorted.map((req) => ({
      id: req.id,
      requestNumber: req.requestNumber || "CIV-2026",
      title: req.title,
      description: req.description,
      categoryName: req.category?.name || "Municipal Service",
      departmentName: req.department?.name || "Municipal Dispatch",
      ward: req.ward ? (req.ward.toLowerCase().startsWith("ward") ? req.ward : `Ward ${req.ward}`) : "Ward 04",
      address: req.address || req.location || "Dhaka Municipal Zone",
      status: req.status,
      priority: req.priority || "NORMAL",
      slaLabel: req.category?.slaMinutes
        ? `${Math.max(1, Math.round(req.category.slaMinutes / 60))}h SLA`
        : "24h SLA",
      createdAt: new Date(req.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      image:
        req.attachments?.[0]?.url ||
        req.attachments?.[0]?.fileUrl ||
        resolveCategoryImage(req.category?.name),
    }));
  }, [requestsRes]);

  return (
    <section
      id="recent-issues"
      className="w-full py-16 lg:py-20 bg-background border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Ward Ledger (FIFO Queue)</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Recent Public Grievances &amp; Resolutions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Real-time municipal dossiers fetched directly from the backend
              ledger in First-In, First-Out (FIFO) dispatch sequence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <span>Explore all grievances</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() =>
                onInspectTicket(
                  displayIssues[0]?.requestNumber || "CIV-2026-06303370",
                )
              }
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <span>Track by ID</span>
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {[1, 2, 3].map((skeleton) => (
              <ServiceCardSkeleton key={skeleton} />
            ))}
          </div>
        ) : displayIssues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
            No public grievances found in the ledger.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
          >
            {displayIssues.map((issue) => (
              <motion.div
                key={issue.id}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col flex-1">
                  <div className="relative mb-3.5 h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={issue.image}
                      alt={issue.title}
                      fill
                      unoptimized
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    <div className="absolute top-2.5 left-2.5">
                      <StatusBadge status={issue.status} />
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <PriorityBadge priority={issue.priority} />
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
                      <span className="rounded bg-background/90 px-2 py-0.5 font-bold text-primary backdrop-blur-md">
                        {issue.requestNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-background/90 px-2 py-0.5 font-medium text-foreground backdrop-blur-md">
                        <ShieldCheck className="size-3 text-emerald-500" />
                        {issue.slaLabel}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {issue.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="mt-3.5 space-y-1.5 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 truncate font-medium text-foreground">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">
                          {issue.ward} • {issue.address}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 truncate">
                        <Clock className="size-3 text-amber-500 shrink-0" />
                        <span className="truncate">{issue.categoryName}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[10px]">
                        <Calendar className="size-3 text-muted-foreground" />
                        {issue.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 shrink-0">
                  <Button
                    variant="default"
                    size="sm"
                    render={
                      <Link
                        href={`/citizen/requests/${encodeURIComponent(issue.id)}`}
                      />
                    }
                    nativeButton={false}
                    className="w-full gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="size-3.5" />
                    <span>View Details</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
