"use client";

import { Download, ExternalLink, Eye, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency, formatDateTime } from "@/lib/paymentUtils";
import type { Payment } from "@/types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
  isAdmin?: boolean;
  emptyMessage?: string;
}

export function PaymentsTable({
  payments,
  isLoading = false,
  isAdmin = false,
  emptyMessage = "No payment records located.",
}: PaymentsTableProps) {
  const detailBaseRoute = isAdmin ? "/admin/payments" : "/citizen/payments";

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card">
        <Spinner />
        <span className="font-mono text-xs text-muted-foreground">
          Fetching municipal ledger transactions...
        </span>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Receipt className="size-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          {emptyMessage}
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          {isAdmin
            ? "No citizen service request fees match the current filter criteria."
            : "You have not made any payments for municipal service requests or appointments yet."}
        </p>
        {!isAdmin && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/citizen" />}
              nativeButton={false}
              className="rounded-4xl text-xs"
            >
              View My Tickets
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/40 font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3.5">Invoice #</th>
              <th className="px-4 py-3.5">Service Reference</th>
              {isAdmin && <th className="px-4 py-3.5">Citizen Payer</th>}
              <th className="px-4 py-3.5">Amount</th>
              <th className="px-4 py-3.5">Gateway / TrxID</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Recorded At</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => {
              const req = payment.serviceRequest;
              const citizen = req?.citizen || payment.appointment?.citizen;

              return (
                <tr
                  key={payment.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      href={`${detailBaseRoute}/${payment.id}`}
                      className="font-mono font-bold text-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {payment.merchantInvoiceNumber}
                    </Link>
                  </td>

                  <td className="px-4 py-3.5">
                    {req ? (
                      <div className="max-w-[220px]">
                        <Link
                          href={`${isAdmin ? "/admin" : "/citizen"}/requests/${req.id}`}
                          className="font-mono text-[11px] font-semibold text-primary hover:underline"
                        >
                          {req.requestNumber}
                        </Link>
                        <p
                          className="truncate text-[11px] text-muted-foreground"
                          title={req.title}
                        >
                          {req.title}
                        </p>
                      </div>
                    ) : payment.appointment ? (
                      <div className="max-w-[200px]">
                        <span className="font-mono text-[11px] font-semibold text-foreground">
                          Appointment #{payment.appointment.id.slice(0, 8)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-mono text-[11px]">
                        General Service
                      </span>
                    )}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-3.5">
                      <div className="max-w-[160px]">
                        <div className="font-medium text-foreground truncate">
                          {citizen?.name || "Citizen"}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground truncate">
                          {citizen?.email || "—"}
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-4 py-3.5 font-mono text-sm font-bold tabular-nums text-foreground">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-pink-500" />
                        bKash
                      </span>
                      <span className="font-mono text-[11px] font-medium text-foreground tabular-nums">
                        {payment.bkashTrxId || "—"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <PaymentStatusBadge status={payment.status} />
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                    {formatDateTime(payment.createdAt)}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {payment.status === "PENDING" && payment.checkoutUrl && (
                        <Button
                          variant="outline"
                          size="icon-xs"
                          render={
                            <a
                              href={payment.checkoutUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Resume bKash Checkout"
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          }
                          nativeButton={false}
                          title="Resume bKash Checkout"
                          className="rounded-4xl text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                        />
                      )}

                      {payment.invoiceUrl && (
                        <Button
                          variant="outline"
                          size="icon-xs"
                          render={
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Download PDF Invoice"
                            >
                              <Download className="size-3" />
                            </a>
                          }
                          nativeButton={false}
                          title="Download PDF Invoice"
                          className="rounded-4xl text-muted-foreground hover:text-foreground"
                        />
                      )}

                      <Button
                        variant="default"
                        size="xs"
                        render={
                          <Link href={`${detailBaseRoute}/${payment.id}`} />
                        }
                        nativeButton={false}
                        className="rounded-4xl gap-1"
                      >
                        <Eye className="size-3" />
                        <span>Receipt</span>
                      </Button>
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
