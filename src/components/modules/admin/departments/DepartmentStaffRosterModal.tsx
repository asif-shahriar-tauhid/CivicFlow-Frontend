"use client";

import {
  HardHat,
  Search,
  Shield,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAssignStaffDepartment } from "@/hooks/department.hooks";
import { useGetAllUsers } from "@/hooks/user.hooks";
import type { User } from "@/types/auth.types";
import type { Department } from "@/types/department.types";

interface DepartmentStaffRosterModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DepartmentStaffRosterModal({
  department,
  isOpen,
  onClose,
  onSuccess,
}: DepartmentStaffRosterModalProps) {
  const [searchStaffTerm, setSearchStaffTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"roster" | "available">("roster");

  // Query all STAFF users
  const { data: usersResponse, isLoading: usersLoading } = useGetAllUsers({
    role: "STAFF",
    limit: 100,
  });

  const staffUsers: User[] = useMemo(() => {
    return usersResponse?.data || [];
  }, [usersResponse]);

  const { mutateAsync: assignStaffMutate, isPending } =
    useAssignStaffDepartment();

  // Active roster for this department
  const currentRoster = useMemo(() => {
    if (!department) return [];
    return staffUsers.filter(
      (u) =>
        u.departmentId === department.id || u.department?.id === department.id,
    );
  }, [staffUsers, department]);

  // Other staff (unassigned or in other depts)
  const availableStaff = useMemo(() => {
    if (!department) return [];
    return staffUsers.filter(
      (u) =>
        u.departmentId !== department.id && u.department?.id !== department.id,
    );
  }, [staffUsers, department]);

  // Filtered available staff based on search query
  const filteredAvailableStaff = useMemo(() => {
    if (!searchStaffTerm.trim()) return availableStaff;
    const q = searchStaffTerm.toLowerCase().trim();
    return availableStaff.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q),
    );
  }, [availableStaff, searchStaffTerm]);

  if (!isOpen || !department) return null;

  const handleAssign = async (userId: string) => {
    try {
      await assignStaffMutate({
        userId,
        departmentId: department.id,
      });
      onSuccess?.();
    } catch {
      // Error handled by hook toast
    }
  };

  const handleUnassign = async (userId: string) => {
    try {
      await assignStaffMutate({
        userId,
        departmentId: null,
      });
      onSuccess?.();
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="roster-modal-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-primary to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <HardHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="roster-modal-title"
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  Department Staff Roster
                </h2>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary text-[10px]"
                >
                  {currentRoster.length} Assigned
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {department.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-border/60 px-6 bg-muted/20 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("roster")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "roster"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Active Division Roster</span>
            <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-mono">
              {currentRoster.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("available")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "available"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Deploy Personnel</span>
            <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-mono">
              {availableStaff.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {usersLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Spinner className="h-6 w-6 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">
                Loading personnel roster...
              </p>
            </div>
          ) : activeTab === "roster" ? (
            /* Current Division Roster */
            <div className="space-y-3">
              {currentRoster.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/80 bg-muted/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-2">
                    <Users className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    No Staff Currently Deployed
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                    This division has no field staff assigned. Switch to the
                    "Deploy Personnel" tab to assign technicians from the
                    municipal pool.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("available")}
                    className="mt-3 gap-1.5 text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Deploy Staff Now</span>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/40 rounded-xl border border-border/70 overflow-hidden bg-card/60">
                  {currentRoster.map((staff) => (
                    <div
                      key={staff.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar user={staff} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-foreground truncate">
                              {staff.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 inline-flex items-center gap-1"
                            >
                              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                              Active Specialist
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {staff.email} • ID: {staff.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleUnassign(staff.id)}
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 gap-1"
                        title="Remove staff member from this department roster"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                        <span>Unassign</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Available Staff Pool Picker */
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchStaffTerm}
                  onChange={(e) => setSearchStaffTerm(e.target.value)}
                  placeholder="Filter personnel by name, email, or phone..."
                  className="pl-8.5 pr-8 h-9 text-xs"
                />
                {searchStaffTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchStaffTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {filteredAvailableStaff.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-border/80 bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    {searchStaffTerm
                      ? "No personnel match your search term."
                      : "All active field specialists are already assigned to this division."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40 rounded-xl border border-border/70 overflow-hidden bg-card/60 max-h-[380px] overflow-y-auto">
                  {filteredAvailableStaff.map((staff) => {
                    const isUnassigned =
                      !staff.departmentId && !staff.department;
                    const otherDeptName = staff.department?.name;

                    return (
                      <div
                        key={staff.id}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <UserAvatar user={staff} size="md" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-foreground truncate">
                                {staff.name}
                              </span>
                              {isUnassigned ? (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 inline-flex items-center gap-1"
                                >
                                  Available
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] text-muted-foreground shrink-0 truncate max-w-[150px]"
                                  title={`Currently in: ${otherDeptName}`}
                                >
                                  In: {otherDeptName}
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {staff.email} • ID: {staff.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleAssign(staff.id)}
                          className="h-8 px-2.5 text-xs text-primary border-primary/30 hover:bg-primary/10 shrink-0 gap-1.5 font-medium"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>{isUnassigned ? "Deploy" : "Reassign"}</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>
              Municipal Roster Pool: {staffUsers.length} total specialists
            </span>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
