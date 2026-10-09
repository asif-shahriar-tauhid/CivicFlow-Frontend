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

export default function ServiceGrid() {
  return (
    <section
      id="services"
      className="w-full py-16 bg-muted/20 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <span>View all service categories</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-border hover:shadow-md"
              >
                <div>
                  <div className="relative mb-4 h-36 w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    <div className="absolute bottom-2.5 left-2.5 flex size-9 items-center justify-center rounded-lg bg-background/90 text-primary shadow-xs backdrop-blur-md">
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

                  <h3 className="text-base font-semibold text-foreground">
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
