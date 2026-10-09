"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Shield,
  ShieldAlert,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import { useUpdateUser } from "@/hooks/user.hooks";
import type { User, UserRole, UserStatus } from "@/types/auth.types";

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserEditModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: UserEditModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("CITIZEN");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  const [departmentId, setDepartmentId] = useState<string>("");

  const { data: deptData, isLoading: deptsLoading } = useGetDepartments();
  const departments = deptData?.data || [];

  const { mutateAsync: updateUserMutate, isPending: isUpdating } =
    useUpdateUser();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setRole(user.role || "CITIZEN");
      setStatus(user.status || "ACTIVE");
      setDepartmentId(user.departmentId || user.department?.id || "");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserMutate({
        userId: user.id,
        payload: {
          name: name.trim() || undefined,
          role,
          status,
          departmentId: role === "STAFF" ? departmentId || null : null,
        },
      });

      gooeyToast.success("User Record Updated", {
        description: `Successfully updated permissions and profile for ${user.email}.`,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      gooeyToast.error("Update Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          "Failed to update user profile.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-labelledby="user-edit-modal-title"
        aria-modal="true"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-blue-500 to-indigo-600" />

        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <UserCog className="size-5" />
            </div>
            <div>
              <h2
                id="user-edit-modal-title"
                className="text-lg font-bold text-foreground"
              >
                Governance Role & Account Settings
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="edit-user-name"
              className="text-xs font-semibold text-foreground"
            >
              Full Legal Name
            </label>
            <Input
              id="edit-user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              disabled={isUpdating}
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>System Role & Clearance Tier</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                Determines portal features
              </span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRole("CITIZEN")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  role === "CITIZEN"
                    ? "border-primary bg-primary/10 ring-1 ring-primary text-foreground"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
                  {role === "CITIZEN" && (
                    <CheckCircle2 className="size-3 text-primary" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">
                  Citizen
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Lodge & track tickets
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("STAFF")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  role === "STAFF"
                    ? "border-primary bg-primary/10 ring-1 ring-primary text-foreground"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
                  {role === "STAFF" && (
                    <CheckCircle2 className="size-3 text-primary" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">Staff</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Field operations
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  role === "ADMIN"
                    ? "border-primary bg-primary/10 ring-1 ring-primary text-foreground"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Shield className="size-4 text-purple-600 dark:text-purple-400" />
                  {role === "ADMIN" && (
                    <CheckCircle2 className="size-3 text-primary" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">Admin</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Full governance
                </span>
              </button>
            </div>
          </div>

          {role === "STAFF" && (
            <div className="space-y-1.5 p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 animate-in fade-in duration-200">
              <label
                htmlFor="staff-department-select"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Building2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Department Assignment</span>
              </label>
              <p className="text-[11px] text-muted-foreground mb-2">
                Field staff are strictly scoped to incidents assigned to their
                department.
              </p>
              <select
                id="staff-department-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={deptsLoading || isUpdating}
                className="w-full h-9 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select Department...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "ADMIN" && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-500/30 bg-purple-500/5 text-xs text-purple-700 dark:text-purple-300 animate-in fade-in duration-200">
              <ShieldAlert className="size-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">
                  High-Privilege Role Selected
                </span>
                <span className="text-[11px] opacity-90 leading-relaxed block mt-0.5">
                  Admins have unrestricted access to all service tickets, system
                  audit logs, user management, and financial ledgers.
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Account Access Status
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStatus("ACTIVE")}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  status === "ACTIVE"
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <UserCheck className="size-4 text-emerald-600" />
                <div className="text-left">
                  <span className="block font-semibold">Active</span>
                  <span className="text-[10px] opacity-80">
                    Normal platform access
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus("BLOCKED")}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  status === "BLOCKED"
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <AlertCircle className="size-4 text-rose-600" />
                <div className="text-left">
                  <span className="block font-semibold">Blocked</span>
                  <span className="text-[10px] opacity-80">
                    Suspended from logging in
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isUpdating}
              className="rounded-4xl px-4 text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isUpdating}
              className="gap-2 rounded-4xl px-5 text-xs font-semibold"
            >
              {isUpdating ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
