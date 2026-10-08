"use client";

import {
  AlertCircle,
  Building2,
  Filter,
  LayoutGrid,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Table as TableIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DepartmentArchiveModal,
  DepartmentCard,
  DepartmentCreateModal,
  DepartmentEditModal,
  DepartmentRestoreModal,
  DepartmentStaffRosterModal,
  DepartmentsTable,
  DepartmentTelemetryHeader,
} from "@/components/modules/admin/departments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import type { Department } from "@/types/department.types";

export default function AdminDepartmentsPage() {
  // Filters & View State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "ARCHIVED"
  >("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [archivingDepartment, setArchivingDepartment] =
    useState<Department | null>(null);
  const [restoringDepartment, setRestoringDepartment] =
    useState<Department | null>(null);
  const [rosterDepartment, setRosterDepartment] = useState<Department | null>(
    null,
  );

  // Fetch departments (requesting all including archived so admin can view/manage both)
  const {
    data: departmentsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetDepartments({ includeArchived: true });

  const departments: Department[] = departmentsResponse?.data || [];

  // Filtered list based on search and status tab
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      // 1. Status Filter
      const isArchived = Boolean(dept.isArchived || !dept.isActive);
      if (statusFilter === "ACTIVE" && isArchived) return false;
      if (statusFilter === "ARCHIVED" && !isArchived) return false;

      // 2. Search Term Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = dept.name.toLowerCase().includes(query);
        const matchesDesc =
          dept.description?.toLowerCase().includes(query) ?? false;
        const matchesId = dept.id.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesId;
      }

      return true;
    });
  }, [departments, statusFilter, searchTerm]);

  // Counts for tabs
  const totalCount = departments.length;
  const activeCount = useMemo(
    () => departments.filter((d) => !d.isArchived && d.isActive).length,
    [departments],
  );
  const archivedCount = useMemo(
    () => departments.filter((d) => d.isArchived || !d.isActive).length,
    [departments],
  );

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
            <span className="text-foreground font-semibold">Departments</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Department Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Configure municipal divisions, jurisdiction desks, routing
                pipelines, and staff rosters.
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
            title="Refresh departments"
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
            <span>Create Department</span>
          </Button>
        </div>
      </div>

      {/* 2. Executive KPI Header */}
      <DepartmentTelemetryHeader
        departments={departments}
        isLoading={isLoading}
      />

      {/* 3. Controls & Filter Toolbar */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                statusFilter === "ALL"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All Divisions</span>
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
                Active Desks
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

          {/* Search & View Mode Switcher */}
          <div className="flex items-center gap-2.5 flex-1 md:max-w-md md:justify-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by division name or scope..."
                className="pl-9 pr-8 h-9 text-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/50">
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
            </div>
          </div>
        </div>

        {/* Search Results Filter Banner (when filtering active) */}
        {(searchTerm || statusFilter !== "ALL") && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <span>Showing</span>
              <strong className="text-foreground">
                {filteredDepartments.length}
              </strong>
              <span>of {totalCount} total departments</span>
              {searchTerm && (
                <span>
                  matching "
                  <span className="text-foreground font-semibold">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="text-primary hover:underline font-medium text-xs flex items-center gap-1"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Content State (Loading / Empty / Cards / Table) */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Loading municipal departments...
          </p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No departments found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {searchTerm || statusFilter !== "ALL"
              ? "No departments match your filter criteria. Try clearing search keywords or switching status tabs."
              : "No municipal departments have been registered in the database yet."}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {searchTerm || statusFilter !== "ALL" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
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
                <span>Create First Department</span>
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onEdit={(d) => setEditingDepartment(d)}
              onArchive={(d) => setArchivingDepartment(d)}
              onRestore={(d) => setRestoringDepartment(d)}
              onManageRoster={(d) => setRosterDepartment(d)}
            />
          ))}
        </div>
      ) : (
        <DepartmentsTable
          departments={filteredDepartments}
          onEdit={(d) => setEditingDepartment(d)}
          onArchive={(d) => setArchivingDepartment(d)}
          onRestore={(d) => setRestoringDepartment(d)}
          onManageRoster={(d) => setRosterDepartment(d)}
        />
      )}

      {/* 5. Modals */}
      <DepartmentStaffRosterModal
        department={rosterDepartment}
        isOpen={Boolean(rosterDepartment)}
        onClose={() => setRosterDepartment(null)}
        onSuccess={() => refetch()}
      />

      <DepartmentCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
      />

      <DepartmentEditModal
        department={editingDepartment}
        isOpen={Boolean(editingDepartment)}
        onClose={() => setEditingDepartment(null)}
        onSuccess={() => refetch()}
      />

      <DepartmentArchiveModal
        department={archivingDepartment}
        isOpen={Boolean(archivingDepartment)}
        onClose={() => setArchivingDepartment(null)}
        onSuccess={() => refetch()}
      />

      <DepartmentRestoreModal
        department={restoringDepartment}
        isOpen={Boolean(restoringDepartment)}
        onClose={() => setRestoringDepartment(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
