"use client";

import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  Filter,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { resolveCategoryImage } from "@/components/modules/home/RecentPublicIssuesSection";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCardSkeleton } from "@/components/ui/skeleton";
import { useAiSearchSuggestions } from "@/hooks/ai.hooks";
import { useGetPublicServiceRequests } from "@/hooks/request.hooks";
import { useGetCategorySlaConfigs } from "@/hooks/sla.hooks";
import { PUBLIC_CATALOG_ITEMS } from "@/lib/constants/publicCatalog";
import type { RequestPriority, RequestStatus } from "@/types/request.types";

type ExploreRecordType = "ALL" | "GRIEVANCE" | "SERVICE";
type FeeFilterType = "ALL" | "FREE" | "PAID";
type SortOption =
  | "FIFO_ASC"
  | "NEWEST_DESC"
  | "PRIORITY_DESC"
  | "SLA_ASC"
  | "FEE_ASC";

interface UnifiedExploreCard {
  id: string;
  code: string;
  recordType: "GRIEVANCE" | "SERVICE";
  title: string;
  description: string;
  categoryName: string;
  departmentName: string;
  ward: string;
  address: string;
  status: RequestStatus;
  priority: RequestPriority;
  slaHours: number;
  slaLabel: string;
  feeAmount: number;
  feeLabel: string;
  createdAtTimestamp: number;
  createdAtLabel: string;
  image: string;
  detailsHref: string;
}

const PRIORITY_WEIGHT: Record<RequestPriority, number> = {
  URGENT: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
};

