import type { Metadata } from "next";
import HomePageClient from "@/components/modules/home/HomePageClient";

export const metadata: Metadata = {
  title: "CivicFlow — Municipal Operations & Civic Telemetry",
  description:
    "Citizen-first municipal service intake, transparent grievance redressal, and deterministic SLA governance platform.",
};

export default function HomePage() {
  return <HomePageClient />;
}
