"use client";

import { ClipboardList, FilePlus2, ReceiptText } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layouts/dashboard";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      userRole="CITIZEN"
      roleTitle="Citizen Portal"
      roleBadge="Resident"
      roleBadgeClassName="border-primary/30 bg-primary/10 text-primary"
      footerNote="CivicFlow Public Intake & Verification Engine"
      footerSecurityText="SLA Monitored • 7-Day Reopen Rights Guaranteed"
      quickAction={{
        label: "Report Grievance",
        href: "/citizen/report",
        icon: FilePlus2,
      }}
      navGroups={[
        {
          title: "Public Intake & Billing",
          items: [
            {
              label: "My Complaints",
              href: "/citizen",
              icon: ClipboardList,
              isActive: (path) =>
                path === "/citizen" ||
                (path.startsWith("/citizen/requests") &&
                  path !== "/citizen/report" &&
                  !path.startsWith("/citizen/payments")),
              description: "Active complaints, state timeline, and SLA",
            },
            {
              label: "Invoices & Billing",
              href: "/citizen/payments",
              icon: ReceiptText,
              isActive: (path) => path.startsWith("/citizen/payments"),
              description: "Verified bKash receipts & municipal fees",
            },
            {
              label: "Report Issue",
              href: "/citizen/report",
              icon: FilePlus2,
              isActive: (path) => path === "/citizen/report",
              description: "60-second GPS grievance intake wizard",
            },
          ],
        },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
