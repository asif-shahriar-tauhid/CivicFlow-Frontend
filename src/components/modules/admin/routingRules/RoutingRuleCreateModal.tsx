"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  GitBranch,
  Info,
  MapPin,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import {
  useCreateRoutingRule,
  useGetCategories,
} from "@/hooks/routingRule.hooks";
import { MUNICIPAL_CATEGORIES } from "@/lib/constants/categories";
import { CreateRoutingRuleSchema } from "@/validation/routingRule.validation";

interface RoutingRuleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RoutingRuleCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: RoutingRuleCreateModalProps) {
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [errors, setErrors] = useState<{
    categoryId?: string;
    departmentId?: string;
    location?: string;
    priority?: string;
  }>({});

  // Data fetching
  const { data: deptData, isLoading: deptsLoading } = useGetDepartments();
  const { data: catData, isLoading: catsLoading } = useGetCategories();

  const activeDepartments = useMemo(() => {
    return (deptData?.data || []).filter((d) => !d.isArchived && d.isActive);
  }, [deptData]);

  const categories = useMemo(() => {
    if (catData?.data && catData.data.length > 0) {
      return catData.data;
    }
    // Fallback to static municipal categories
    return MUNICIPAL_CATEGORIES.map((c) => ({ id: c.id, name: c.name }));
  }, [catData]);

  const { mutateAsync: createRuleMutate, isPending } = useCreateRoutingRule();

  if (!isOpen) return null;

  const handleReset = () => {
    setCategoryId("");
    setDepartmentId("");
    setLocation("");
    setPriority(0);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedDepartment = activeDepartments.find(
    (d) => d.id === departmentId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = CreateRoutingRuleSchema.safeParse({
      categoryId,
      departmentId,
      location: location.trim() || undefined,
      priority: Number(priority),
    });

    if (!result.success) {
      const fieldErrors: {
        categoryId?: string;
        departmentId?: string;
        location?: string;
        priority?: string;
      } = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        if (path === "categoryId") fieldErrors.categoryId = issue.message;
        if (path === "departmentId") fieldErrors.departmentId = issue.message;
        if (path === "location") fieldErrors.location = issue.message;
        if (path === "priority") fieldErrors.priority = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await createRuleMutate(result.data);
      handleReset();
      onSuccess?.();
      onClose();
    } catch {
      // Error handled by hook toast
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
        className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-rule-title"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-indigo-500 to-emerald-400" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="create-rule-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                Configure Automated Routing Rule
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Build category-to-department automated dispatch pipelines with
                ward priorities
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
          {/* 1. Category Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="rule-cat-select"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Incident Category <span className="text-destructive">*</span>
            </label>
            <select
              id="rule-cat-select"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                if (errors.categoryId)
                  setErrors((prev) => ({ ...prev, categoryId: undefined }));
              }}
              disabled={isPending || catsLoading}
              className={`w-full h-10 px-3 rounded-xl border bg-background text-sm text-foreground transition-colors outline-none focus:ring-2 focus:ring-ring ${
                errors.categoryId
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-input"
              }`}
            >
              <option value="">— Select incident category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.categoryId}</span>
              </p>
            )}
          </div>

          {/* 2. Target Department Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="rule-dept-select"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Assigned Municipal Department{" "}
              <span className="text-destructive">*</span>
            </label>
            <select
              id="rule-dept-select"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                if (errors.departmentId)
                  setErrors((prev) => ({ ...prev, departmentId: undefined }));
              }}
              disabled={isPending || deptsLoading}
              className={`w-full h-10 px-3 rounded-xl border bg-background text-sm text-foreground transition-colors outline-none focus:ring-2 focus:ring-ring ${
                errors.departmentId
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-input"
              }`}
            >
              <option value="">— Select target department division —</option>
              {activeDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.departmentId}</span>
              </p>
            )}
          </div>

          {/* 3. Location Scope & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location Scope */}
            <div className="space-y-1.5">
              <label
                htmlFor="rule-location-input"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Ward / Location Scope
              </label>
              <Input
                id="rule-location-input"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: undefined }));
                }}
                placeholder="e.g. Ward 5 (blank for All Wards)"
                maxLength={500}
                disabled={isPending}
                className={errors.location ? "border-destructive" : ""}
              />
              <p className="text-[11px] text-muted-foreground">
                Leave blank for citywide global fallback.
              </p>
            </div>

            {/* Priority Weight */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="rule-priority-input"
                  className="text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Dispatch Priority (0–100)
                </label>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {priority >= 3
                    ? "High Precedence"
                    : priority > 0
                      ? "Custom Priority"
                      : "Default Fallback"}
                </Badge>
              </div>
              <Input
                id="rule-priority-input"
                type="number"
                min={0}
                max={100}
                value={priority}
                onChange={(e) => {
                  setPriority(
                    Math.max(0, Math.min(100, Number(e.target.value))),
                  );
                  if (errors.priority)
                    setErrors((prev) => ({ ...prev, priority: undefined }));
                }}
                disabled={isPending}
                className={errors.priority ? "border-destructive" : ""}
              />
              <p className="text-[11px] text-muted-foreground">
                Higher scores supersede lower-priority rules.
              </p>
            </div>
          </div>

          {/* Quick Location Scope Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-muted-foreground font-medium">
              Quick presets:
            </span>
            {[
              "Ward 1",
              "Ward 3",
              "Ward 5",
              "Dhanmondi",
              "Gulshan",
              "Uttara",
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setLocation(preset)}
                className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                +{preset}
              </button>
            ))}
            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="text-primary hover:underline text-[11px] ml-1"
              >
                Clear (All Wards)
              </button>
            )}
          </div>

          {/* 4. Live Dispatch Pipeline Simulation Card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <Zap className="h-3.5 w-3.5" />
              <span>Automated Dispatch Simulation</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-lg bg-card/80 border border-border/50 text-foreground">
              <div className="font-semibold text-primary truncate max-w-[180px]">
                {selectedCategory ? selectedCategory.name : "[Select Category]"}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
                <Badge variant="outline" className="text-[10px]">
                  {location ? `Scope: ${location}` : "🌐 Citywide Scope"}
                </Badge>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
              </div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[180px]">
                {selectedDepartment ? selectedDepartment.name : "[Select Dept]"}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              When a citizen files a grievance under this category in this
              location, CivicFlow will dispatch directly to this department
              without requiring manual triage.
            </p>
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
              disabled={isPending || !categoryId || !departmentId}
              className="gap-2 min-w-[150px]"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Wiring Rule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Deploy Pipeline</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
