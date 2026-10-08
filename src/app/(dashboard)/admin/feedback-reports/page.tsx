"use client";

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Filter,
  HeartHandshake,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FeedbackDetailModal,
  FeedbackReportTelemetryStrip,
  FeedbackReportsTable,
} from "@/components/modules/admin/feedbackReports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import { useGetFeedbackReports } from "@/hooks/feedback.hooks";
import type { RequestFeedbackItem } from "@/types/feedback.types";

export default function AdminFeedbackReportsPage() {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    undefined,
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [inspectingFeedback, setInspectingFeedback] =
    useState<RequestFeedbackItem | null>(null);

  const {
    data: feedbackResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetFeedbackReports({
    rating: selectedRating,
    departmentId: selectedDepartmentId || undefined,
    searchTerm: searchTerm || undefined,
    page,
    limit,
  });

  const { data: deptResponse } = useGetDepartments();
  const departments = deptResponse?.data || [];

  const rawFeedbacks: RequestFeedbackItem[] = feedbackResponse?.data || [];
  const meta = feedbackResponse?.meta || {
    page: 1,
    limit: 20,
    total: rawFeedbacks.length,
    totalPages: 1,
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors"
            >
              Admin Desk
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">
              Satisfaction Reports
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Star className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Citizen Satisfaction Reports
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Citywide citizen feedback, post-resolution service ratings, and
                public trust telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 border-border/70"
            title="Refresh satisfaction reports"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin text-primary" : "text-muted-foreground"}`}
            />
            <span className="hidden sm:inline text-xs">
              {isFetching ? "Syncing..." : "Sync"}
            </span>
          </Button>
        </div>
      </div>

      {/* 2. Telemetry Strip */}
      <FeedbackReportTelemetryStrip
        feedbacks={rawFeedbacks}
        totalFeedbacks={meta.total || rawFeedbacks.length}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Rating Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => {
                setSelectedRating(undefined);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedRating === undefined
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All Reviews</span>
            </button>

            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setSelectedRating(r);
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  selectedRating === r
                    ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{r}</span>
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              </button>
            ))}
          </div>

          {/* Department Filter & Search */}
          <div className="flex items-center gap-2.5 flex-1 md:max-w-md md:justify-end">
            <div className="relative shrink-0">
              <select
                value={selectedDepartmentId}
                onChange={(e) => {
                  setSelectedDepartmentId(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 pr-8 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                aria-label="Filter by department division"
              >
                <option value="">All Divisions</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <Building2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
            </div>

            {/* Keyword Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket #, title, or review text..."
                className="pl-8.5 pr-8 h-9 text-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Summary Banner */}
        {(searchTerm ||
          selectedDepartmentId ||
          selectedRating !== undefined) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <div>
              <span>Showing </span>
              <strong className="text-foreground">{rawFeedbacks.length}</strong>
              <span> of {meta.total} feedback records</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedDepartmentId("");
                setSelectedRating(undefined);
              }}
              className="text-primary hover:underline font-medium text-xs"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Compiling citizen satisfaction ratings...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <FeedbackReportsTable
            feedbacks={rawFeedbacks}
            onInspect={(fb) => setInspectingFeedback(fb)}
            isLoading={isLoading}
          />

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPages} ({meta.total} total
                reviews)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Inspection Modal */}
      <FeedbackDetailModal
        feedback={inspectingFeedback}
        isOpen={Boolean(inspectingFeedback)}
        onClose={() => setInspectingFeedback(null)}
      />
    </div>
  );
}
