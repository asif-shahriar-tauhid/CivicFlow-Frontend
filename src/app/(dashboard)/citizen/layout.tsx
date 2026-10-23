"use client";

import { ClipboardList, FilePlus2, ReceiptText } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layouts/dashboard";
import Footer from "@/components/layouts/public/Footer";
import Header from "@/components/layouts/public/Header";
import { useAuth } from "@/providers/authProvider";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isPublicRequestDetail = /^\/citizen\/requests\/[^/]+$/.test(
    pathname || "",
  );

  // Public visitors can view issue name & details at /citizen/requests/[id] in read-only mode
  if (isPublicRequestDetail && !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <DashboardShell
      userRole="CITIZEN"
      allowedRoles={["CITIZEN", "ADMIN", "STAFF"]}
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
