"use client";

import { AlertTriangle, Building2, Layers } from "lucide-react";
import type { DepartmentBreakdownItem } from "@/types/dashboard.types";

interface DepartmentBreakdownWidgetProps {
  departments: DepartmentBreakdownItem[];
  totalIncidents: number;
  selectedDepartmentId?: string;
  onSelectDepartment?: (deptId: string | undefined) => void;
}

const DEPT_COLORS = [
  "bg-blue-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
];

export function DepartmentBreakdownWidget({
  departments,
  totalIncidents,
  selectedDepartmentId,
  onSelectDepartment,
}: DepartmentBreakdownWidgetProps) {
  const total = totalIncidents > 0 ? totalIncidents : 1;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Department Workload Distribution
              </h3>
              <p className="text-xs text-muted-foreground">
                Cross-departmental incident triage and allocation share
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
            {departments.length} Units
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Overall Dispatch Ratio</span>
            <span className="font-mono">{totalIncidents} Total Tickets</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex shadow-inner">
            {departments.map((dept, idx) => {
              const pct = (dept.count / total) * 100;
              if (pct <= 0) return null;
              const color =
                dept.departmentId === null
                  ? "bg-rose-500"
                  : DEPT_COLORS[idx % DEPT_COLORS.length];
              return (
                <div
                  key={dept.departmentId || "unassigned"}
                  style={{ width: `${pct}%` }}
                  title={`${dept.departmentName}: ${dept.count} (${pct.toFixed(1)}%)`}
                  className={`${color} transition-all duration-500 hover:opacity-80`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {departments.map((dept, idx) => {
            const pct = Math.round((dept.count / total) * 100);
            const isUnassigned = dept.departmentId === null;
            const isSelected =
              selectedDepartmentId !== undefined &&
              (selectedDepartmentId === "" && isUnassigned
                ? true
                : selectedDepartmentId === dept.departmentId);
            const color = isUnassigned
              ? "bg-rose-500"
              : DEPT_COLORS[idx % DEPT_COLORS.length];

            return (
              <button
                type="button"
                key={dept.departmentId || `dept-${idx}`}
                onClick={() => {
                  if (onSelectDepartment) {
                    if (isSelected) {
                      onSelectDepartment(undefined);
                    } else {
                      onSelectDepartment(dept.departmentId || "");
                    }
                  }
                }}
                className={`w-full text-left group rounded-xl border p-3 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`size-2.5 rounded-full shrink-0 ${color}`}
                    />
                    <span className="font-semibold text-foreground truncate">
                      {dept.departmentName}
                    </span>
                    {isUnassigned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 text-[10px] font-bold">
                        <AlertTriangle className="size-2.5" />
                        Requires Triage
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="font-bold text-foreground">
                      {dept.count}
                    </span>
                    <span className="text-[11px] text-muted-foreground w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Layers className="size-3 text-primary" />
          <span>Click department row to filter operational list</span>
        </span>
        {selectedDepartmentId && (
          <button
            type="button"
            onClick={() => onSelectDepartment?.(undefined)}
            className="text-primary hover:underline font-medium"
          >
            Clear Department Filter
          </button>
        )}
      </div>
    </div>
  );
}
