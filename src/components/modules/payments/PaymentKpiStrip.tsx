import { AlertCircle, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/paymentUtils";
import type { Payment } from "@/types/payment.types";

interface PaymentKpiStripProps {
  payments: Payment[];
  isAdmin?: boolean;
}

export function PaymentKpiStrip({
  payments,
  isAdmin = false,
}: PaymentKpiStripProps) {
  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const failedPayments = payments.filter(
    (p) => p.status === "FAILED" || p.status === "CANCELLED",
  );

  const totalCompletedAmount = completedPayments.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isAdmin ? "Municipal Revenue" : "Total Fees Settled"}
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
            {formatCurrency(totalCompletedAmount)}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {isAdmin
            ? "Cleared municipal collections via bKash gateway"
            : "Total disbursed for specialized municipal services"}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isAdmin ? "Settled Receipts" : "Official Invoices"}
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
            {completedPayments.length}
          </span>
          <span className="text-xs text-muted-foreground">invoices</span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Verified with digital timestamp & audit trace
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Awaiting Clearance
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
            {pendingPayments.length}
          </span>
          <span className="text-xs text-muted-foreground">sessions</span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Initiated checkout awaiting gateway reconciliation
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Failed / Cancelled
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
            {failedPayments.length}
          </span>
          <span className="text-xs text-muted-foreground">attempts</span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          User aborted or expired checkout tokens
        </p>
      </div>
    </div>
  );
}
