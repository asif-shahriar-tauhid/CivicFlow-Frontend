"use client";

import {
  Archive,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  GitBranch,
  Inbox,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Department } from "@/types/department.types";

interface DepartmentsTableProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onArchive: (dept: Department) => void;
  onRestore: (dept: Department) => void;
}

export function DepartmentsTable({
  departments,
  onEdit,
  onArchive,
  onRestore,
}: DepartmentsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3.5 px-4">Department Division</th>
              <th className="py-3.5 px-4">Operational Status</th>
              <th className="py-3.5 px-4">Scope & Mandate</th>
              <th className="py-3.5 px-4 text-center">Routing Rules</th>
              <th className="py-3.5 px-4 text-center">Grievances</th>
              <th className="py-3.5 px-4">Registered</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {departments.map((dept) => {
              const isArchived = Boolean(dept.isArchived || !dept.isActive);
              const rulesCount = dept._count?.routingRules ?? 0;
              const requestsCount = dept._count?.serviceRequests ?? 0;
              const formattedDate = dept.createdAt
                ? new Date(dept.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—";

              return (
                <tr
                  key={dept.id}
                  className={`group transition-colors ${
                    isArchived
                      ? "bg-muted/10 opacity-75 hover:opacity-100 hover:bg-muted/30"
                      : "hover:bg-muted/30"
                  }`}
                >
                  {/* Department Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border shrink-0 ${
                          isArchived
                            ? "border-muted bg-muted text-muted-foreground"
                            : "border-primary/20 bg-primary/10 text-primary"
                        }`}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {dept.name}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {dept.id.slice(0, 13)}...
                        </div>
                      </div>
                    </div>
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
                        Operational
                      </Badge>
                    )}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-muted-foreground leading-relaxed">
                      {dept.description || (
                        <span className="italic text-muted-foreground/60">
                          No description provided
                        </span>
                      )}
                    </p>
                  </td>

                  {/* Rules Count */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 text-xs">
                      <GitBranch className="h-3 w-3 text-indigo-500" />
                      {rulesCount}
                    </span>
                  </td>

                  {/* Requests Count */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 text-xs">
                      <Inbox className="h-3 w-3 text-amber-500" />
                      {requestsCount}
                    </span>
                  </td>

                  {/* Registered Date */}
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
                        onClick={() => onEdit(dept)}
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
                          onClick={() => onRestore(dept)}
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
                          onClick={() => onArchive(dept)}
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
