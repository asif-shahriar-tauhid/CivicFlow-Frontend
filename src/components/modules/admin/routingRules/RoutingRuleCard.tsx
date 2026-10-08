"use client";

import {
  AlertTriangle,
  Archive,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  GitBranch,
  Layers,
  MapPin,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CategoryRoutingRule } from "@/types/routingRule.types";

interface RoutingRuleCardProps {
  rule: CategoryRoutingRule;
  onEdit: (rule: CategoryRoutingRule) => void;
  onArchive: (rule: CategoryRoutingRule) => void;
  onRestore: (rule: CategoryRoutingRule) => void;
}

export function RoutingRuleCard({
  rule,
  onEdit,
  onArchive,
  onRestore,
}: RoutingRuleCardProps) {
  const isArchived = Boolean(rule.isArchived || !rule.isActive);

  const formattedDate = rule.createdAt
    ? new Date(rule.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 hover:shadow-lg ${
        isArchived
          ? "border-border/50 bg-muted/20 opacity-80 hover:opacity-100 hover:border-amber-500/40"
          : "border-border/70 bg-card/70 backdrop-blur-md hover:border-primary/40 hover:-translate-y-0.5"
      }`}
    >
      {/* Top Accent line */}
      <div
        className={`h-1 w-full rounded-t-2xl ${
          isArchived
            ? "bg-muted-foreground/30"
            : rule.priority >= 3
              ? "bg-linear-to-r from-amber-500 via-primary to-emerald-500 group-hover:h-1.5 transition-all"
              : "bg-linear-to-r from-primary via-indigo-500 to-sky-400 group-hover:h-1.5 transition-all"
        }`}
      />

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Top Header: Category & Status */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${
                  isArchived
                    ? "border-muted bg-muted text-muted-foreground"
                    : "border-primary/20 bg-primary/10 text-primary"
                }`}
              >
                <Layers className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Grievance Category
                </span>
                <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {rule.category?.name || "Unassigned Category"}
                </h3>
              </div>
            </div>

            {/* Status Pill */}
            {isArchived ? (
              <Badge
                variant="outline"
                className="border-muted-foreground/30 bg-muted text-muted-foreground text-[10px] shrink-0"
              >
                Archived
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] shrink-0 flex items-center gap-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </Badge>
            )}
          </div>

          {/* Visual Pipeline Dispatch Arrow */}
          <div className="mt-3.5 p-3 rounded-xl bg-muted/30 border border-border/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Dispatches to
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono ${
                  rule.priority >= 3
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 font-bold"
                    : "border-border text-muted-foreground"
                }`}
              >
                Priority P{rule.priority}
              </Badge>
            </div>
            <div className="font-semibold text-sm text-foreground flex items-center gap-2 line-clamp-1">
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">
                {rule.department?.name || "Department"}
              </span>
            </div>
          </div>
        </div>

        {/* Scope Pill & Meta */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Jurisdiction Scope:
            </span>
            {rule.location ? (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {rule.location}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] text-muted-foreground"
              >
                🌐 All Wards (Fallback)
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Deployed:
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {formattedDate || "Active"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">
            {rule.id.slice(0, 8)}...
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(rule)}
              className="h-8 px-2.5 text-xs gap-1 border-border/70 hover:bg-muted"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>

            {isArchived ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRestore(rule)}
                className="h-8 px-2.5 text-xs gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onArchive(rule)}
                className="h-8 px-2.5 text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Archive className="h-3.5 w-3.5" />
                <span>Archive</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
