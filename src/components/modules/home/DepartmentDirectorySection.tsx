"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MUNICIPAL_CATEGORIES } from "@/lib/constants/categories";

type FilterType = "ALL" | "FREE" | "PERMIT";

export default function DepartmentDirectorySection() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredCategories = useMemo(() => {
    return MUNICIPAL_CATEGORIES.filter((cat) => {
      if (filter === "FREE") return cat.feeAmount === 0;
      if (filter === "PERMIT") return cat.feeAmount > 0;
      return true;
    });
  }, [filter]);

  return (
    <section
      id="departments"
      className="w-full py-16 lg:py-20 bg-muted/20 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              SLA &amp; Tariff Schedule
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Department SLA &amp; Permit Tariff Directory
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Every grievance category is mapped to a responsible municipal
              division, a binding SLA resolution window, and transparent digital
              bKash fee rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-card p-1 self-start lg:self-auto">
            {[
              { id: "ALL" as const, label: "All Categories (6)" },
              { id: "FREE" as const, label: "Free Public Intake (2)" },
              { id: "PERMIT" as const, label: "Fee & Permit Backed (4)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  filter === tab.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={
            filteredCategories.length === 2
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto items-stretch"
              : filteredCategories.length === 4
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
                : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
          }
        >
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isFree = category.feeAmount === 0;

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="font-mono text-[11px] border-primary/30 text-primary bg-primary/5"
                      >
                        <Clock className="size-3 mr-1" />
                        {category.slaHours}h SLA
                      </Badge>
                      <Badge
                        variant={isFree ? "secondary" : "outline"}
                        className={
                          isFree
                            ? "font-mono text-[11px] text-emerald-600 dark:text-emerald-400"
                            : "font-mono text-[11px]"
                        }
                      >
                        {isFree ? (
                          <>
                            <CheckCircle2 className="size-3 mr-1" />
                            Free Intake
                          </>
                        ) : (
                          <>
                            <CreditCard className="size-3 mr-1" />
                            {category.feeAmount} {category.feeCurrency}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-1">
                    <Building2 className="size-3.5 shrink-0" />
                    <span>{category.departmentName}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Common Dispatch Triggers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {category.quickPrompts.map((prompt) => (
                        <span
                          key={prompt}
                          className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {prompt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    <span>Auto-Routed Queue</span>
                  </span>

                  <Button
                    variant="outline"
                    size="xs"
                    render={
                      <Link
                        href={`/login?redirect=/citizen/report?category=${category.id}`}
                      />
                    }
                    nativeButton={false}
                    className="gap-1 rounded-full text-xs font-semibold hover:border-primary/40 hover:text-primary"
                  >
                    <span>File Request</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
