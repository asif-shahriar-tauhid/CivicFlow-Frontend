"use client";

import { Printer, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { PaymentKpiStrip, PaymentsTable } from "@/components/modules/payments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllPayments } from "@/hooks/payment.hooks";

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const {
    data: paymentsData,
    isLoading,
    refetch,
    isFetching,
  } = useAllPayments();

  const allPayments = paymentsData?.data || [];

  // Filter payments
  const filteredPayments = allPayments.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) {
      return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const invoiceMatch = p.merchantInvoiceNumber
        ?.toLowerCase()
        .includes(term);
      const trxMatch = p.bkashTrxId?.toLowerCase().includes(term);
      const reqNumberMatch = p.serviceRequest?.requestNumber
        ?.toLowerCase()
        .includes(term);
      const reqTitleMatch = p.serviceRequest?.title
        ?.toLowerCase()
        .includes(term);
      const citizenEmailMatch = p.serviceRequest?.citizen?.email
        ?.toLowerCase()
        .includes(term);
      const citizenNameMatch = p.serviceRequest?.citizen?.name
        ?.toLowerCase()
        .includes(term);

      if (
        !invoiceMatch &&
        !trxMatch &&
        !reqNumberMatch &&
        !reqTitleMatch &&
        !citizenEmailMatch &&
        !citizenNameMatch
      ) {
        return false;
      }
    }

    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Executive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Municipal Revenue & Payments Ledger
            </h1>
            <Badge variant="outline" className="border-primary/30 text-primary">
              City Treasury
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Official municipal audit ledger of citizen service request fees,
            bKash transactions, and electronic billing receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 rounded-4xl text-xs print:hidden"
          >
            <Printer className="size-3.5" />
            <span>Print Ledger</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 rounded-4xl text-xs"
          >
            <RefreshCw
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh Transactions</span>
          </Button>
        </div>
      </div>

      {/* Primary Revenue KPI Strip */}
      <PaymentKpiStrip payments={allPayments} isAdmin={true} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {/* Search Input */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search citizen, invoice #, TrxID, or ticket #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { label: "All Records", value: "ALL" },
              { label: "Settled", value: "COMPLETED" },
              { label: "Pending", value: "PENDING" },
              { label: "Failed / Cancelled", value: "FAILED" },
            ] as const
          ).map((tab) => {
            const isSelected = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ledger Table */}
      <PaymentsTable
        payments={filteredPayments}
        isLoading={isLoading}
        isAdmin={true}
        emptyMessage={
          searchTerm || statusFilter !== "ALL"
            ? "No payments match the specified query filters."
            : "No municipal payment records located in system ledger."
        }
      />
    </div>
  );
}
