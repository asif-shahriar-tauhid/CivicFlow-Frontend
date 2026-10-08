"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  GitBranch,
  Inbox,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateDepartment } from "@/hooks/department.hooks";
import type { Department } from "@/types/department.types";
import { UpdateDepartmentSchema } from "@/validation/department.validation";

interface DepartmentEditModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DepartmentEditModal({
  department,
  isOpen,
  onClose,
  onSuccess,
}: DepartmentEditModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );

  const { mutateAsync: updateDeptMutate, isPending } = useUpdateDepartment();

  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setDescription(department.description || "");
      setErrors({});
    }
  }, [department]);

  if (!isOpen || !department) return null;

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = UpdateDepartmentSchema.safeParse({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    if (!result.success) {
      const fieldErrors: { name?: string; description?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "name") {
          fieldErrors.name = issue.message;
        } else if (issue.path[0] === "description") {
          fieldErrors.description = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await updateDeptMutate({
        departmentId: department.id,
        payload: {
          name: result.data.name,
          description: result.data.description,
        },
      });
      onSuccess?.();
      onClose();
    } catch {
      // Handled by hook gooeyToast
    }
  };

  const formattedDate = department.createdAt
    ? new Date(department.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) handleClose();
      }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dept-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="edit-dept-title"
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  Edit Department
                </h2>
                {department.isArchived ? (
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-600 text-[10px]"
                  >
                    Archived
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[10px]"
                  >
                    Operational
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                ID: {department.id.slice(0, 13)}...
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Reference Stats Pill */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/40 border border-border/50 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                <GitBranch className="h-3 w-3" /> Rules
              </span>
              <span className="text-sm font-bold text-foreground">
                {department._count?.routingRules ?? 0}
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-border/40">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                <Inbox className="h-3 w-3" /> Tickets
              </span>
              <span className="text-sm font-bold text-foreground">
                {department._count?.serviceRequests ?? 0}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Registered
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {formattedDate || "—"}
              </span>
            </div>
          </div>

          {/* Department Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-dept-name"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Department Name <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {name.length}/120
              </span>
            </div>
            <Input
              id="edit-dept-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Department Name"
              maxLength={120}
              disabled={isPending}
              className={
                errors.name
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""
              }
            />
            {errors.name && (
              <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Department Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-dept-desc"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Functional Scope & Description
              </label>
              <span className="text-[11px] text-muted-foreground">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="edit-dept-desc"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Department operations description..."
              maxLength={500}
              rows={4}
              disabled={isPending}
              className={
                errors.description
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""
              }
            />
            {errors.description && (
              <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="gap-2 min-w-[130px]"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
