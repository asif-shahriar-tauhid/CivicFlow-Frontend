"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Layers,
  MapPin,
  Send,
  ShieldCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { ServiceCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetPublicServiceRequestById,
  useGetPublicServiceRequests,
} from "@/hooks/request.hooks";
import {
  findCatalogItemByIdOrCode,
  PUBLIC_CATALOG_ITEMS,
  type PublicCatalogItem,
  type PublicCatalogReview,
} from "@/lib/constants/publicCatalog";

function getCategoryImages(categoryName?: string) {
  const normalized = (categoryName || "").toLowerCase();
  if (normalized.includes("light") || normalized.includes("electr")) {
    return [
      {
        url: "/images/service-lighting.webp",
        caption: "Municipal streetlighting & electrical inspection view",
      },
      {
        url: "/images/auth-skyline.webp",
        caption: "Ward night illumination corridor verification",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "CivicFlow central dispatch telemetry",
      },
    ];
  }
  if (
    normalized.includes("drain") ||
    normalized.includes("water") ||
    normalized.includes("sewer")
  ) {
    return [
      {
        url: "/images/service-drainage.webp",
        caption: "Stormwater culvert & drainage inspection site",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Hydraulic jetting & de-silting dispatch log",
      },
      {
        url: "/images/service-roads.webp",
        caption: "Adjacent arterial surface condition check",
      },
    ];
  }
  if (
    normalized.includes("road") ||
    normalized.includes("pothole") ||
    normalized.includes("construct")
  ) {
    return [
      {
        url: "/images/service-roads.webp",
        caption: "Arterial corridor & civil infrastructure inspection",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Municipal civil engineering dispatch unit",
      },
      {
        url: "/images/service-waste.webp",
        caption: "Right-of-way debris & corridor clearance audit",
      },
    ];
  }
  return [
    {
      url: "/images/service-waste.webp",
      caption: "Municipal field sanitation & ward inspection view",
    },
    {
      url: "/images/hero-civic.webp",
      caption: "CivicFlow automated ward dispatch telemetry",
    },
    {
      url: "/images/service-roads.webp",
      caption: "Corridor verification & public right-of-way check",
    },
  ];
}

