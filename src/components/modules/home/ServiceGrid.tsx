import {
  AlertTriangle,
  ArrowRight,
  Droplets,
  Lightbulb,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "waste",
    name: "Waste & Sanitation",
    icon: Trash2,
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
        {/* Section Header */}
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

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-border hover:shadow-md"
              >
                <div>
                  {/* Icon & SLA Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        service.slaUrgent
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <ShieldCheck className="size-3" />
                      <span>{service.sla}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  {/* Common issues pill tags */}
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

                {/* Card Action Link */}
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
