"use client";

import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Droplets,
  Eye,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { type Variants, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCardSkeleton } from "@/components/ui/skeleton";
import { useGetCategorySlaConfigs } from "@/hooks/sla.hooks";

export interface ServiceCardItem {
  id: string;
  categoryId: string;
  name: string;
  department: string;
  icon: typeof Trash2;
  image: string;
  sla: string;
  feeLabel: string;
  rating: string;
  coverage: string;
  slaUrgent: boolean;
  description: string;
}

export const CORE_SERVICES: ServiceCardItem[] = [
  {
    id: "waste",
    categoryId: "74b45c19-7a5f-4917-9ffc-5d009961eecd",
    name: "Waste & Sanitation",
    department: "Sanitation & Waste Management",
    icon: Trash2,
    image: "/images/service-waste.webp",
    sla: "24h SLA",
    feeLabel: "50 BDT Haulage",
    rating: "4.8/5",
    coverage: "Wards 1–24",
    slaUrgent: false,
    description:
      "Illegal dumping, overflowing neighborhood bins, street debris, and missed municipal waste collection.",
  },
  {
    id: "lighting",
    categoryId: "0eda1652-e7e4-4eb5-82cf-c558d96b24dd",
    name: "Public Streetlighting",
    department: "Electrical Engineering Division",
    icon: Lightbulb,
    image: "/images/service-lighting.webp",
    sla: "12h SLA",
    feeLabel: "Free Intake",
    rating: "4.9/5",
    coverage: "Citywide Grid",
    slaUrgent: true,
    description:
      "Extinguished streetlights, dark public pathways, damaged lamp poles, and exposed electrical hazards.",
  },
  {
    id: "roads",
    categoryId: "7d9c6036-95b9-4e3b-84ba-7f5b3c7aeec0",
    name: "Road & Hazard Repair",
    department: "Roads & Civil Infrastructure",
    icon: AlertTriangle,
    image: "/images/service-roads.webp",
    sla: "48h SLA",
    feeLabel: "100 BDT Permit",
    rating: "4.7/5",
    coverage: "Arterial & Ward",
    slaUrgent: false,
    description:
      "Severe potholes, broken sidewalks, missing manhole covers, and damaged traffic safety barriers.",
  },
  {
    id: "drainage",
    categoryId: "935e2322-66bb-48ae-a7dd-d586d49f2f0a",
    name: "Water & Drainage Network",
    department: "Drainage & Sewerage Dept",
    icon: Droplets,
    image: "/images/service-drainage.webp",
    sla: "24h SLA",
    feeLabel: "Free Intake",
    rating: "4.9/5",
    coverage: "Flood Zones 1–12",
    slaUrgent: false,
    description:
      "Severe rainwater stagnation, clogged storm culverts, sewer overflows, and contaminated supply pipes.",
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

interface ServiceGridProps {
  onSelectService?: (service: ServiceCardItem) => void;
}

export default function ServiceGrid({ onSelectService }: ServiceGridProps) {
  const { data: categoriesRes, isLoading } = useGetCategorySlaConfigs();

  const resolvedServices = useMemo(() => {
    const apiCategories = categoriesRes?.data;
    if (!Array.isArray(apiCategories) || apiCategories.length === 0) {
      return CORE_SERVICES;
    }

    return CORE_SERVICES.map((baseService) => {
      const matched = apiCategories.find(
        (c) => c.id === baseService.categoryId,
      );
      if (!matched) return baseService;

      const slaHours = Math.max(1, Math.round(matched.slaMinutes / 60));
      const feeLabel =
        matched.feeAmount > 0
          ? `${matched.feeAmount} ${matched.feeCurrency || "BDT"} Fee`
          : "Free Intake";

      return {
        ...baseService,
        sla: `${slaHours}h SLA`,
        feeLabel,
        slaUrgent: slaHours <= 12,
      };
    });
  }, [categoriesRes]);

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
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
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
            <span>Report a municipal issue</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {[1, 2, 3, 4].map((skeletonId) => (
              <ServiceCardSkeleton key={skeletonId} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
          >
            {resolvedServices.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group relative flex h-full w-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col flex-1">
                    <div className="relative mb-4 h-36 w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                      <div className="absolute bottom-2.5 left-2.5 flex size-8 items-center justify-center rounded-lg bg-background/90 text-primary shadow-xs backdrop-blur-md">
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

                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 truncate">
                        <Clock className="size-3 text-primary shrink-0" />
                        <span className="truncate">{service.feeLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 truncate">
                        <Star className="size-3 text-amber-500 shrink-0" />
                        <span className="truncate">{service.rating}</span>
                      </span>
                      <span className="col-span-2 inline-flex items-center gap-1 rounded-md bg-muted/40 px-2 py-1 truncate">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">
                          {service.department} • {service.coverage}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      render={<Link href={`/explore/${service.id}`} />}
                      nativeButton={false}
                      className="w-full gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="size-3.5" />
                      <span>View Details</span>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
