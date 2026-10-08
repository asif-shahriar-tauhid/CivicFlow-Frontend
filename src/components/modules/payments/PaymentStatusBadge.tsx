import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatusConfig } from "@/lib/paymentUtils";
import type { PaymentStatus } from "@/types/payment.types";

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string;
  className?: string;
  showDot?: boolean;
}

export function PaymentStatusBadge({
  status,
  className,
  showDot = true,
}: PaymentStatusBadgeProps) {
  const config = getPaymentStatusConfig(status as PaymentStatus);

  return (
    <Badge
      variant={config.variant}
      dotColor={showDot ? config.dotColor : undefined}
      className={cn("whitespace-nowrap font-medium text-xs", className)}
      title={config.description}
    >
      {config.label}
    </Badge>
  );
}
