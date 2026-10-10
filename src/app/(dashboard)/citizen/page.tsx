import type { Metadata } from "next";
import CitizenDashboardView from "@/components/modules/citizen/CitizenDashboardView";

export const metadata: Metadata = {
  title: "Citizen Portal & Grievance Dossiers — CivicFlow",
  description:
    "Monitor municipal repair progress, review field technician notes, and confirm verified resolutions.",
};

export default function CitizenPortalPage() {
  return <CitizenDashboardView />;
}
