"use client";

import {
  AlertCircle,
  Building2,
  Check,
  Clock,
  Info,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  useConfigureCategorySla,
  useGetCategorySlaConfigs,
} from "@/hooks/sla.hooks";
import { MUNICIPAL_CATEGORIES } from "@/lib/constants/categories";
import type { RequestCategory } from "@/types/request.types";

interface CategorySlaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SlaPreset {
  label: string;
  hours: number;
  minutes: number;
  badge: string;
  description: string;
}

const SLA_PRESETS: SlaPreset[] = [
  {
    label: "6 Hours",
    hours: 6,
    minutes: 360,
    badge: "Urgent",
    description: "Rapid emergency hazards",
  },
  {
    label: "12 Hours",
    hours: 12,
    minutes: 720,
    badge: "Same Day",
    description: "Priority municipal action",
  },
  {
    label: "24 Hours",
    hours: 24,
    minutes: 1440,
    badge: "1 Day",
    description: "Standard daily target",
  },
  {
    label: "48 Hours",
    hours: 48,
    minutes: 2880,
    badge: "2 Days",
    description: "Expedited public works",
  },
  {
    label: "72 Hours",
    hours: 72,
    minutes: 4320,
    badge: "3 Days",
    description: "Standard municipal timeline",
  },
  {
    label: "5 Days",
    hours: 120,
    minutes: 7200,
    badge: "5 Days",
    description: "Heavy infrastructural inspection",
  },
  {
    label: "7 Days",
    hours: 168,
    minutes: 10080,
    badge: "1 Week",
    description: "Complex civil projects",
  },
];

