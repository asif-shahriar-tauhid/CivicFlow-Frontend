"use client";

import {
  GitBranch,
  LayoutGrid,
  Plus,
  RefreshCw,
  Search,
  Table as TableIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  RoutingRuleArchiveModal,
  RoutingRuleCard,
  RoutingRuleCreateModal,
  RoutingRuleEditModal,
  RoutingRuleRestoreModal,
  RoutingRulesTable,
  RoutingRuleTelemetryHeader,
} from "@/components/modules/admin/routingRules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import {
  useGetCategories,
  useGetRoutingRules,
} from "@/hooks/routingRule.hooks";
import { MUNICIPAL_CATEGORIES } from "@/lib/constants/categories";
import type { CategoryRoutingRule } from "@/types/routingRule.types";

export default function AdminRoutingRulesPage() {
  // Filters & View State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "ARCHIVED"
  >("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("ALL");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<CategoryRoutingRule | null>(
    null,
  );
  const [archivingRule, setArchivingRule] =
    useState<CategoryRoutingRule | null>(null);
  const [restoringRule, setRestoringRule] =
    useState<CategoryRoutingRule | null>(null);

  // Data fetching
  const {
    data: rulesResponse,
    isLoading: rulesLoading,
    isFetching,
    refetch,
  } = useGetRoutingRules({ includeArchived: true });

  const { data: deptData } = useGetDepartments();
  const { data: catData } = useGetCategories();

  const rules: CategoryRoutingRule[] = rulesResponse?.data || [];
  const departments = deptData?.data || [];
  const categories = useMemo(() => {
    if (catData?.data && catData.data.length > 0) return catData.data;
    return MUNICIPAL_CATEGORIES.map((c) => ({ id: c.id, name: c.name }));
  }, [catData]);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // 1. Status Filter
      const isArchived = Boolean(rule.isArchived || !rule.isActive);
      if (statusFilter === "ACTIVE" && isArchived) return false;
      if (statusFilter === "ARCHIVED" && !isArchived) return false;

      // 2. Category Filter
      if (
        selectedCategoryFilter !== "ALL" &&
        rule.categoryId !== selectedCategoryFilter
      ) {
        return false;
      }

      // 3. Department Filter
      if (
        selectedDeptFilter !== "ALL" &&
        rule.departmentId !== selectedDeptFilter
      ) {
        return false;
      }

      // 4. Search Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const catMatch =
          rule.category?.name?.toLowerCase().includes(query) ?? false;
        const deptMatch =
          rule.department?.name?.toLowerCase().includes(query) ?? false;
        const locMatch = rule.location?.toLowerCase().includes(query) ?? false;
        const idMatch = rule.id.toLowerCase().includes(query);
        return catMatch || deptMatch || locMatch || idMatch;
      }

      return true;
    });
  }, [
    rules,
    statusFilter,
    selectedCategoryFilter,
    selectedDeptFilter,
    searchTerm,
  ]);

  // Counts for tabs
  const totalCount = rules.length;
  const activeCount = useMemo(
    () => rules.filter((r) => !r.isArchived && r.isActive).length,
    [rules],
  );
  const archivedCount = useMemo(
    () => rules.filter((r) => r.isArchived || !r.isActive).length,
    [rules],
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedCategoryFilter("ALL");
    setSelectedDeptFilter("ALL");
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Actions */}
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
            <span className="text-foreground font-semibold">Routing Rules</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Automated Routing Rules
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Configure category-to-department automated dispatch pipelines
                with ward priorities and fallback rules.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 border-border/70"
            title="Refresh routing rules"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin text-primary" : "text-muted-foreground"}`}
            />
            <span className="hidden sm:inline text-xs">
              {isFetching ? "Syncing..." : "Sync"}
            </span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-3.5 gap-2 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Configure Rule</span>
          </Button>
        </div>
      </div>

      {/* 2. Telemetry Header */}
      <RoutingRuleTelemetryHeader rules={rules} isLoading={rulesLoading} />

      {/* 3. Controls & Filter Toolbar */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs self-start lg:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusFilter === "ALL"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All Pipelines</span>
              <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] text-muted-foreground font-mono">
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusFilter === "ACTIVE"
                  ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Rules
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-mono">
                {activeCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("ARCHIVED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusFilter === "ARCHIVED"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Archived</span>
              <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] text-muted-foreground font-mono">
                {archivedCount}
              </span>
            </button>
          </div>

          {/* Search & Select Filters */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 lg:max-w-xl lg:justify-end">
            {/* Category Filter Dropdown */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-input bg-background text-xs text-foreground outline-none focus:ring-2 focus:ring-ring shrink-0"
              title="Filter by category"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Department Filter Dropdown */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-input bg-background text-xs text-foreground outline-none focus:ring-2 focus:ring-ring shrink-0"
              title="Filter by department"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative min-w-[180px] flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search category, dept, ward..."
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

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/50">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <TableIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter State Banner */}
        {(searchTerm ||
          statusFilter !== "ALL" ||
          selectedCategoryFilter !== "ALL" ||
          selectedDeptFilter !== "ALL") && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <span>Showing</span>
              <strong className="text-foreground">
                {filteredRules.length}
              </strong>
              <span>of {totalCount} total routing rules</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary hover:underline font-medium text-xs flex items-center gap-1"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Content Area */}
      {rulesLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Loading routing rules...
          </p>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <GitBranch className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No routing rules found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {searchTerm ||
            statusFilter !== "ALL" ||
            selectedCategoryFilter !== "ALL" ||
            selectedDeptFilter !== "ALL"
              ? "No routing rules match your search or filter criteria. Try clearing filters."
              : "No category routing rules have been configured yet."}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {searchTerm ||
            statusFilter !== "ALL" ||
            selectedCategoryFilter !== "ALL" ||
            selectedDeptFilter !== "ALL" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Configure First Rule</span>
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        <RoutingRulesTable
          rules={filteredRules}
          onEdit={(r) => setEditingRule(r)}
          onArchive={(r) => setArchivingRule(r)}
          onRestore={(r) => setRestoringRule(r)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRules.map((rule) => (
            <RoutingRuleCard
              key={rule.id}
              rule={rule}
              onEdit={(r) => setEditingRule(r)}
              onArchive={(r) => setArchivingRule(r)}
              onRestore={(r) => setRestoringRule(r)}
            />
          ))}
        </div>
      )}

      {/* 5. Modals */}
      <RoutingRuleCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
      />

      <RoutingRuleEditModal
        rule={editingRule}
        isOpen={Boolean(editingRule)}
        onClose={() => setEditingRule(null)}
        onSuccess={() => refetch()}
      />

      <RoutingRuleArchiveModal
        rule={archivingRule}
        isOpen={Boolean(archivingRule)}
        onClose={() => setArchivingRule(null)}
        onSuccess={() => refetch()}
      />

      <RoutingRuleRestoreModal
        rule={restoringRule}
        isOpen={Boolean(restoringRule)}
        onClose={() => setRestoringRule(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
