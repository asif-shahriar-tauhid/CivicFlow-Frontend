"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PaymentAnalytics } from "@/types/dashboard.types";

interface FinancialVelocityWidgetProps {
  payments: PaymentAnalytics;
}

export function FinancialVelocityWidget({
  payments,
}: FinancialVelocityWidgetProps) {
  const completedAmount = Number(payments?.completed?.totalAmount || 0);
  const pendingAmount = Number(payments?.pending?.totalAmount || 0);
  const totalAmount = completedAmount + pendingAmount;
  const totalTxns =
    (payments?.completed?.count || 0) + (payments?.pending?.count || 0);

  const collectionRate =
    totalAmount > 0 ? Math.round((completedAmount / totalAmount) * 100) : 100;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CircleDollarSign className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Revenue &amp; bKash Influx
              </h3>
              <p className="text-xs text-muted-foreground">
                Municipal statutory fees &amp; settlement velocity
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
            {collectionRate}% Collected
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-border/60 bg-linear-to-br from-muted/30 to-muted/10 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Completed Settlements
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-foreground font-mono">
              {completedAmount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-muted-foreground">BDT</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 className="size-3" />
            <span>
              {payments?.completed?.count || 0} reconciled bKash transactions
            </span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Clock className="size-3 text-amber-500" />
              <span className="text-[11px] font-semibold">Pending Ledger</span>
            </div>
            <span className="text-base font-bold text-foreground font-mono">
              {pendingAmount.toLocaleString()} BDT
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
              {payments?.pending?.count || 0} awaiting checkout
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <CreditCard className="size-3 text-primary" />
              <span className="text-[11px] font-semibold">Total Assessed</span>
            </div>
            <span className="text-base font-bold text-foreground font-mono">
              {totalAmount.toLocaleString()} BDT
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
              {totalTxns} total invoiced
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Real-time bKash tokenized gateway
        </span>
        <Button
          variant="ghost"
          size="xs"
          render={<Link href="/admin/payments" />}
          nativeButton={false}
          className="gap-1 text-primary hover:text-primary text-xs"
        >
          <span>Open Revenue Ledger</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
