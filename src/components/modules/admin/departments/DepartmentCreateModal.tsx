"use client";

import {
  AlertCircle,
  Building2,
  FileText,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment } from "@/hooks/department.hooks";
import { CreateDepartmentSchema } from "@/validation/department.validation";

interface DepartmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DepartmentCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: DepartmentCreateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );

  const { mutateAsync: createDeptMutate, isPending } = useCreateDepartment();

  if (!isOpen) return null;

  const handleReset = () => {
    setName("");
    setDescription("");
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = CreateDepartmentSchema.safeParse({
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
      await createDeptMutate(result.data);
      handleReset();
      onSuccess?.();
      onClose();
    } catch {
      // Error handled by hook's gooeyToast
    }
  };

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
        aria-labelledby="create-dept-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-indigo-500 to-sky-400" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="create-dept-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                Create Municipal Department
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Register a new civic division for automated routing & staff
                queues
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
          {/* Department Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="dept-name-input"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Department Name <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {name.length}/120
              </span>
            </div>
            <Input
              id="dept-name-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g., Parks & Public Recreation Bureau"
              maxLength={120}
              disabled={isPending}
              autoFocus
              className={
                errors.name
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""
              }
            />
            {errors.name ? (
              <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Official operational title as shown on citizen receipts and
                staff queues.
              </p>
            )}
          </div>

          {/* Department Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="dept-desc-input"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Functional Scope & Description
              </label>
              <span className="text-[11px] text-muted-foreground">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="dept-desc-input"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Detail the municipal services, equipment, jurisdiction boundaries, or emergency tasks handled by this division..."
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

          {/* Explanatory Tip Box */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-semibold text-foreground">
                Next Operational Step:
              </span>
              <p>
                After registering this department, link category routing rules
                to direct citizen grievances directly into its field staff
                roster.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
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
              className="gap-2 min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Create Division</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
