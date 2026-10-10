"use client";

import {
  AlertTriangle,
  ArrowRight,
  Droplets,
  Lightbulb,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Variants, motion } from "framer-motion";

const services = [
  {
    id: "waste",
    name: "Waste & Sanitation",
    icon: Trash2,
    image: "/images/service-waste.webp",
    sla: "24 Hours SLA",
    slaUrgent: false,
    description:
      "Illegal dumping, overflowing neighborhood bins, street debris, and missed municipal waste collection.",
    examples: ["Overflowing dumpster", "Hazardous roadside debris"],
  },
  {
    id: "lighting",
    name: "Public Streetlighting",
    icon: Lightbulb,
    image: "/images/service-lighting.webp",
    sla: "12 Hours SLA",
    slaUrgent: true,
    description:
      "Extinguished streetlights, dark public pathways, damaged lamp poles, and exposed electrical hazards.",
    examples: ["Dark intersection", "Flickering high-mast light"],
  },
  {
    id: "roads",
    name: "Road & Hazard Repair",
    icon: AlertTriangle,
    image: "/images/service-roads.webp",
    sla: "48 Hours SLA",
    slaUrgent: false,
    description:
      "Severe potholes, broken sidewalks, missing manhole covers, and damaged traffic safety barriers.",
    examples: ["Deep vehicle pothole", "Dislodged drain cover"],
  },
  {
    id: "drainage",
    name: "Water & Drainage Network",
    icon: Droplets,
    image: "/images/service-drainage.webp",
    sla: "24 Hours SLA",
    slaUrgent: false,
    description:
      "Severe rainwater stagnation, clogged storm culverts, sewer overflows, and contaminated supply pipes.",
    examples: ["Street water-logging", "Blocked sewer culvert"],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function ServiceGrid() {
  return (
    <section
      id="services"
      className="w-full py-16 bg-muted/20 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Municipal Jurisdiction
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Core Municipal Services
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Every complaint is linked to its designated city department with
              enforced response timelines and dedicated field technicians.
            </p>
          </div>
          <Link
            href="/login?redirect=/citizen/report"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <span>View all service categories</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-lg transition-colors"
              >
                <div>
                  <div className="relative mb-4 h-36 w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    <div className="absolute bottom-2.5 left-2.5 flex size-9 items-center justify-center rounded-lg bg-background/90 text-primary shadow-xs backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-4" />
                    </div>

                    <span
                      className={`absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md shadow-xs ${
                        service.slaUrgent
                          ? "bg-amber-500/90 text-white"
                          : "bg-background/90 text-foreground"
                      }`}
                    >
                      <ShieldCheck className="size-3" />
                      <span>{service.sla}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.examples.map((example) => (
                      <span
                        key={example}
                        className="rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Link
                    href={`/login?redirect=/citizen/report?category=${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    <span>Report {service.name.split(" ")[0]} Issue</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
