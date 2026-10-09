"use client";

import {
  Clock,
  Download,
  ExternalLink,
  Eye,
  RotateCcw,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { useInitiatePayment } from "@/hooks/payment.hooks";
import { formatCurrency, formatDateTime } from "@/lib/paymentUtils";
import type { ServiceRequest } from "@/types/request.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface RequestFeePanelProps {
  ticket: ServiceRequest;
  onPaymentUpdated?: () => void;
}

export function RequestFeePanel({
  ticket,
  onPaymentUpdated,
}: RequestFeePanelProps) {
  const { mutate: initiatePayment, isPending: isInitiating } =
    useInitiatePayment();

  // Find completed payment or fallback to most recent payment record
  const payments = ticket.payments || [];
  const completedPayment = payments.find((p) => p.status === "COMPLETED");
  const effectivePayment =
    completedPayment || (payments.length > 0 ? payments[0] : null);

  // Fee calculation: check category fee or existing payment record
  const feeAmount = ticket.category?.feeAmount ?? effectivePayment?.amount ?? 0;
  const currency =
    ticket.category?.feeCurrency || effectivePayment?.currency || "BDT";
  const requiresPayment =
    (ticket.caseType === "SERVICE_REQUEST" && feeAmount > 0) ||
    payments.length > 0;

  if (!requiresPayment) {
    return null;
  }

  const isCompleted =
    Boolean(completedPayment) || effectivePayment?.status === "COMPLETED";
  const isPending = !isCompleted && effectivePayment?.status === "PENDING";
  const isFailed =
    !isCompleted &&
    (effectivePayment?.status === "FAILED" ||
      effectivePayment?.status === "CANCELLED");

  const handlePay = () => {
    initiatePayment(ticket.id, {
      onSuccess: (res) => {
        const checkoutUrl = res.data?.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          gooeyToast.info("Payment Created", {
            description: "Redirecting to bKash municipal gateway...",
          });
        }
        onPaymentUpdated?.();
      },
      onError: (err: Error) => {
        gooeyToast.error("Payment Gateway Error", {
          description:
            err.message || "Failed to establish session with bKash gateway.",
        });
      },
    });
  };

  if (isCompleted && effectivePayment) {
    return (
      <div className="overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-5 dark:bg-emerald-950/20 sm:p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Municipal Service Fee Settled
                </span>
                <PaymentStatusBadge status="COMPLETED" />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Payment verified. Department inspection crew dispatched under
                guaranteed SLA.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">
                  Amount:{" "}
                  <strong className="font-mono text-foreground tabular-nums">
                    {formatCurrency(
                      effectivePayment.amount,
                      effectivePayment.currency,
                    )}
                  </strong>
                </span>
                {effectivePayment.bkashTrxId && (
                  <span className="text-muted-foreground">
                    TrxID:{" "}
                    <strong className="font-mono text-foreground tabular-nums">
                      {effectivePayment.bkashTrxId}
                    </strong>
                  </span>
                )}
                <span className="text-muted-foreground">
                  Cleared:{" "}
                  <span className="font-mono text-muted-foreground">
                    {formatDateTime(
                      effectivePayment.completedAt ||
                        effectivePayment.createdAt,
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {effectivePayment.invoiceUrl && (
              <Button
                variant="outline"
                size="sm"
                render={
                  <a
                    href={effectivePayment.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download PDF Invoice"
                  >
                    <Download className="size-3.5" />
                    <span>PDF Invoice</span>
                  </a>
                }
                nativeButton={false}
                className="gap-1.5 rounded-4xl text-xs"
              />
            )}

            <Button
              variant="default"
              size="sm"
              render={
                <Link href={`/citizen/payments/${effectivePayment.id}`} />
              }
              nativeButton={false}
              className="gap-1.5 rounded-4xl text-xs shadow-xs"
            >
              <Eye className="size-3.5" />
              <span>Official Receipt</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isPending && effectivePayment) {
    return (
      <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-amber-50/50 p-5 dark:bg-amber-950/20 sm:p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Clock className="size-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Payment Checkout Pending
                </span>
                <PaymentStatusBadge status="PENDING" />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                An active bKash gateway session was created for this ticket.
                Complete payment to confirm department dispatch.
              </p>
              <div className="mt-2 flex items-center gap-3 font-mono text-xs">
                <span className="text-muted-foreground">
                  Fee:{" "}
                  <strong className="text-foreground tabular-nums">
                    {formatCurrency(feeAmount, currency)}
                  </strong>
                </span>
                <span className="text-muted-foreground">
                  Inv: #{effectivePayment.merchantInvoiceNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {effectivePayment.checkoutUrl && (
              <Button
                variant="default"
                size="sm"
                render={
                  <a
                    href={effectivePayment.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Complete payment in bKash"
                  >
                    <span>Complete in bKash</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                }
                nativeButton={false}
                className="gap-1.5 rounded-4xl text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              />
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handlePay}
              disabled={isInitiating}
              className="gap-1.5 rounded-4xl text-xs"
            >
              {isInitiating ? (
                <Spinner>Restarting...</Spinner>
              ) : (
                <>
                  <RotateCcw className="size-3.5" />
                  <span>Start New Session</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sky-500/30 bg-sky-50/50 p-5 dark:bg-sky-950/20 sm:p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <Shield className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                Municipal Service Fee Required
              </span>
              {isFailed ? (
                <PaymentStatusBadge status="FAILED" />
              ) : (
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                  Pre-Dispatch Due
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Official municipal service fee:{" "}
              <strong className="font-mono text-sm font-bold text-foreground tabular-nums">
                {formatCurrency(feeAmount, currency)}
              </strong>
              . Pay securely online via bKash gateway.
            </p>
            {isFailed && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                Previous checkout attempt failed or timed out. Please try again.
              </p>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={handlePay}
          disabled={isInitiating}
          className="gap-2 rounded-4xl text-xs shadow-xs shrink-0"
        >
          {isInitiating ? (
            <Spinner>Connecting bKash Gateway...</Spinner>
          ) : (
            <>
              <span>Pay {formatCurrency(feeAmount, currency)} via bKash</span>
              <ExternalLink className="size-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
