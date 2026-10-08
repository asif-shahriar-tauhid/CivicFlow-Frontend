"use client";

import { ArrowLeft, Download, Printer, Shield } from "lucide-react";
import Link from "next/link";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/paymentUtils";
import type { Payment } from "@/types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface InvoiceReceiptProps {
  payment: Payment;
  backHref?: string;
  showBackAction?: boolean;
}

export function InvoiceReceipt({
  payment,
  backHref,
  showBackAction = true,
}: InvoiceReceiptProps) {
  const isPaid = payment.status === "COMPLETED";
  const serviceRequest = payment.serviceRequest;
  const citizen = serviceRequest?.citizen || payment.appointment?.citizen;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        {showBackAction && backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Payments</span>
          </Link>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {payment.invoiceUrl && (
            <Button
              variant="outline"
              size="sm"
              render={
                <a
                  href={payment.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Cloud PDF Invoice"
                >
                  <Download className="size-3.5" />
                  <span>Download Cloud PDF</span>
                </a>
              }
              nativeButton={false}
              className="gap-1.5 rounded-4xl text-xs"
            />
          )}

          <Button
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 rounded-4xl text-xs shadow-xs"
          >
            <Printer className="size-3.5" />
            <span>Print Official Receipt</span>
          </Button>
        </div>
      </div>

      {/* Printable Receipt Paper Container */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10 print:border-none print:p-0 print:shadow-none">
        {/* Background Status Watermark */}
        {isPaid && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none print:opacity-[0.05]">
            <span className="font-mono text-8xl font-black uppercase tracking-widest text-emerald-600 rotate-[-20deg]">
              SETTLED
            </span>
          </div>
        )}

        {/* Municipal Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Logo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  CivicFlow
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  Official Receipt
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Municipal Corporation Department of Public Revenue
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                System Reference: BANGLADESH-GOV-CIVICFLOW-FIN-AUTH
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <PaymentStatusBadge status={payment.status} />
            </div>
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              Invoice #{payment.merchantInvoiceNumber}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Date: {formatDateTime(payment.createdAt)}
            </div>
          </div>
        </div>

        {/* Bill Metadata Grid */}
        <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2">
          {/* Citizen / Payer Info */}
          <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Billed To
            </span>
            <div className="text-sm font-semibold text-foreground">
              {citizen?.name || "Civic Citizen"}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {citizen?.email || "—"}
            </div>
            {citizen?.phone && (
              <div className="font-mono text-xs text-muted-foreground">
                Tel: {citizen.phone}
              </div>
            )}
          </div>

          {/* Payment & Gateway Telemetry */}
          <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Gateway Settlement Details
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold text-foreground">
                bKash Online Gateway
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">bKash TrxID:</span>
              <span className="font-mono font-bold text-foreground tabular-nums">
                {payment.bkashTrxId || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Settlement Date:</span>
              <span className="font-mono text-foreground tabular-nums">
                {formatDateTime(payment.completedAt || payment.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Service Request Link Note */}
        {serviceRequest && (
          <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wide text-primary">
                Service Request Reference
              </span>
              <span className="font-mono font-semibold text-foreground">
                {serviceRequest.requestNumber}
              </span>
            </div>
            <div className="mt-1 font-medium text-foreground">
              {serviceRequest.title}
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-muted-foreground">
              {serviceRequest.department && (
                <span>Dept: {serviceRequest.department.name}</span>
              )}
              {serviceRequest.category && (
                <span>Category: {serviceRequest.category.name}</span>
              )}
            </div>
          </div>
        )}

        {/* Line Items Table */}
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Rate</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-foreground">
                    {serviceRequest?.category?.name ||
                      "Municipal Administrative & Field Inspection Fee"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Specialized municipal dispatch, equipment clearance & SLA
                    routing
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center font-mono tabular-nums text-muted-foreground">
                  1
                </td>
                <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted-foreground">
                  {formatCurrency(payment.amount, payment.currency)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold tabular-nums text-foreground">
                  {formatCurrency(payment.amount, payment.currency)}
                </td>
              </tr>
            </tbody>
            <tfoot className="border-t border-border bg-muted/20 font-medium">
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-2.5 text-right text-muted-foreground"
                >
                  Subtotal
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">
                  {formatCurrency(payment.amount, payment.currency)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-2 text-right text-muted-foreground"
                >
                  Municipal Tax / VAT (Exempt)
                </td>
                <td className="px-4 py-2 text-right font-mono tabular-nums text-muted-foreground">
                  ৳ 0.00
                </td>
              </tr>
              <tr className="border-t border-border text-sm font-bold">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right text-foreground"
                >
                  Total Cleared
                </td>
                <td className="px-4 py-3 text-right font-mono text-base font-extrabold tabular-nums text-primary">
                  {formatCurrency(payment.amount, payment.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Security Stamp & Verification Footer */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="size-4 text-primary shrink-0" />
            <span>
              Cryptographically verified by CivicFlow City Treasury. No physical
              signature required.
            </span>
          </div>

          <div className="font-mono text-[10px] text-muted-foreground text-left sm:text-right">
            AUTH-KEY: {payment.id.slice(0, 12)}...
          </div>
        </div>
      </div>
    </div>
  );
}
