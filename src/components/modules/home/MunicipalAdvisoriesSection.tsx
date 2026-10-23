"use client";

import {
  Calendar,
  Clock,
  Eye,
  FileText,
  MapPin,
  ShieldAlert,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MunicipalAdvisory {
  id: string;
  code: string;
  title: string;
  category: string;
  wardScope: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  fullDetails: string[];
}

const ADVISORIES: MunicipalAdvisory[] = [
  {
    id: "adv-1",
    code: "BULLETIN-2026-104",
    title: "Pre-Monsoon Storm Culvert Desilting Schedule",
    category: "Drainage & Flood Control",
    wardScope: "Wards 08, 12, 15 & 19",
    date: "Oct 21, 2026",
    readTime: "3 min read",
    image: "/images/service-drainage.webp",
    summary:
      "Nightly high-pressure jetting and box-culvert desilting operations scheduled across primary flood corridors.",
    fullDetails: [
      "The Drainage & Sewerage Department has deployed 14 vacuum jetting units across Wards 08, 12, 15, and 19 between 11:00 PM and 05:00 AM daily.",
      "Residents are requested to report any dislodged storm grate covers or localized water stagnation via CivicFlow for immediate 24-hour SLA dispatch.",
      "Extracted silt is transported directly to designated municipal landfill cells within 4 hours of excavation.",
    ],
  },
  {
    id: "adv-2",
    code: "BULLETIN-2026-099",
    title: "Smart High-Mast LED Streetlight Grid Upgrade",
    category: "Electrical Engineering",
    wardScope: "Wards 01–07 Corridor",
    date: "Oct 18, 2026",
    readTime: "2 min read",
    image: "/images/service-lighting.webp",
    summary:
      "Replacement of legacy sodium lamps with telemetry-enabled LED luminaires and automated fault relays.",
    fullDetails: [
      "Over 1,250 street poles in Wards 01 through 07 are being retrofitted with smart photocell LED luminaires.",
      "Priority 12-hour SLA enforcement is active for dark school zones, hospital approaches, and pedestrian footbridges.",
      "Citizens can tag pole serial numbers or GPS coordinates directly in the CivicFlow mobile intake wizard.",
    ],
  },
  {
    id: "adv-3",
    code: "BULLETIN-2026-094",
    title: "Digital bKash Permit & Road Excavation Protocol",
    category: "Civil Works & Permits",
    wardScope: "Citywide Commercial Zones",
    date: "Oct 14, 2026",
    readTime: "4 min read",
    image: "/images/service-roads.webp",
    summary:
      "Updated municipal tariff rules for utility trenching, commercial road cuts, and instant PDF invoice verification.",
    fullDetails: [
      "All utility trenching and commercial excavation permits now process exclusively through CivicFlow's tokenized bKash gateway.",
      "Once payment is reconciled, an immutable PDF tax & permit receipt is generated and field inspectors are dispatched within 48 hours.",
      "Unauthorized road cuts without a valid CF-2026 permit dossier are subject to immediate municipal stop-work orders.",
    ],
  },
  {
    id: "adv-4",
    code: "BULLETIN-2026-088",
    title: "Secondary Transfer Station & Bulk Waste Timings",
    category: "Solid Waste Management",
    wardScope: "All Residential Wards",
    date: "Oct 10, 2026",
    readTime: "3 min read",
    image: "/images/service-waste.webp",
    summary:
      "Revised morning compaction schedules and on-demand demolition rubble haulage booking for residents.",
    fullDetails: [
      "Household waste collection vans complete primary lane pickups before 08:30 AM daily across all residential wards.",
      "For renovation debris or bulk concrete haulage, citizens can file a Service Request with a flat 350 BDT disposal tariff.",
      "Illegal roadside dumping complaints carry a strict 24-hour SLA clearance mandate with photographic verification.",
    ],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function MunicipalAdvisoriesSection() {
  const [selectedAdvisory, setSelectedAdvisory] =
    useState<MunicipalAdvisory | null>(null);

  return (
    <section
      id="advisories"
      className="w-full py-16 lg:py-20 bg-muted/20 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Public Notices &amp; Civic Briefings
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Municipal Bulletins &amp; Infrastructure Advisories
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Official engineering schedules, preventive maintenance notices,
              and municipal policy updates across city wards.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-card px-3 py-1.5 rounded-full border border-border self-start md:self-auto">
            <FileText className="size-3.5 text-primary" />
            <span>Updated Weekly by City Dispatch</span>
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
        >
          {ADVISORIES.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col flex-1">
                <div className="relative mb-3.5 h-36 w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <Badge
                    variant="secondary"
                    className="absolute top-2.5 left-2.5 bg-background/90 text-foreground backdrop-blur-md text-[10px] font-mono"
                  >
                    {item.code}
                  </Badge>
                </div>

                <span className="text-[11px] font-semibold text-primary">
                  {item.category}
                </span>

                <h3 className="mt-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {item.summary}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2.5">
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="size-3 text-primary shrink-0" />
                    <span className="truncate">{item.wardScope}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[10px]">
                    <Calendar className="size-3" />
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAdvisory(item)}
                  className="w-full gap-1.5 text-xs font-semibold hover:border-primary/40 hover:text-primary"
                >
                  <Eye className="size-3.5" />
                  <span>View Details</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Advisory Detail Modal */}
      <AnimatePresence>
        {selectedAdvisory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedAdvisory(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedAdvisory(null)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close bulletin"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-primary/30 text-primary"
                >
                  {selectedAdvisory.code}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {selectedAdvisory.readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground">
                {selectedAdvisory.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-primary font-medium">
                  <MapPin className="size-3.5" />
                  {selectedAdvisory.wardScope}
                </span>
                <span>•</span>
                <span>Published {selectedAdvisory.date}</span>
              </div>

              <div className="mt-4 space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-foreground/90">
                {selectedAdvisory.fullDetails.map((paragraph, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{paragraph}</span>
                  </p>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAdvisory(null)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  render={<Link href="/login?redirect=/citizen/report" />}
                  nativeButton={false}
                >
                  Report Related Issue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
