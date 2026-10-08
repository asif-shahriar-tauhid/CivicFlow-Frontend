"use client";

import { Tag } from "lucide-react";
import type { CategoryBreakdownItem } from "@/types/dashboard.types";

interface CategoryBreakdownWidgetProps {
  categories: CategoryBreakdownItem[];
  totalIncidents: number;
}

const CATEGORY_COLORS = [
  "bg-amber-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-slate-500",
];

export function CategoryBreakdownWidget({
  categories,
  totalIncidents,
}: CategoryBreakdownWidgetProps) {
  const total = totalIncidents > 0 ? totalIncidents : 1;

  // Sort descending by count
  const sorted = [...categories].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Tag className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Incident Classification Categories
              </h3>
              <p className="text-xs text-muted-foreground">
                Grievance distribution across municipal statutory categories
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
            {categories.length} Categories
          </span>
        </div>

        {/* Categories Grid / Rows */}
        <div className="mt-5 space-y-3">
          {sorted.map((cat, idx) => {
            const pct = Math.round((cat.count / total) * 100);
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

            return (
              <div
                key={cat.categoryId || `cat-${idx}`}
                className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`size-2.5 rounded-full shrink-0 ${color}`}
                    />
                    <span className="font-semibold text-foreground truncate">
                      {cat.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="font-bold text-foreground">
                      {cat.count}
                    </span>
                    <span className="text-[11px] text-muted-foreground w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Automatic AI &amp; keyword triage mapping</span>
        <span className="font-mono">
          Top: {sorted[0]?.categoryName || "Standard"}
        </span>
      </div>
    </div>
  );
}
