"use client";

import {
  Archive,
  Building2,
  Clock,
  Edit3,
  GitBranch,
  Inbox,
  RotateCcw,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Department } from "@/types/department.types";

interface DepartmentCardProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onArchive: (dept: Department) => void;
  onRestore: (dept: Department) => void;
  onManageRoster: (dept: Department) => void;
}

export function DepartmentCard({
  department,
  onEdit,
  onArchive,
  onRestore,
  onManageRoster,
}: DepartmentCardProps) {
  const isArchived = Boolean(department.isArchived || !department.isActive);
  const rulesCount = department._count?.routingRules ?? 0;
  const requestsCount = department._count?.serviceRequests ?? 0;

  const formattedDate = department.createdAt
    ? new Date(department.createdAt).toLocaleDateString("en-US", {
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
      <div
        className={`h-1 w-full rounded-t-2xl ${
          isArchived
            ? "bg-muted-foreground/30"
            : "bg-linear-to-r from-primary via-indigo-500 to-sky-400 group-hover:h-1.5 transition-all"
        }`}
      />

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
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
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {department.name}
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground">
                  ID: {department.id.slice(0, 8)}...
                </span>
              </div>
            </div>

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

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[48px]">
            {department.description || (
              <span className="italic text-muted-foreground/60">
                No detailed operational description provided.
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2 border border-border/30">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <GitBranch className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                Routing Rules
              </div>
              <div className="text-xs font-bold text-foreground">
                {rulesCount} active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2 border border-border/30">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Inbox className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                Grievances
              </div>
              <div className="text-xs font-bold text-foreground">
                {requestsCount} tickets
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formattedDate ? `Added ${formattedDate}` : "Active"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onManageRoster(department)}
              className="h-8 px-2.5 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
              title="Manage department staff roster"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Roster</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(department)}
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
                onClick={() => onRestore(department)}
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
                onClick={() => onArchive(department)}
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
