import type { Metadata } from "next";
import StaffQueueView from "@/components/modules/staff/StaffQueueView";

export const metadata: Metadata = {
  title: "Field Operations Desk — CivicFlow Staff Desk",
  description:
    "Manage assigned municipal work orders, track SLA countdowns, and execute field operations.",
};

export default function StaffQueuePage() {
  return <StaffQueueView />;
}
