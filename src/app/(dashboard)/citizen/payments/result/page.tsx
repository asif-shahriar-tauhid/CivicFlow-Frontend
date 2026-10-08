"use client";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  Eye,
  RotateCcw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePaymentById } from "@/hooks/payment.hooks";
import { formatCurrency, formatDateTime } from "@/lib/paymentUtils";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") || "";
  const paramStatus = searchParams.get("status") || "";
  const requestId = searchParams.get("requestId") || "";

  // Poll payment if not yet terminal
  const { data: paymentData, refetch } = usePaymentById(paymentId);
  const payment = paymentData?.data;

  // Resolved status prefer fetched data, fallback to query param
  const currentStatus = payment?.status || paramStatus || "PENDING";
  const isCompleted = currentStatus === "COMPLETED";
  const isFailed = currentStatus === "FAILED" || currentStatus === "CANCELLED";
  const isPending = currentStatus === "PENDING";

  // Auto-poll a few times if pending
  useEffect(() => {
    if (isPending && paymentId) {
      const timer = setInterval(() => {
        refetch();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isPending, paymentId, refetch]);

  const serviceRequest = payment?.serviceRequest;
  const targetRequestId = requestId || serviceRequest?.id;

  return (
    <div className="mx-auto max-w-2xl py-8 animate-in fade-in duration-300">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Top Status Header */}
        <div
          className={`px-6 py-8 sm:px-10 text-center ${
            isCompleted
              ? "bg-emerald-500/10 border-b border-emerald-500/20"
              : isFailed
                ? "bg-rose-500/10 border-b border-rose-500/20"
                : "bg-amber-500/10 border-b border-amber-500/20"
          }`}
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl">
            {isCompleted ? (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-10" />
              </div>
            ) : isFailed ? (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <XCircle className="size-10" />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Spinner className="size-8" />
              </div>
            )}
          </div>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {isCompleted
              ? "Municipal Service Fee Settled"
              : isFailed
                ? "Payment Unsuccessful or Cancelled"
                : "Confirming Gateway Settlement..."}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
            {isCompleted
              ? "Your bKash transaction was verified and officially credited to the municipal service dispatch fund."
              : isFailed
                ? "The payment session did not complete. No funds were debited or the checkout authorization timed out."
                : "Reconciling live payment webhook with bKash gateway. Please do not close this window."}
          </p>
        </div>

        {/* Transaction Telemetry Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {payment && (
            <div className="rounded-xl border border-border/70 bg-muted/20 p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount Settled</span>
                <span className="font-mono text-base font-bold tabular-nums text-foreground">
                  {formatCurrency(payment.amount, payment.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-mono font-semibold text-foreground">
                  {payment.merchantInvoiceNumber}
                </span>
              </div>

              {payment.bkashTrxId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">bKash TrxID</span>
                  <span className="font-mono font-bold text-foreground tabular-nums">
                    {payment.bkashTrxId}
                  </span>
                </div>
              )}

              {payment.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Settlement Time</span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {formatDateTime(payment.completedAt)}
                  </span>
                </div>
              )}

              {serviceRequest && (
                <div className="border-t border-border/50 pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Associated Ticket
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {serviceRequest.requestNumber}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isCompleted && (
              <>
                {payment?.invoiceUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download PDF Invoice"
                      >
                        <Download className="size-3.5" />
                        <span>Download PDF Invoice</span>
                      </a>
                    }
                    nativeButton={false}
                    className="w-full sm:w-auto gap-1.5 rounded-4xl text-xs"
                  />
                )}

                {paymentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/citizen/payments/${paymentId}`} />}
                    nativeButton={false}
                    className="w-full sm:w-auto gap-1.5 rounded-4xl text-xs"
                  >
                    <Eye className="size-3.5" />
                    <span>View Official Receipt</span>
                  </Button>
                )}

                {targetRequestId && (
                  <Button
                    variant="default"
                    size="sm"
                    render={
                      <Link href={`/citizen/requests/${targetRequestId}`} />
                    }
                    nativeButton={false}
                    className="w-full sm:w-auto gap-1.5 rounded-4xl text-xs shadow-xs"
                  >
                    <span>Track Ticket Progress</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </>
            )}

            {isFailed &&
              (targetRequestId ? (
                <Button
                  variant="default"
                  size="sm"
                  render={
                    <Link href={`/citizen/requests/${targetRequestId}`} />
                  }
                  nativeButton={false}
                  className="w-full sm:w-auto gap-1.5 rounded-4xl text-xs shadow-xs"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Return to Ticket & Retry</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  render={<Link href="/citizen" />}
                  nativeButton={false}
                  className="w-full sm:w-auto gap-1.5 rounded-4xl text-xs shadow-xs"
                >
                  <span>Return to My Tickets</span>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CitizenPaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <Spinner />
          <span className="font-mono text-xs text-muted-foreground">
            Verifying payment transaction...
          </span>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
