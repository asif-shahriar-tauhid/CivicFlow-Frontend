"use client";

import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { PaymentKpiStrip, PaymentsTable } from "@/components/modules/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyPayments } from "@/hooks/payment.hooks";

export default function CitizenPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const {
    data: paymentsData,
    isLoading,
    refetch,
    isFetching,
  } = useMyPayments();

  const allPayments = paymentsData?.data || [];

  // Filter client-side for immediate responsiveness
  const filteredPayments = allPayments.filter((p) => {
    // Status filter
    if (statusFilter !== "ALL" && p.status !== statusFilter) {
      return false;
    }

    // Search filter
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

      if (!invoiceMatch && !trxMatch && !reqNumberMatch && !reqTitleMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Invoices & Municipal Receipts
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Live Billing
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete transaction ledger for municipal service request fees,
            official receipts, and verified cloud invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            <span>Refresh Ledger</span>
          </Button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <PaymentKpiStrip payments={allPayments} />

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice #, TrxID, or ticket #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { label: "All", value: "ALL" },
              { label: "Settled", value: "COMPLETED" },
              { label: "Pending", value: "PENDING" },
              { label: "Failed / Expired", value: "FAILED" },
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

      {/* Main Transactions Table */}
      <PaymentsTable
        payments={filteredPayments}
        isLoading={isLoading}
        emptyMessage={
          searchTerm || statusFilter !== "ALL"
            ? "No payments match your filter criteria."
            : "No municipal payment records found."
        }
      />
    </div>
  );
}
