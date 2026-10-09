"use client";

import { useState } from "react";
import HeroSection from "@/components/modules/home/HeroSection";
import QuickTrackModal from "@/components/modules/home/QuickTrackModal";
import ServiceGrid from "@/components/modules/home/ServiceGrid";
import TelemetryBanner from "@/components/modules/home/TelemetryBanner";
import TrustGuarantees from "@/components/modules/home/TrustGuarantees";
import WorkflowSection from "@/components/modules/home/WorkflowSection";

export default function HomePage() {
  const [activeSearchTicket, setActiveSearchTicket] = useState<string | null>(
    null,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        onSearchTicket={(ticketId) => setActiveSearchTicket(ticketId)}
      />

      <TelemetryBanner />

      <ServiceGrid />

      <WorkflowSection />

      <TrustGuarantees />

      <QuickTrackModal
        ticketId={activeSearchTicket}
        onClose={() => setActiveSearchTicket(null)}
      />
    </div>
  );
}