export default function PublicExploreListingPage() {
  const { data: requestsRes, isLoading: isRequestsLoading } =
    useGetPublicServiceRequests();
  const { data: categoriesRes, isLoading: isCategoriesLoading } =
    useGetCategorySlaConfigs();

  const isLoading = isRequestsLoading || isCategoriesLoading;

  // Search, 4 Filter Fields, Record Type, Sort, and Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recordType, setRecordType] = useState<ExploreRecordType>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedFeeTier, setSelectedFeeTier] = useState<FeeFilterType>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("FIFO_ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  const { data: aiSuggestionsRes } = useAiSearchSuggestions(searchQuery);
  const aiSuggestions = aiSuggestionsRes?.data?.suggestions || [];
  const aiTrendingTags = aiSuggestionsRes?.data?.trendingTags || [];
  const aiFilterHint = aiSuggestionsRes?.data?.aiFilterHint || null;

  // Build unified items list from real backend grievances + official municipal services
  const allItems: UnifiedExploreCard[] = useMemo(() => {
    const rawRequests = Array.isArray(requestsRes?.data)
      ? requestsRes.data
      : [];
    const apiCategories = Array.isArray(categoriesRes?.data)
      ? categoriesRes.data
      : [];

    const grievanceCards: UnifiedExploreCard[] = rawRequests.map((req) => {
      const slaHours = req.category?.slaMinutes
        ? Math.max(1, Math.round(Number(req.category.slaMinutes) / 60))
        : 24;
      const feeAmount = Number(req.category?.feeAmount ?? 0);
      const currency = req.category?.feeCurrency || "BDT";
      const wardLabel = req.ward
        ? req.ward.toLowerCase().startsWith("ward")
          ? req.ward
          : `Ward ${req.ward}`
        : "Ward 04";

      return {
        id: req.id,
        code: req.requestNumber || "CIV-2026",
        recordType: "GRIEVANCE",
        title: req.title,
        description: req.description,
        categoryName: req.category?.name || "Municipal Grievance",
        departmentName: req.department?.name || "Municipal Dispatch",
        ward: wardLabel,
        address: req.address || req.location || "Dhaka Municipal Zone",
        status: req.status,
        priority: req.priority || "NORMAL",
        slaHours,
        slaLabel: `${slaHours}h SLA`,
        feeAmount,
        feeLabel: feeAmount > 0 ? `${feeAmount} ${currency}` : "Free Intake",
        createdAtTimestamp: new Date(req.createdAt).getTime(),
        createdAtLabel: new Date(req.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        image:
          req.attachments?.[0]?.url ||
          req.attachments?.[0]?.fileUrl ||
          resolveCategoryImage(req.category?.name),
        detailsHref: `/citizen/requests/${encodeURIComponent(req.id)}`,
      };
    });

    const serviceCards: UnifiedExploreCard[] = PUBLIC_CATALOG_ITEMS.filter(
      (item) => item.type === "MUNICIPAL_SERVICE",
    ).map((service, index) => {
      const matchedCat = apiCategories.find(
        (c) => c.id === service.categoryId,
      );
      const slaHours = matchedCat?.slaMinutes
        ? Math.max(1, Math.round(Number(matchedCat.slaMinutes) / 60))
        : service.slaHours;
      const feeAmount =
        matchedCat !== undefined
          ? Number(matchedCat.feeAmount ?? 0)
          : service.feeAmount;

      return {
        id: service.id,
        code: service.code,
        recordType: "SERVICE",
        title: service.title,
        description: service.shortDescription,
        categoryName: matchedCat?.name || service.categoryName,
        departmentName: service.departmentName,
        ward: service.ward,
        address: service.address,
        status: service.status,
        priority: service.priority,
        slaHours,
        slaLabel: `${slaHours}h SLA`,
        feeAmount,
        feeLabel: feeAmount > 0 ? `${feeAmount} BDT Fee` : "Free Intake",
        // Keep services ordered after grievances in FIFO mode unless sorted otherwise
        createdAtTimestamp: new Date("2026-10-20T00:00:00Z").getTime() + index,
        createdAtLabel: service.createdAt,
        image: service.images[0]?.url || "/images/hero-civic.webp",
        detailsHref: `/explore/${encodeURIComponent(service.id)}`,
      };
    });

    return [...grievanceCards, ...serviceCards];
  }, [requestsRes, categoriesRes]);

  // Dynamic category options from backend + catalog
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of allItems) {
      if (item.categoryName) set.add(item.categoryName);
    }
    return Array.from(set).sort();
  }, [allItems]);

  // Apply Search + 4 Filters + Sorting
  const filteredAndSortedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = allItems.filter((item) => {
      if (recordType !== "ALL" && item.recordType !== recordType) {
        return false;
      }

      if (
        selectedCategory !== "ALL" &&
        item.categoryName !== selectedCategory
      ) {
        return false;
      }

      if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
        return false;
      }

      if (selectedPriority !== "ALL" && item.priority !== selectedPriority) {
        return false;
      }

      if (selectedFeeTier === "FREE" && item.feeAmount > 0) {
        return false;
      }
      if (selectedFeeTier === "PAID" && item.feeAmount <= 0) {
        return false;
      }

      if (query.length > 0) {
        const haystack = [
          item.title,
          item.description,
          item.code,
          item.categoryName,
          item.departmentName,
          item.ward,
          item.address,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "FIFO_ASC":
          return a.createdAtTimestamp - b.createdAtTimestamp;
        case "NEWEST_DESC":
          return b.createdAtTimestamp - a.createdAtTimestamp;
        case "PRIORITY_DESC":
          return (
            (PRIORITY_WEIGHT[b.priority] || 0) -
            (PRIORITY_WEIGHT[a.priority] || 0)
          );
        case "SLA_ASC":
          return a.slaHours - b.slaHours;
        case "FEE_ASC":
          return a.feeAmount - b.feeAmount;
        default:
          return 0;
      }
    });
  }, [
    allItems,
    searchQuery,
    recordType,
    selectedCategory,
    selectedStatus,
    selectedPriority,
    selectedFeeTier,
    sortBy,
  ]);

  // Pagination calculations
  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedItems = filteredAndSortedItems.slice(
    startIndex,
    startIndex + pageSize,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    recordType !== "ALL",
    selectedCategory !== "ALL",
    selectedStatus !== "ALL",
    selectedPriority !== "ALL",
    selectedFeeTier !== "ALL",
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchQuery("");
    setRecordType("ALL");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSelectedPriority("ALL");
    setSelectedFeeTier("ALL");
    setSortBy("FIFO_ASC");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Page Header Banner */}
      <section className="border-b border-border bg-muted/20 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Layers className="size-3.5" />
                <span>Public Municipal Directory &amp; Ward Ledger</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Explore Grievances &amp; Municipal Services
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Search, filter, and inspect real-time citizen grievance dossiers
                and official department SLA service categories across all Dhaka
                municipal wards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="default"
                size="default"
                render={<Link href="/login?redirect=/citizen/report" />}
                nativeButton={false}
                className="gap-2 font-semibold shadow-xs"
              >
                <span>Report a Municipal Issue</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Search, 4 Filter Fields, & Sorting Control Panel */}
        <section
          aria-label="Search and filter controls"
          className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5"
        >
          {/* Top Row: Record Type Tabs + Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Record Type Segmented Pills */}
            <div className="inline-flex items-center rounded-xl border border-border bg-muted/40 p-1 self-start">
              {[
                { id: "ALL", label: "All Records" },
                { id: "GRIEVANCE", label: "Public Grievances" },
                { id: "SERVICE", label: "Municipal Services" },
              ].map((tab) => {
                const isActive = recordType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setRecordType(tab.id as ExploreRecordType);
                      setCurrentPage(1);
                    }}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Bar with AI Suggestions Dropdown */}
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsSearchFocused(false), 180);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="AI Search: title, tracking ID (CIV-2026-...), ward, or hazard..."
                className="h-10 pl-10 pr-9 text-xs sm:text-sm bg-background"
                aria-label="Search grievances and municipal services"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear search query"
                >
                  <X className="size-3.5" />
                </button>
              )}

              {/* AI-Powered Search Suggestions Dropdown */}
              {isSearchFocused && aiSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-xl border border-border bg-card p-2.5 shadow-xl space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="size-3" />
                      AI-Powered Search Suggestions
                    </span>
                    <span className="font-mono text-muted-foreground">
                      Backend RAG
                    </span>
                  </div>

                  {aiFilterHint && (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (aiFilterHint.priority) {
                          setSelectedPriority(aiFilterHint.priority);
                        }
                        if (aiFilterHint.status) {
                          setSelectedStatus(aiFilterHint.status);
                        }
                        if (aiFilterHint.categoryName) {
                          const match = categoryOptions.find((c) =>
                            c
                              .toLowerCase()
                              .includes(
                                aiFilterHint.categoryName!.toLowerCase(),
                              ),
                          );
                          if (match) setSelectedCategory(match);
                        }
                        setIsSearchFocused(false);
                        setCurrentPage(1);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary hover:bg-primary/15 transition-colors cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        <span>{aiFilterHint.summary}</span>
                      </span>
                      <span className="text-[10px] font-mono underline">
                        Apply Filter
                      </span>
                    </button>
                  )}

                  <div className="divide-y divide-border/50">
                    {aiSuggestions.map((sug) => (
                      <div
                        key={sug.id}
                        className="flex items-center justify-between gap-2 px-2.5 py-2 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSearchQuery(
                              sug.requestNumber ||
                                sug.text.split("—")[1]?.trim() ||
                                sug.text,
                            );
                            setIsSearchFocused(false);
                            setCurrentPage(1);
                          }}
                          className="flex-1 text-left cursor-pointer min-w-0"
                        >
                          <p className="text-xs font-semibold text-foreground truncate">
                            {sug.text}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {sug.reason}
                          </p>
                        </button>

                        {sug.type === "LIVE_TICKET" && sug.ticketId ? (
                          <Link
                            href={`/citizen/requests/${encodeURIComponent(sug.ticketId)}`}
                            className="shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            Open Dossier
                          </Link>
                        ) : (
                          sug.priority && (
                            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                              {sug.priority}
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Trending Ward Hotspots Strip */}
          {aiTrendingTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mr-1">
                <Sparkles className="size-3" />
                <span>AI Trending Hotspots:</span>
              </span>
              {aiTrendingTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.query);
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{tag.label}</span>
                  <span className="rounded-full bg-primary/15 px-1.5 py-0.2 font-mono text-[10px] font-bold text-primary">
                    {tag.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Second Row: 4 Filter Fields + Sort Dropdown */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 pt-2 border-t border-border/60">
            {/* Filter 1: Category */}
            <div className="space-y-1">
              <label
                htmlFor="filter-category"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <Filter className="size-3 text-primary" />
                <span>Category</span>
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="ALL">All Categories</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Lifecycle Status */}
            <div className="space-y-1">
              <label
                htmlFor="filter-status"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <ShieldCheck className="size-3 text-primary" />
                <span>Lifecycle Status</span>
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="TRIAGED">TRIAGED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="REOPENED">REOPENED</option>
              </select>
            </div>

            {/* Filter 3: Priority Level */}
            <div className="space-y-1">
              <label
                htmlFor="filter-priority"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <Clock className="size-3 text-primary" />
                <span>Priority Level</span>
              </label>
              <select
                id="filter-priority"
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* Filter 4: Fee / Tariff Tier */}
            <div className="space-y-1">
              <label
                htmlFor="filter-fee"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <CreditCard className="size-3 text-primary" />
                <span>Fee / Tariff</span>
              </label>
              <select
                id="filter-fee"
                value={selectedFeeTier}
                onChange={(e) => {
                  setSelectedFeeTier(e.target.value as FeeFilterType);
                  setCurrentPage(1);
                }}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="ALL">All Tariffs (Free &amp; Paid)</option>
                <option value="FREE">Free Intake (0 BDT)</option>
                <option value="PAID">Paid Permit / Haulage (&gt; 0 BDT)</option>
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="space-y-1">
              <label
                htmlFor="sort-order"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <SlidersHorizontal className="size-3 text-primary" />
                <span>Sort Order</span>
              </label>
              <select
                id="sort-order"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="FIFO_ASC">FIFO Queue (Oldest First)</option>
                <option value="NEWEST_DESC">Newest Logged First</option>
                <option value="PRIORITY_DESC">Priority (Urgent → Low)</option>
                <option value="SLA_ASC">SLA Target (Fastest First)</option>
                <option value="FEE_ASC">Tariff Fee (Low → High)</option>
              </select>
            </div>
          </div>

          {/* Active Results Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                Showing{" "}
                <strong className="font-mono text-foreground">
                  {totalItems === 0 ? 0 : startIndex + 1}–
                  {Math.min(startIndex + pageSize, totalItems)}
                </strong>{" "}
                of{" "}
                <strong className="font-mono text-foreground">
                  {totalItems}
                </strong>{" "}
                matching records
              </span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-primary/30 text-primary bg-primary/5"
                >
                  {activeFilterCount} active filter
                  {activeFilterCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset all filters</span>
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <label htmlFor="page-size-select" className="text-[11px]">
                  Cards per page:
                </label>
                <select
                  id="page-size-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-7 rounded-md border border-input bg-background px-2 font-mono text-xs text-foreground"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Card Grid (4 Cards per Row on Desktop, Uniform Size & Radius, Skeleton Loader) */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <ServiceCardSkeleton key={n} />
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center space-y-3">
            <p className="text-base font-bold text-foreground">
              No Matching Municipal Records Found
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No grievances or service categories matched your current search
              and filter criteria. Try clearing a filter or searching by a
              different keyword.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-1.5 text-xs font-semibold"
              >
                <RotateCcw className="size-3.5" />
                <span>Clear All Filters</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {paginatedItems.map((item) => (
              <article
                key={`${item.recordType}-${item.id}`}
                className="group flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col flex-1">
                  {/* Card Image & Overlay Badges */}
                  <div className="relative mb-3.5 h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    <div className="absolute top-2.5 left-2.5">
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <PriorityBadge priority={item.priority} />
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
                      <span className="rounded bg-background/90 px-2 py-0.5 font-bold text-primary backdrop-blur-md">
                        {item.code}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-background/90 px-2 py-0.5 font-medium text-foreground backdrop-blur-md">
                        <ShieldCheck className="size-3 text-emerald-500" />
                        {item.slaLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h2>

                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  {/* Meta Info Block */}
                  <div className="mt-3.5 space-y-1.5 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 truncate font-medium text-foreground">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">
                          {item.ward} • {item.address}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 truncate">
                        <Clock className="size-3 text-amber-500 shrink-0" />
                        <span className="truncate">{item.categoryName}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[10px] font-semibold text-foreground">
                        {item.feeLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                      <span className="truncate">{item.departmentName}</span>
                      <span className="inline-flex items-center gap-1 shrink-0">
                        <Calendar className="size-3 text-muted-foreground" />
                        {item.createdAtLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details CTA */}
                <div className="mt-4 pt-3 border-t border-border/60 shrink-0">
                  <Button
                    variant="default"
                    size="sm"
                    render={<Link href={item.detailsHref} />}
                    nativeButton={false}
                    className="w-full gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="size-3.5" />
                    <span>View Details</span>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalItems > 0 && (
          <nav
            aria-label="Explore pagination"
            className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-xs"
          >
            <span className="text-xs text-muted-foreground">
              Page{" "}
              <strong className="font-mono text-foreground">
                {safeCurrentPage}
              </strong>{" "}
              of{" "}
              <strong className="font-mono text-foreground">
                {totalPages}
              </strong>{" "}
              ({totalItems} total records)
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="gap-1 text-xs h-8 px-3"
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </Button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => {
                  const isCurrent = pageNum === safeCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`size-8 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={safeCurrentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="gap-1 text-xs h-8 px-3"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
