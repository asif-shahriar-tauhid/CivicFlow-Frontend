"use client";

import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InvoiceReceipt } from "@/components/modules/payments";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePaymentById } from "@/hooks/payment.hooks";

export default function CitizenPaymentDetailPage() {
  const params = useParams();
  const paymentId = params?.paymentId as string;

  const { data: paymentData, isLoading, error } = usePaymentById(paymentId);
  const payment = paymentData?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Spinner />
        <span className="font-mono text-xs text-muted-foreground">
          Retrieving official payment certificate & receipt...
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
          Receipt Not Located
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          The requested payment record could not be found or you do not have
          authorization to view this receipt.
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/citizen/payments" />}
            nativeButton={false}
            className="rounded-4xl gap-1.5 text-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Payments Ledger</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 animate-in fade-in duration-200">
      <InvoiceReceipt payment={payment} backHref="/citizen/payments" />
    </div>
  );
}