export default function PublicExploreDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const rawId = (params?.id as string) || "waste";
  const isIssueRoute = pathname.startsWith("/explore/issues/");

  const staticMatch = useMemo(
    () => (isIssueRoute ? undefined : findCatalogItemByIdOrCode(rawId)),
    [isIssueRoute, rawId],
  );

  // Query backend API whenever the ID is not one of the known static slugs
  const shouldFetchApi = Boolean(rawId && !staticMatch);
  const {
    data: apiResponse,
    isLoading: isApiLoading,
    isError: isApiError,
  } = useGetPublicServiceRequestById(shouldFetchApi ? rawId : "");

  const { data: publicListResponse } = useGetPublicServiceRequests();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [localReviews, setLocalReviews] = useState<PublicCatalogReview[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerWard, setReviewerWard] = useState("Ward 15 • Dhanmondi");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const item: PublicCatalogItem | null = useMemo(() => {
    if (staticMatch) return staticMatch;

    const apiTicket = apiResponse?.data;
    if (apiTicket) {
      const slaHours = apiTicket.category?.slaMinutes
        ? Math.max(1, Math.round(Number(apiTicket.category.slaMinutes) / 60))
        : 24;
      const feeAmount = Number(apiTicket.category?.feeAmount ?? 0);
      const uploadedImages =
        apiTicket.attachments
          ?.map((att, idx) => ({
            url: att.url || att.fileUrl || "/images/hero-civic.webp",
            caption:
              att.caption || att.fileName || `Field Evidence Photo #${idx + 1}`,
          }))
          .filter((img) => Boolean(img.url)) || [];

      const historyParagraphs =
        apiTicket.statusHistory && apiTicket.statusHistory.length > 0
          ? apiTicket.statusHistory.map(
              (h) =>
                `Lifecycle Event (${new Date(h.createdAt).toLocaleString()}): ${h.fromStatus ? `${h.fromStatus} → ` : ""}${h.toStatus}${h.reason ? ` — "${h.reason}"` : ""}${h.actor?.name ? ` [Verified by ${h.actor.name}]` : ""}`,
            )
          : [];

      const noteParagraphs =
        apiTicket.investigationNotes && apiTicket.investigationNotes.length > 0
          ? apiTicket.investigationNotes.map(
              (n) =>
                `Field Investigation Note (${new Date(n.createdAt).toLocaleDateString()}): "${n.note}"${n.actor?.name ? ` — ${n.actor.name}` : ""}`,
            )
          : [];

      return {
        id: apiTicket.id,
        code: apiTicket.requestNumber || "CIV-2026-LIVE",
        type: "PUBLIC_DOSSIER",
        title: apiTicket.title,
        shortDescription: apiTicket.description,
        overview: [
          apiTicket.description,
          apiTicket.resolutionSummary || apiTicket.resolution?.reason
            ? `Resolution Summary: ${apiTicket.resolutionSummary || apiTicket.resolution?.reason}`
            : `Registered under ${apiTicket.category?.name || "Municipal Operations"} and routed to ${apiTicket.department?.name || "Municipal Operations Division"} with a ${slaHours}-hour SLA target.`,
          ...historyParagraphs,
          ...noteParagraphs,
        ],
        categoryId: apiTicket.category?.id || apiTicket.categoryId || "waste",
        categoryName: apiTicket.category?.name || "Municipal Grievance",
        departmentName:
          apiTicket.department?.name || "Municipal Operations Division",
        ward: apiTicket.ward
          ? `Ward ${apiTicket.ward}${apiTicket.zone ? ` • ${apiTicket.zone}` : ""}`
          : apiTicket.zone || "Municipal Ward",
        address:
          apiTicket.address ||
          apiTicket.location ||
          apiTicket.landmark ||
          "Dhaka Municipal Jurisdiction",
        coordinates:
          apiTicket.latitude && apiTicket.longitude
            ? `${apiTicket.latitude}° N, ${apiTicket.longitude}° E`
            : "23.7806° N, 90.4070° E",
        slaHours,
        slaLabel: `${slaHours}h SLA`,
        feeAmount,
        feeLabel:
          feeAmount > 0
            ? `${feeAmount} ${apiTicket.category?.feeCurrency || "BDT"} Fee`
            : "Free Intake",
        status: apiTicket.status,
        priority: apiTicket.priority || "NORMAL",
        rating: apiTicket.feedback?.rating ?? 4.9,
        reviewCount: apiTicket.feedback ? 1 : 1,
        createdAt: new Date(apiTicket.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        images:
          uploadedImages.length > 0
            ? uploadedImages
            : getCategoryImages(apiTicket.category?.name),
        specifications: [
          {
            label: "Tracking Dossier ID",
            value: apiTicket.requestNumber || apiTicket.id,
          },
          {
            label: "Reporting Citizen",
            value:
              apiTicket.citizen?.name ||
              apiTicket.createdBy?.name ||
              "Verified Ward Resident",
          },
          {
            label: "Assigned Department",
            value: apiTicket.department?.name || "Automated Triage Queue",
          },
          {
            label: "Assigned Field Officer",
            value: apiTicket.assignedTo?.name || "Pending Crew Assignment",
          },
          {
            label: "Service Category",
            value: apiTicket.category?.name || "Civic Grievance",
          },
          {
            label: "Ward & Landmark",
            value: `${apiTicket.ward ? `Ward ${apiTicket.ward}` : "City Ward"} • ${apiTicket.landmark || apiTicket.address || "Logged"}`,
          },
          {
            label: "SLA Due Timestamp",
            value: apiTicket.slaDueAt
              ? new Date(apiTicket.slaDueAt).toLocaleString()
              : `${slaHours} Hours Target`,
          },
          { label: "Current Lifecycle Status", value: apiTicket.status },
        ],
        reviews: apiTicket.feedback
          ? [
              {
                id: apiTicket.feedback.id,
                author:
                  apiTicket.citizen?.name || "Verified Reporting Citizen",
                ward: apiTicket.ward
                  ? `Ward ${apiTicket.ward}${apiTicket.zone ? ` • ${apiTicket.zone}` : ""}`
                  : "Municipal Ward",
                rating: apiTicket.feedback.rating,
                date: new Date(
                  apiTicket.feedback.createdAt,
                ).toLocaleDateString(),
                ticketRef: apiTicket.requestNumber,
                comment:
                  apiTicket.feedback.comment ||
                  "Verified municipal service completion.",
              },
            ]
          : [
              {
                id: `audit-${apiTicket.id}`,
                author:
                  apiTicket.citizen?.name || "Verified Reporting Citizen",
                ward: apiTicket.ward
                  ? `Ward ${apiTicket.ward}${apiTicket.zone ? ` • ${apiTicket.zone}` : ""}`
                  : "Municipal Ward",
                rating: 5,
                date: new Date(apiTicket.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                ),
                ticketRef: apiTicket.requestNumber,
                comment: `Logged under ${apiTicket.category?.name || "Municipal Grievance"}: "${apiTicket.description}"`,
              },
            ],
      };
    }

    return null;
  }, [staticMatch, apiResponse]);

  const relatedItems: PublicCatalogItem[] = useMemo(() => {
    if (!item) return [];

    const liveTickets = Array.isArray(publicListResponse?.data)
      ? [...publicListResponse.data]
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          .filter((t) => t.id !== item.id && t.requestNumber !== item.code)
          .map((t): PublicCatalogItem => {
            const slaHours = t.category?.slaMinutes
              ? Math.max(1, Math.round(Number(t.category.slaMinutes) / 60))
              : 24;
            const feeAmount = Number(t.category?.feeAmount ?? 0);
            const firstAttachment =
              t.attachments?.[0]?.url || t.attachments?.[0]?.fileUrl;
            const fallbackImgs = getCategoryImages(t.category?.name);
            return {
              id: t.id,
              code: t.requestNumber || "CIV-2026",
              type: "PUBLIC_DOSSIER",
              title: t.title,
              shortDescription: t.description,
              overview: [t.description],
              categoryId: t.category?.id || t.categoryId || "waste",
              categoryName: t.category?.name || "Municipal Grievance",
              departmentName:
                t.department?.name || "Municipal Operations Division",
              ward: t.ward ? `Ward ${t.ward}` : "Municipal Ward",
              address: t.address || t.location || "Dhaka City Zone",
              coordinates: "23.7806° N, 90.4070° E",
              slaHours,
              slaLabel: `${slaHours}h SLA`,
              feeAmount,
              feeLabel: feeAmount > 0 ? `${feeAmount} BDT Fee` : "Free Intake",
              status: t.status,
              priority: t.priority || "NORMAL",
              rating: t.feedback?.rating ?? 4.9,
              reviewCount: 1,
              createdAt: new Date(t.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              images: firstAttachment
                ? [{ url: firstAttachment, caption: t.title }]
                : fallbackImgs,
              specifications: [],
              reviews: [],
            };
          })
      : [];

    const staticServices = PUBLIC_CATALOG_ITEMS.filter(
      (candidate) =>
        candidate.type === "MUNICIPAL_SERVICE" && candidate.id !== item.id,
    );

    return [...liveTickets, ...staticServices].slice(0, 4);
  }, [publicListResponse, item]);

  const allReviews = useMemo(
    () => [...localReviews, ...(item?.reviews || [])],
    [localReviews, item],
  );

  const activeImage =
    item?.images[selectedImageIdx] || item?.images[0] || {
      url: "/images/hero-civic.webp",
      caption: item?.title || "CivicFlow public issue",
    };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);

    if (reviewerName.trim().length < 2) {
      setReviewError("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (reviewComment.trim().length < 10) {
      setReviewError(
        "Please share at least 10 characters describing your ward experience.",
      );
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      if (!item) return;

      const newEntry: PublicCatalogReview = {
        id: `local-${Date.now()}`,
        author: reviewerName.trim(),
        ward: reviewerWard,
        rating: reviewRating,
        date: "Just now",
        ticketRef: item.code,
        comment: reviewComment.trim(),
      };
      setLocalReviews((prev) => [newEntry, ...prev]);
      setReviewerName("");
      setReviewComment("");
      setIsSubmittingReview(false);
      gooeyToast.success("Citizen Review Published", {
        description:
          "Your rating has been added to the public transparency record.",
      });
    }, 450);
  };

  if (shouldFetchApi && isApiLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-6 w-44 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="aspect-16/10 w-full rounded-2xl" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <ServiceCardSkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (shouldFetchApi && (isApiError || !apiResponse?.data)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 text-center space-y-4">
        <Badge variant="outline" className="font-mono text-xs">
          404 • Public Ledger Record
        </Badge>
        <h1 className="text-2xl font-bold text-foreground">
          Grievance Dossier Not Found
        </h1>
        <p className="text-sm text-muted-foreground">
          Could not locate a public grievance record matching ID{" "}
          <span className="font-mono font-semibold text-foreground">
            {rawId}
          </span>{" "}
          in the backend ledger.
        </p>
        <div className="pt-2">
          <Button
            variant="default"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home Ledger</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Breadcrumb & Header Banner */}
      <div className="border-b border-border bg-muted/20 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Home</span>
              </Link>
              <span>/</span>
              <span className="font-mono font-semibold text-primary">
                {item.code}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-xs border-primary/30 text-primary bg-primary/5"
              >
                {item.type === "MUNICIPAL_SERVICE"
                  ? "Official Service Category"
                  : "Public Grievance Dossier"}
              </Badge>
              <StatusBadge status={item.status} />
              <PriorityBadge priority={item.priority} />
            </div>
          </div>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <Building2 className="size-3.5" />
                <span>{item.departmentName}</span>
              </div>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {item.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                {item.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="default"
                size="default"
                render={
                  <Link
                    href={`/login?redirect=/citizen/report?category=${item.categoryId}`}
                  />
                }
                nativeButton={false}
                className="gap-2 font-semibold shadow-xs"
              >
                <span>Report Issue in This Category</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-14">
        {/* Top Row: Multi-Image Media Gallery + Key Specifications Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 7 Cols: Multiple Images Gallery + Description/Overview */}
          <div className="lg:col-span-7 space-y-8">
            {/* Multi-Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-xs">
                <Image
                  src={activeImage.url}
                  alt={activeImage.caption}
                  fill
                  priority
                  unoptimized
                  className="object-cover object-center transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 680px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-foreground bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/80">
                    {activeImage.caption}
                  </p>
                  <span className="font-mono text-[11px] font-semibold bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/80 text-foreground shrink-0">
                    Photo {selectedImageIdx + 1} of {item.images.length}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {item.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {item.images.map((img, idx) => {
                    const isSelected = idx === selectedImageIdx;
                    return (
                      <button
                        key={img.url + idx}
                        type="button"
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`group relative aspect-16/9 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30 shadow-xs"
                            : "border-border opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.caption}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="220px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 1: Description / Overview */}
            <section
              aria-labelledby="overview-heading"
              className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-border pb-3.5">
                <FileText className="size-4.5 text-primary" />
                <h2
                  id="overview-heading"
                  className="text-lg font-bold text-foreground"
                >
                  Description &amp; Operational Overview
                </h2>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {item.overview.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Deterministic SLA Workflow Strip */}
              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Enforced 5-Stage Lifecycle Verification
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                  {[
                    "1. SUBMITTED",
                    "2. TRIAGED",
                    "3. IN_PROGRESS",
                    "4. RESOLVED",
                    "5. CLOSED",
                  ].map((stage) => (
                    <div
                      key={stage}
                      className="rounded-lg border border-border bg-muted/30 px-2.5 py-2 text-center font-semibold text-foreground"
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right 5 Cols: Section 2 — Key Information / Specifications */}
          <div className="lg:col-span-5 space-y-6">
            <section
              aria-labelledby="specs-heading"
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <Layers className="size-4.5 text-primary" />
                  <h2
                    id="specs-heading"
                    className="text-lg font-bold text-foreground"
                  >
                    Key Information &amp; Specifications
                  </h2>
                </div>
                <span className="font-mono text-xs font-semibold text-primary">
                  {item.slaLabel}
                </span>
              </div>

              {/* Quick KPI Strip */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    <Clock className="size-3 text-primary" />
                    SLA Target
                  </span>
                  <span className="mt-1 block font-mono text-base font-bold text-foreground">
                    {item.slaHours} Hours
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    <CreditCard className="size-3 text-primary" />
                    Tariff / Fee
                  </span>
                  <span className="mt-1 block font-mono text-base font-bold text-foreground">
                    {item.feeAmount === 0 ? "Free" : `${item.feeAmount} BDT`}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    Rating
                  </span>
                  <span className="mt-1 block font-mono text-base font-bold text-foreground">
                    {item.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden text-xs">
                {item.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-4 px-4 py-3 bg-card hover:bg-muted/20 transition-colors"
                  >
                    <span className="font-medium text-muted-foreground">
                      {spec.label}
                    </span>
                    <span className="font-semibold text-foreground text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Location & Telemetry Metadata Box */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    <span>Jurisdiction &amp; GPS Telemetry</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Verified Ward
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {item.ward} • {item.address}
                </p>
                <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-muted-foreground">
                  <span>Coordinates: {item.coordinates}</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    {item.createdAt}
                  </span>
                </div>
              </div>

              {/* Citizen Protection Guarantee Note */}
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 flex items-start gap-3 text-xs">
                <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">
                    7-Day Citizen Reopening Guarantee
                  </span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    Every resolved ticket in this category requires photographic
                    evidence and can be reopened by the reporting resident
                    within 7 days if repairs are incomplete.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Section 3: Reviews / Ratings */}
        <section
          aria-labelledby="reviews-heading"
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 7 Cols: Verified Citizen Reviews List */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Citizen Quality Audit
                  </span>
                  <h2
                    id="reviews-heading"
                    className="text-xl font-bold text-foreground mt-0.5"
                  >
                    Verified Citizen Reviews &amp; Ratings
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-3.5 py-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="size-4 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {item.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({item.reviewCount + localReviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {allReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-border bg-muted/15 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {rev.author}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                          {rev.ticketRef}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="size-3.5 text-amber-500 fill-amber-500"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {rev.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3 text-primary" />
                        {rev.ward}
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3" />
                        Verified Resident Feedback
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Submit a Public Service Review Form */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Rate Municipal Service Quality
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share your experience with {item.categoryName} resolution in
                    your ward.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3.5" noValidate>
                  <div>
                    <span className="block text-xs font-semibold text-foreground mb-1.5">
                      Your Rating
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`size-5 ${
                              star <= reviewRating
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-mono text-xs font-bold text-foreground">
                        {reviewRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reviewer-name"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Resident Name
                    </label>
                    <Input
                      id="reviewer-name"
                      value={reviewerName}
                      onChange={(e) => {
                        setReviewerName(e.target.value);
                        if (reviewError) setReviewError(null);
                      }}
                      placeholder="e.g. Tariqul Islam"
                      className="h-9 text-xs bg-card"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reviewer-ward"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Municipal Ward
                    </label>
                    <select
                      id="reviewer-ward"
                      value={reviewerWard}
                      onChange={(e) => setReviewerWard(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      <option value="Ward 04 • Uttara">Ward 04 • Uttara</option>
                      <option value="Ward 10 • Mirpur">Ward 10 • Mirpur</option>
                      <option value="Ward 15 • Dhanmondi">
                        Ward 15 • Dhanmondi
                      </option>
                      <option value="Ward 19 • Banani">Ward 19 • Banani</option>
                      <option value="Ward 22 • Motijheel">
                        Ward 22 • Motijheel
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reviewer-comment"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Review Comment
                    </label>
                    <Textarea
                      id="reviewer-comment"
                      value={reviewComment}
                      onChange={(e) => {
                        setReviewComment(e.target.value);
                        if (reviewError) setReviewError(null);
                      }}
                      placeholder="Describe the field crew response time and repair quality..."
                      className="min-h-[80px] text-xs bg-card"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-xs font-medium text-destructive">
                      {reviewError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={isSubmittingReview}
                    className="w-full gap-1.5 font-semibold"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Spinner className="size-3.5" />
                        <span>Publishing Review...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        <span>Submit Verified Review</span>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Related Items (4-Column Equal-Size Card Grid) */}
        <section aria-labelledby="related-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Explore Connected Operations
              </span>
              <h2
                id="related-heading"
                className="mt-1 text-2xl font-bold tracking-tight text-foreground"
              >
                Related Municipal Services &amp; Dossiers
              </h2>
            </div>
            <Link
              href="/#services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Back to all services</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {relatedItems.map((rel) => (
              <div
                key={rel.id}
                className="group flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col flex-1">
                  <div className="relative mb-3.5 h-36 w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={rel.images[0]?.url || "/images/hero-civic.webp"}
                      alt={rel.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 rounded bg-background/90 px-2 py-0.5 font-mono text-[10px] font-bold text-primary backdrop-blur-md">
                      {rel.code}
                    </span>
                    <span className="absolute bottom-2 right-2.5 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-md">
                      {rel.slaLabel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {rel.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {rel.shortDescription}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">{rel.departmentName}</span>
                    <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-foreground shrink-0">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      {rel.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 shrink-0">
                  <Button
                    variant="default"
                    size="sm"
                    render={
                      <Link
                        href={
                          rel.type === "PUBLIC_DOSSIER"
                            ? `/explore/issues/${encodeURIComponent(rel.code)}`
                            : `/explore/${encodeURIComponent(rel.id)}`
                        }
                      />
                    }
                    nativeButton={false}
                    className="w-full gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="size-3.5" />
                    <span>View Details</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
