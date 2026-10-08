"use client";

import {
  Archive,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  GitBranch,
  Layers,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CategoryRoutingRule } from "@/types/routingRule.types";

interface RoutingRulesTableProps {
  rules: CategoryRoutingRule[];
  onEdit: (rule: CategoryRoutingRule) => void;
  onArchive: (rule: CategoryRoutingRule) => void;
  onRestore: (rule: CategoryRoutingRule) => void;
}

export function RoutingRulesTable({
  rules,
  onEdit,
  onArchive,
  onRestore,
}: RoutingRulesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3.5 px-4">Incident Category</th>
              <th className="py-3.5 px-4">Target Municipal Desk</th>
              <th className="py-3.5 px-4">Jurisdiction Scope</th>
              <th className="py-3.5 px-4 text-center">Priority</th>
              <th className="py-3.5 px-4">Pipeline Status</th>
              <th className="py-3.5 px-4">Registered</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rules.map((rule) => {
              const isArchived = Boolean(rule.isArchived || !rule.isActive);
              const formattedDate = rule.createdAt
                ? new Date(rule.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—";

              return (
                <tr
                  key={rule.id}
                  className={`group transition-colors ${
                    isArchived
                      ? "bg-muted/10 opacity-75 hover:opacity-100 hover:bg-muted/30"
                      : "hover:bg-muted/30"
                  }`}
                >
                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
                          isArchived
                            ? "border-muted bg-muted text-muted-foreground"
                            : "border-primary/20 bg-primary/10 text-primary"
                        }`}
                      >
                        <Layers className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {rule.category?.name || "Unassigned"}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {rule.id.slice(0, 13)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Destination Department */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {rule.department?.name || "Department"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location Scope */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {rule.location ? (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 w-fit"
                      >
                        <MapPin className="h-3 w-3" />
                        {rule.location}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-[11px] italic">
                        🌐 All Wards (Fallback)
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        rule.priority >= 3
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 font-bold"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      P{rule.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isArchived ? (
                      <Badge
                        variant="outline"
                        className="border-muted-foreground/30 bg-muted text-muted-foreground text-[10px]"
                      >
                        Archived
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center gap-1 w-fit"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </Badge>
                    )}
                  </td>

                  {/* Registered */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground text-[11px]">
                    {formattedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(rule)}
                        className="h-7 px-2 text-xs gap-1 border-border/70 hover:bg-muted"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>

                      {isArchived ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRestore(rule)}
                          className="h-7 px-2 text-xs gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Restore</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onArchive(rule)}
                          className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Archive className="h-3 w-3" />
                          <span>Archive</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
