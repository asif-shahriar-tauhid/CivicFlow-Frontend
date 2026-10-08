"use client";

import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InvoiceReceipt } from "@/components/modules/payments";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePaymentById } from "@/hooks/payment.hooks";

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const paymentId = params?.paymentId as string;

  const { data: paymentData, isLoading, error } = usePaymentById(paymentId);
  const payment = paymentData?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Spinner />
        <span className="font-mono text-xs text-muted-foreground">
          Fetching municipal treasury payment record...
        </span>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-destructive/20 bg-card p-8 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <FileQuestion className="size-6" />
        </div>
        <h2 className="mt-4 text-base font-bold text-foreground">
          Payment Record Not Found
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          The requested payment transaction could not be located in the
          municipal treasury database.
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/admin/payments" />}
            nativeButton={false}
            className="rounded-4xl gap-1.5 text-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Revenue Ledger</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 animate-in fade-in duration-200">
      <InvoiceReceipt payment={payment} backHref="/admin/payments" />
    </div>
  );
}
