"use client";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserCog,
  Users,
  UserX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  UserDeactivateModal,
  UserEditModal,
} from "@/components/modules/admin/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import { useGetAllUsers } from "@/hooks/user.hooks";
import type { User, UserRole, UserStatus } from "@/types/auth.types";

export default function AdminUsersPage() {
  // Query Filters & Pagination State
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "ALL">("ALL");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");

  // Modals
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);

  // Data fetching
  const {
    data: usersResponse,
    isLoading: usersLoading,
    isFetching,
    refetch,
  } = useGetAllUsers({
    page,
    limit: 15,
    searchTerm: searchTerm.trim() || undefined,
    role: selectedRole === "ALL" ? undefined : selectedRole,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    departmentId: selectedDeptId || undefined,
  });

  const { data: deptData } = useGetDepartments();
  const departments = deptData?.data || [];

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;

  // Overview quick stats computed from active query
  const totalUsers = meta?.total ?? users.length;
  const citizenCount = useMemo(
    () => users.filter((u) => u.role === "CITIZEN").length,
    [users],
  );
  const staffCount = useMemo(
    () => users.filter((u) => u.role === "STAFF").length,
    [users],
  );
  const adminCount = useMemo(
    () => users.filter((u) => u.role === "ADMIN").length,
    [users],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("ALL");
    setSelectedStatus("ALL");
    setSelectedDeptId("");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center size-8 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Return to Admin Overview"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Personnel & Citizen Directory
            </h1>
            <Badge variant="outline" className="border-primary/30 text-primary">
              RBAC Governance
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ml-10">
            Audit user accounts, promote clearance roles, assign department
            staff, and govern platform privileges.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 rounded-4xl"
          >
            <RefreshCw
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh Roster</span>
          </Button>
        </div>
      </div>

      {/* Directory Metrics Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {usersLoading ? "—" : totalUsers}
            </span>
            <span className="text-xs text-muted-foreground">registered</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Platform-wide identity accounts
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Citizen Reporters
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {usersLoading ? "—" : citizenCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Citizens
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Public municipal grievance filers
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Department Staff
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {usersLoading ? "—" : staffCount}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Officers
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Field technicians and department crews
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              System Admins
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Shield className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {usersLoading ? "—" : adminCount}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Governing
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Full governance & dispatch access
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by legal name or email address..."
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-card"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Dropdown */}
            <select
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-4xl border border-border bg-card px-3 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as UserStatus | "ALL");
                setPage(1);
              }}
              className="h-8 rounded-4xl border border-border bg-card px-3 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="BLOCKED">Blocked Only</option>
            </select>

            {(searchTerm ||
              selectedRole !== "ALL" ||
              selectedStatus !== "ALL" ||
              selectedDeptId) && (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleClearFilters}
                className="gap-1 text-muted-foreground hover:text-foreground text-xs h-8"
              >
                <X className="size-3" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(["ALL", "CITIZEN", "STAFF", "ADMIN"] as const).map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-4xl text-xs font-medium transition-colors ${
                selectedRole === role
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {role === "ALL" ? "All Roles" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Management Table */}
      <div className="space-y-4">
        {usersLoading ? (
          <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4 text-primary" />
              <span>Loading user directory...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-12 text-center">
            <Users className="size-8 text-muted-foreground mb-3 opacity-60" />
            <p className="text-sm font-semibold text-foreground">
              No users found matching your filters
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Try adjusting your search criteria, clearing the department filter,
              or resetting role permissions.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="mt-4 rounded-4xl text-xs"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">User & Identity</th>
                    <th className="px-4 py-3 font-medium">Clearance Role</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Account Status</th>
                    <th className="px-4 py-3 font-medium">Registered</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* User Column */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={item} size="sm" />
                          <div className="min-w-0 max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground truncate">
                                {item.name || "Anonymous User"}
                              </span>
                              {item.emailVerified && (
                                <span title="Email Verified">
                                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono truncate block">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-4 py-3">
                        {item.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <Shield className="size-3" />
                            <span>ADMIN</span>
                          </span>
                        ) : item.role === "STAFF" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Building2 className="size-3" />
                            <span>STAFF</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                            <Users className="size-3" />
                            <span>CITIZEN</span>
                          </span>
                        )}
                      </td>

                      {/* Department Column */}
                      <td className="px-4 py-3">
                        {item.department ? (
                          <div className="flex items-center gap-1.5 font-medium text-foreground max-w-[170px] truncate">
                            <Building2 className="size-3 text-primary shrink-0" />
                            <span className="truncate">
                              {item.department.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            —
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-4 py-3">
                        {item.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                            ACTIVE
                          </span>
                        ) : item.status === "BLOCKED" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono uppercase">
                            BLOCKED
                          </span>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-mono uppercase"
                          >
                            {item.status}
                          </Badge>
                        )}
                      </td>

                      {/* Registered Date Column */}
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setEditingUser(item)}
                            className="gap-1 rounded-4xl border-border hover:border-primary/40 text-foreground font-medium text-[11px] h-7 px-2.5 shadow-2xs"
                            title="Edit User Role & Permissions"
                          >
                            <Edit3 className="size-3 text-primary" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setDeactivatingUser(item)}
                            className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive h-7 px-2 rounded-4xl"
                            title="Suspend or Soft-Delete User"
                          >
                            <UserX className="size-3" />
                            <span className="sr-only sm:not-sr-only">Suspend</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs bg-muted/20">
                <span className="text-muted-foreground">
                  Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                  users
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={meta.page <= 1}
                    className="gap-1 rounded-4xl h-7 px-2.5"
                  >
                    <ChevronLeft className="size-3" />
                    <span>Prev</span>
                  </Button>

                  <span className="px-2 font-mono text-[11px] text-muted-foreground">
                    Page {meta.page} of {meta.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, meta.totalPages))
                    }
                    disabled={meta.page >= meta.totalPages}
                    className="gap-1 rounded-4xl h-7 px-2.5"
                  >
                    <span>Next</span>
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      <UserEditModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSuccess={() => refetch()}
      />

      {/* User Deactivation Modal */}
      <UserDeactivateModal
        user={deactivatingUser}
        isOpen={Boolean(deactivatingUser)}
        onClose={() => setDeactivatingUser(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
