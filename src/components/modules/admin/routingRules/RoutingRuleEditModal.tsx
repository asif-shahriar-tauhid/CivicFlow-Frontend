"use client";

import {
  ArrowRight,
  Calendar,
  Edit3,
  Globe,
  MapPin,
  Save,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetDepartments } from "@/hooks/department.hooks";
import {
  useGetCategories,
  useUpdateRoutingRule,
} from "@/hooks/routingRule.hooks";
import { MUNICIPAL_CATEGORIES } from "@/lib/constants/categories";
import type { CategoryRoutingRule } from "@/types/routingRule.types";
import { UpdateRoutingRuleSchema } from "@/validation/routingRule.validation";

interface RoutingRuleEditModalProps {
  rule: CategoryRoutingRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RoutingRuleEditModal({
  rule,
  isOpen,
  onClose,
  onSuccess,
}: RoutingRuleEditModalProps) {
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [_errors, setErrors] = useState<{
    categoryId?: string;
    departmentId?: string;
    location?: string;
    priority?: string;
  }>({});

  const { data: deptData, isLoading: deptsLoading } = useGetDepartments();
  const { data: catData, isLoading: catsLoading } = useGetCategories();

  const activeDepartments = useMemo(() => {
    return (deptData?.data || []).filter((d) => !d.isArchived && d.isActive);
  }, [deptData]);

  const categories = useMemo(() => {
    if (catData?.data && catData.data.length > 0) {
      return catData.data;
    }
    return MUNICIPAL_CATEGORIES.map((c) => ({ id: c.id, name: c.name }));
  }, [catData]);

  const { mutateAsync: updateRuleMutate, isPending } = useUpdateRoutingRule();

  useEffect(() => {
    if (rule) {
      setCategoryId(rule.categoryId || rule.category?.id || "");
      setDepartmentId(rule.departmentId || rule.department?.id || "");
      setLocation(rule.location || "");
      setPriority(rule.priority ?? 0);
      setErrors({});
    }
  }, [rule]);

  if (!isOpen || !rule) return null;

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedDepartment = activeDepartments.find(
    (d) => d.id === departmentId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = UpdateRoutingRuleSchema.safeParse({
      categoryId: categoryId || undefined,
      departmentId: departmentId || undefined,
      location: location.trim() ? location.trim() : null,
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
      await updateRuleMutate({
        ruleId: rule.id,
        payload: {
          categoryId: result.data.categoryId,
          departmentId: result.data.departmentId,
          location: result.data.location,
          priority: result.data.priority,
        },
      });
      onSuccess?.();
      onClose();
    } catch {
    }
  };

  const formattedDate = rule.createdAt
    ? new Date(rule.createdAt).toLocaleDateString("en-US", {
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
        className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-rule-title"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="flex items-start justify-between p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="edit-rule-title"
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  Edit Routing Rule
                </h2>
                {rule.isArchived ? (
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
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                Rule ID: {rule.id.slice(0, 13)}...
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created: {formattedDate || "—"}</span>
            </div>
            <div className="font-mono text-[11px]">
              Priority: {rule.priority}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-rule-cat"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Incident Category
            </label>
            <select
              id="edit-rule-cat"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isPending || catsLoading}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-rule-dept"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Assigned Municipal Department
            </label>
            <select
              id="edit-rule-dept"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={isPending || deptsLoading}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {activeDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="edit-rule-location"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Ward / Location Scope
              </label>
              <Input
                id="edit-rule-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ward 5 (blank for All Wards)"
                maxLength={500}
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-rule-priority"
                  className="text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Priority (0–100)
                </label>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Score: {priority}
                </Badge>
              </div>
              <Input
                id="edit-rule-priority"
                type="number"
                min={0}
                max={100}
                value={priority}
                onChange={(e) =>
                  setPriority(
                    Math.max(0, Math.min(100, Number(e.target.value))),
                  )
                }
                disabled={isPending}
              />
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
              <Zap className="h-3.5 w-3.5" />
              <span>Simulated Automated Pipeline</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-lg bg-card/80 border border-border/50 text-foreground">
              <div className="font-semibold text-primary truncate max-w-[180px]">
                {selectedCategory?.name || rule.category.name}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
                <Badge
                  variant="outline"
                  className="text-[10px] inline-flex items-center gap-1"
                >
                  {location ? (
                    <>
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>Scope: {location}</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                      <span>Citywide Scope</span>
                    </>
                  )}
                </Badge>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
              </div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[180px]">
                {selectedDepartment?.name || rule.department.name}
              </div>
            </div>
          </div>

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
              disabled={isPending}
              className="gap-2 min-w-[140px]"
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
