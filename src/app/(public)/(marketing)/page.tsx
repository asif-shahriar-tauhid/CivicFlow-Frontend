"use client";

import HeroSection from "@/components/modules/home/HeroSection";
import QuickTrackModal from "@/components/modules/home/QuickTrackModal";
import ServiceGrid from "@/components/modules/home/ServiceGrid";
import TelemetryBanner from "@/components/modules/home/TelemetryBanner";
import TrustGuarantees from "@/components/modules/home/TrustGuarantees";
import WorkflowSection from "@/components/modules/home/WorkflowSection";
import { useState } from "react";

export default function HomePage() {
  const [activeSearchTicket, setActiveSearchTicket] = useState<string | null>(
    null,
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Quick Ticket Tracking Search */}
      <HeroSection
        onSearchTicket={(ticketId) => setActiveSearchTicket(ticketId)}
      />

      {/* Real-time Public Telemetry Statistics */}
      <TelemetryBanner />

      {/* Core Municipal Department Services */}
      <ServiceGrid />

      {/* 4-Stage Lifecycle State Machine & SLA Process */}
      <WorkflowSection />

      {/* Public Trust, 7-Day Reopening Right, and Audit Integrity */}
      <TrustGuarantees />

      {/* Quick Track Telemetry Modal */}
      <QuickTrackModal
        ticketId={activeSearchTicket}
        onClose={() => setActiveSearchTicket(null)}
      />
    </div>
  );
}
