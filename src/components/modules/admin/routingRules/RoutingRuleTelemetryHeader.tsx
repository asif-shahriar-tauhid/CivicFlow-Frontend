"use client";

import { GitBranch, Layers, MapPin, Shield, Zap } from "lucide-react";
import type { CategoryRoutingRule } from "@/types/routingRule.types";

interface RoutingRuleTelemetryHeaderProps {
  rules: CategoryRoutingRule[];
  isLoading?: boolean;
}

export function RoutingRuleTelemetryHeader({
  rules,
  isLoading = false,
}: RoutingRuleTelemetryHeaderProps) {
  const total = rules.length;
  const active = rules.filter((r) => !r.isArchived && r.isActive).length;
  const archived = rules.filter((r) => r.isArchived || !r.isActive).length;

  const activeCategoriesCovered = new Set(
    rules.filter((r) => !r.isArchived && r.isActive).map((r) => r.categoryId),
  ).size;

  const localizedRules = rules.filter((r) =>
    Boolean(r.location?.trim()),
  ).length;
  const globalFallbackRules = total - localizedRules;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Routing Pipelines
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {isLoading ? "—" : total}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                configured
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <GitBranch className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span>Category-to-division automation</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Dispatch Rules
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {isLoading ? "—" : active}
              </span>
              <span className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
                active
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Zap className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto-triaging incoming reports</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories Covered
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                {isLoading ? "—" : activeCategoriesCovered}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                statutory categories
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Layers className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <Shield className="h-3.5 w-3.5 text-indigo-500" />
          <span>Zero-touch automatic dispatch</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jurisdiction Scopes
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
                {isLoading ? "—" : localizedRules}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                ward-specific
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <MapPin className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
          <span>Global Fallbacks: {globalFallbackRules}</span>
          <span>Archived: {archived}</span>
        </div>
      </div>
    </div>
  );
}
