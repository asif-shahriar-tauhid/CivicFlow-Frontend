import type { PaymentStatus } from "@/types/payment.types";

/**
 * Formats a monetary amount into Bangladeshi Taka (or specified currency)
 * e.g. ৳ 1,250.00
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency = "BDT",
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  if (Number.isNaN(numericAmount)) return "৳ 0.00";

  const formattedNumber = new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  if (currency === "BDT") {
    return `৳ ${formattedNumber}`;
  }
  return `${currency} ${formattedNumber}`;
}

export interface PaymentStatusConfig {
  label: string;
  variant:
    | "default"
    | "primary"
    | "outline"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info";
  dotColor: string;
  description: string;
  isTerminal: boolean;
}

export function getPaymentStatusConfig(
  status: PaymentStatus | string,
): PaymentStatusConfig {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Payment Settled",
        variant: "success",
        dotColor: "bg-emerald-500",
        description: "Official municipal service fee verified and deposited.",
        isTerminal: true,
      };
    case "PENDING":
      return {
        label: "Awaiting Gateway",
        variant: "warning",
        dotColor: "bg-amber-500 animate-pulse",
        description:
          "Transaction initialized with bKash. Awaiting citizen confirmation.",
        isTerminal: false,
      };
    case "FAILED":
      return {
        label: "Payment Failed",
        variant: "destructive",
        dotColor: "bg-rose-500",
        description:
          "Transaction was rejected or gateway connection timed out.",
        isTerminal: true,
      };
    case "CANCELLED":
      return {
        label: "Cancelled by User",
        variant: "outline",
        dotColor: "bg-slate-400",
        description: "Citizen closed or aborted the payment authorization.",
        isTerminal: true,
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        variant: "info",
        dotColor: "bg-sky-500",
        description: "Funds returned to the citizen bKash account.",
        isTerminal: true,
      };
    case "UNPAID":
    default:
      return {
        label: "Payment Due",
        variant: "default",
        dotColor: "bg-zinc-400",
        description: "Official municipal service fee required before dispatch.",
        isTerminal: false,
      };
  }
}

export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "—";
  }
}
