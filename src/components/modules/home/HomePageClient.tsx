"use client";

import { useState } from "react";
import CitizenTestimonialsSection from "@/components/modules/home/CitizenTestimonialsSection";
import DepartmentDirectorySection from "@/components/modules/home/DepartmentDirectorySection";
import FaqSection from "@/components/modules/home/FaqSection";
import HeroSection from "@/components/modules/home/HeroSection";
import MunicipalAdvisoriesSection from "@/components/modules/home/MunicipalAdvisoriesSection";
import QuickTrackModal from "@/components/modules/home/QuickTrackModal";
import RecentPublicIssuesSection from "@/components/modules/home/RecentPublicIssuesSection";
import ServiceGrid from "@/components/modules/home/ServiceGrid";
import TelemetryBanner from "@/components/modules/home/TelemetryBanner";
import TrustGuarantees from "@/components/modules/home/TrustGuarantees";
import WardAlertCtaSection from "@/components/modules/home/WardAlertCtaSection";
import WorkflowSection from "@/components/modules/home/WorkflowSection";

export default function HomePageClient() {
  const [activeSearchTicket, setActiveSearchTicket] = useState<string | null>(
    null,
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        onSearchTicket={(ticketId) => setActiveSearchTicket(ticketId)}
      />

      {/* 2. Public Municipal Telemetry (Live Statistics) */}
      <TelemetryBanner />

      {/* 3. Core Municipal Services (4-Column Card Grid with Skeleton & View Details -> /explore/[id]) */}
      <ServiceGrid />

      {/* 4. Recent Public Grievances & Resolutions (4-Column Live Card Listing -> /explore/[id]) */}
      <RecentPublicIssuesSection
        onInspectTicket={(ticketNumber) => setActiveSearchTicket(ticketNumber)}
      />

      {/* 5. How CivicFlow Works (4-Stage Lifecycle Workflow) */}
      <WorkflowSection />

      {/* 6. Department SLA & Permit Tariff Directory */}
      <DepartmentDirectorySection />

      {/* 7. Trust & Accountability Guarantees (Bento Grid) */}
      <TrustGuarantees />

      {/* 8. Verified Citizen Closure Reviews (Testimonials) */}
      <CitizenTestimonialsSection />

      {/* 9. Municipal Bulletins & Infrastructure Advisories */}
      <MunicipalAdvisoriesSection />

      {/* 10. Frequently Asked Municipal Questions (Interactive FAQ Accordion) */}
      <FaqSection />

      {/* 11. Ward Alert Subscription & Final Call to Action */}
      <WardAlertCtaSection />

      {/* Quick Ticket Tracker Modal */}
      <QuickTrackModal
        ticketId={activeSearchTicket}
        onClose={() => setActiveSearchTicket(null)}
      />
    </div>
  );
}
