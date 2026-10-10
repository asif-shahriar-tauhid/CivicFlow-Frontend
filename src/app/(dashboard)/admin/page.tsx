import type { Metadata } from "next";
import AdminDashboardView from "@/components/modules/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Civic Operations & Governance — CivicFlow Admin Desk",
  description:
    "Municipal incident triage, department routing dispatch, and real-time SLA escalation monitoring.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
