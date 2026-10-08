"use client";

import { ClipboardList } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layouts/dashboard";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      userRole="STAFF"
      roleTitle="Field Desk"
      roleBadge="Field Crew"
      roleBadgeClassName="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      footerNote="CivicFlow Municipal Department Field Operations"
      footerSecurityText="SLA Tracked • Investigation Notes Logged"
      navGroups={[
        {
          title: "Field Operations",
          items: [
            {
              label: "Work Queue",
              href: "/staff",
              icon: ClipboardList,
              isActive: (path) =>
                path === "/staff" || path.startsWith("/staff/requests"),
              description: "Assigned departmental incident tickets",
            },
          ],
        },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