export function CategorySlaModal({
  isOpen,
  onClose,
  onSuccess,
}: CategorySlaModalProps) {
  // Query live categories from backend
  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetCategorySlaConfigs();
  const { mutateAsync: configureSla, isPending } = useConfigureCategorySla();

  // Active categories list with fallback
  const rawCategories: RequestCategory[] = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      return categoriesResponse.data;
    }
    // Fallback to municipal default categories if network or offline
    return MUNICIPAL_CATEGORIES.map((mc) => ({
      id: mc.id,
      name: mc.name,
      description: mc.description,
      feeAmount: mc.feeAmount,
      feeCurrency: mc.feeCurrency,
      slaMinutes: mc.slaHours * 60,
      isActive: true,
    }));
  }, [categoriesResponse]);

  // Filters & Selected Category
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTier, setFilterTier] = useState<
    "ALL" | "URGENT" | "STANDARD" | "EXTENDED"
  >("ALL");
  const [selectedCategory, setSelectedCategory] =
    useState<RequestCategory | null>(null);

  // Edit form state
  const [customValue, setCustomValue] = useState<number>(24);
  const [customUnit, setCustomUnit] = useState<"HOURS" | "DAYS" | "MINUTES">(
    "HOURS",
  );

  // When selecting a category to edit, seed the custom values
  const handleSelectCategory = (cat: RequestCategory) => {
    setSelectedCategory(cat);
    const mins = cat.slaMinutes || 1440;
    if (mins % 1440 === 0 && mins >= 1440) {
      setCustomValue(mins / 1440);
      setCustomUnit("DAYS");
    } else if (mins % 60 === 0) {
      setCustomValue(mins / 60);
      setCustomUnit("HOURS");
    } else {
      setCustomValue(mins);
      setCustomUnit("MINUTES");
    }
  };

  // Calculate minutes from currently entered values
  const targetMinutes = useMemo(() => {
    if (customUnit === "DAYS") return Math.round(customValue * 1440);
    if (customUnit === "HOURS") return Math.round(customValue * 60);
    return Math.round(customValue);
  }, [customValue, customUnit]);

  // Projected breach date from current time
  const projectedBreachPreview = useMemo(() => {
    if (!targetMinutes || targetMinutes < 1) return null;
    const date = new Date(Date.now() + targetMinutes * 60 * 1000);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [targetMinutes]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return rawCategories.filter((cat) => {
      const matchSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        Boolean(
          cat.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase().trim()),
        );

      if (!matchSearch) return false;

      const hours = (cat.slaMinutes || 1440) / 60;
      if (filterTier === "URGENT" && hours > 24) return false;
      if (filterTier === "STANDARD" && (hours <= 24 || hours > 48))
        return false;
      if (filterTier === "EXTENDED" && hours <= 48) return false;

      return true;
    });
  }, [rawCategories, searchTerm, filterTier]);

  // Submit configured SLA timer
  const handleSaveSla = async () => {
    if (!selectedCategory) return;
    if (targetMinutes < 1 || targetMinutes > 525600) return;

    try {
      await configureSla({
        categoryId: selectedCategory.id,
        payload: { slaMinutes: targetMinutes },
      });

      // Update selected category in local state
      setSelectedCategory((prev) =>
        prev ? { ...prev, slaMinutes: targetMinutes } : null,
      );

      onSuccess?.();
      refetch();
    } catch {
      // Handled by mutation hook toast
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-sla-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isPending) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-border/70 bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 my-auto">
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-primary to-emerald-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-border/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="category-sla-title"
                  className="font-bold text-lg text-foreground sm:text-xl"
                >
                  Configure Category SLA Timers
                </h3>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 text-[10px] font-mono px-2"
                >
                  Policy Engine
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                Define standard turnaround targets and breach countdown limits
                per grievance category. Newly filed complaints will inherit
                these service deadlines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 px-2.5 text-xs gap-1 border-border/70"
              title="Refresh categories"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : "text-muted-foreground"}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
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
        </div>

        {/* Modal Main Body (2 Columns) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Categories List (7 Columns) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            {/* Search & Tier Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter category name..."
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

              {/* Tier Filter Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/50 text-[11px] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setFilterTier("ALL")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterTier === "ALL"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({rawCategories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("URGENT")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterTier === "URGENT"
                      ? "bg-background text-destructive shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ≤24h
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("STANDARD")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterTier === "STANDARD"
                      ? "bg-background text-primary shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  24–48h
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("EXTENDED")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterTier === "EXTENDED"
                      ? "bg-background text-purple-600 dark:text-purple-400 shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  &gt;48h
                </button>
              </div>
            </div>

            {/* Category Cards List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-border/60 bg-muted/20">
                <Spinner className="h-6 w-6 text-primary" />
                <span className="mt-2 text-xs text-muted-foreground">
                  Loading category SLA policies...
                </span>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center rounded-xl border border-dashed border-border/70 bg-muted/10">
                <AlertCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-xs font-medium text-foreground">
                  No matching grievance categories found
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Try adjusting search keyword or tier filters.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredCategories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  const mins = cat.slaMinutes || 1440;
                  const hours = mins / 60;
                  const days = (mins / 1440).toFixed(1);

                  // Find companion metadata from static definitions
                  const staticMeta = MUNICIPAL_CATEGORIES.find(
                    (mc) => mc.id === cat.id || mc.name === cat.name,
                  );
                  const Icon = staticMeta?.icon || Clock;

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full group relative p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                          : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                            }`}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-foreground">
                                {cat.name}
                              </h4>
                              {staticMeta?.departmentName && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                                  <Building2 className="h-2.5 w-2.5" />
                                  {staticMeta.departmentName}
                                </span>
                              )}
                            </div>
                            {cat.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Current SLA Pill */}
                        <div className="flex flex-col items-end shrink-0">
                          <Badge
                            variant="outline"
                            className={`font-mono text-xs font-bold px-2 py-0.5 gap-1 ${
                              hours <= 24
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : hours <= 48
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>
                              {hours % 1 === 0 ? hours : hours.toFixed(1)}h
                            </span>
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {Number(days) >= 1 ? `${days}d` : `${mins}m`}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Editor Workspace (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-border/80 bg-muted/20 p-5 space-y-5">
            {selectedCategory ? (
              <div className="space-y-4">
                {/* Active Category Header */}
                <div className="pb-3 border-b border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Active Category Editor
                  </span>
                  <h4 className="text-sm font-bold text-foreground mt-0.5">
                    {selectedCategory.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Current SLA:</span>
                    <strong className="text-foreground font-mono">
                      {Math.round((selectedCategory.slaMinutes || 1440) / 60)}{" "}
                      hours
                    </strong>
                    <span>({selectedCategory.slaMinutes || 1440} minutes)</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Standard Turnaround Presets</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {SLA_PRESETS.map((preset) => {
                      const isCurrentPreset = targetMinutes === preset.minutes;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setCustomValue(preset.hours);
                            setCustomUnit("HOURS");
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all flex flex-col justify-between ${
                            isCurrentPreset
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                              : "bg-card text-foreground border-border/70 hover:border-primary/50 hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{preset.label}</span>
                            {isCurrentPreset && (
                              <Check className="h-3 w-3 shrink-0" />
                            )}
                          </div>
                          <span
                            className={`text-[9px] mt-0.5 ${
                              isCurrentPreset
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {preset.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Duration Stepper & Input */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <label
                    htmlFor="sla-duration-input"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <Sliders className="h-3.5 w-3.5 text-primary" />
                    <span>Custom Target Duration</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="sla-duration-input"
                        type="number"
                        min={1}
                        max={
                          customUnit === "DAYS"
                            ? 365
                            : customUnit === "HOURS"
                              ? 8760
                              : 525600
                        }
                        value={customValue || ""}
                        onChange={(e) =>
                          setCustomValue(
                            Math.max(1, Number(e.target.value) || 1),
                          )
                        }
                        className="h-10 text-sm font-mono font-bold"
                      />
                    </div>

                    {/* Unit Selector */}
                    <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border/60">
                      <button
                        type="button"
                        onClick={() => setCustomUnit("HOURS")}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          customUnit === "HOURS"
                            ? "bg-background text-foreground shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Hours
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomUnit("DAYS")}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          customUnit === "DAYS"
                            ? "bg-background text-foreground shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Days
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomUnit("MINUTES")}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          customUnit === "MINUTES"
                            ? "bg-background text-foreground shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Mins
                      </button>
                    </div>
                  </div>

                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <span>Adjust:</span>
                    <button
                      type="button"
                      onClick={() => setCustomValue((v) => Math.max(1, v - 1))}
                      className="px-2 py-0.5 rounded bg-muted/80 hover:bg-muted text-[11px] font-mono border border-border/50"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomValue((v) => v + 1)}
                      className="px-2 py-0.5 rounded bg-muted/80 hover:bg-muted text-[11px] font-mono border border-border/50"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomValue((v) => Math.max(1, v - 6))}
                      className="px-2 py-0.5 rounded bg-muted/80 hover:bg-muted text-[11px] font-mono border border-border/50"
                    >
                      -6
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomValue((v) => v + 6)}
                      className="px-2 py-0.5 rounded bg-muted/80 hover:bg-muted text-[11px] font-mono border border-border/50"
                    >
                      +6
                    </button>
                  </div>
                </div>

                {/* Calculation & Timeline Simulation Preview */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5" />
                      Calculated SLA Threshold
                    </span>
                    <span className="font-mono">
                      {targetMinutes.toLocaleString()} mins
                    </span>
                  </div>

                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Equates to:</span>
                      <strong className="text-foreground">
                        {(targetMinutes / 60).toFixed(1)} Hours (
                        {(targetMinutes / 1440).toFixed(2)} Days)
                      </strong>
                    </div>
                    {projectedBreachPreview && (
                      <div className="flex items-center justify-between pt-1 border-t border-primary/10">
                        <span>Breach timestamp:</span>
                        <strong className="text-foreground font-mono">
                          {projectedBreachPreview}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Delta difference */}
                  {selectedCategory.slaMinutes !== targetMinutes && (
                    <div className="pt-1.5 border-t border-primary/15 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Variance:</span>
                      {targetMinutes < selectedCategory.slaMinutes ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Tightened by{" "}
                          {Math.round(
                            (selectedCategory.slaMinutes - targetMinutes) / 60,
                          )}
                          h
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Extended by{" "}
                          {Math.round(
                            (targetMinutes - selectedCategory.slaMinutes) / 60,
                          )}
                          h
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Notice alert */}
                <div className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed bg-muted/40 p-2.5 rounded-lg border border-border/50">
                  <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    New tickets logged under{" "}
                    <strong>{selectedCategory.name}</strong> will receive this
                    deadline timer. Active tickets maintain their existing
                    timestamps.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-12 w-12 rounded-2xl bg-muted/70 flex items-center justify-center text-muted-foreground mb-3">
                  <Sliders className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Select a Grievance Category
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                  Pick any category from the left pane to adjust its target
                  turnaround hours, quick presets, and audit configuration.
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isPending}
                className="text-xs"
              >
                Close
              </Button>
              {selectedCategory && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveSla}
                  disabled={
                    isPending ||
                    targetMinutes === selectedCategory.slaMinutes ||
                    targetMinutes < 1
                  }
                  className="text-xs gap-1.5 font-semibold shadow-xs"
                >
                  {isPending ? (
                    <>
                      <Spinner className="h-3.5 w-3.5" />
                      <span>Saving Timer...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Apply SLA Duration</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
