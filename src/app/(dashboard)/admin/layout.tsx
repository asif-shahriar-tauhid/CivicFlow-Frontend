"use client";

import {
  Building2,
  CircleDollarSign,
  GitBranch,
  LayoutDashboard,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layouts/dashboard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      userRole="ADMIN"
      roleTitle="Admin Desk"
      roleBadge="Super Admin"
      roleBadgeClassName="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
      footerNote="CivicFlow Municipal Governance & Routing Administration"
      footerSecurityText="Security Level 4 • Audit Logged Operations"
      navGroups={[
        {
          title: "Executive Controls",
          items: [
            {
              label: "Overview & Triage",
              href: "/admin",
              icon: LayoutDashboard,
              isActive: (path) => path === "/admin",
              description: "Citywide incident triage and analytics",
            },
            {
              label: "Departments",
              href: "/admin/departments",
              icon: Building2,
              isActive: (path) => path.startsWith("/admin/departments"),
              description: "Municipal divisions & routing desks",
            },
            {
              label: "Routing Rules",
              href: "/admin/routing-rules",
              icon: GitBranch,
              isActive: (path) => path.startsWith("/admin/routing-rules"),
              description: "Automated dispatch rule builder table",
            },
            {
              label: "Personnel & Citizens",
              href: "/admin/users",
              icon: Users,
              isActive: (path) => path.startsWith("/admin/users"),
              description: "RBAC governance and personnel roster",
            },
            {
              label: "Municipal Revenue",
              href: "/admin/payments",
              icon: CircleDollarSign,
              isActive: (path) => path.startsWith("/admin/payments"),
              description: "bKash payments ledger and financial velocity",
            },
          ],
        },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
