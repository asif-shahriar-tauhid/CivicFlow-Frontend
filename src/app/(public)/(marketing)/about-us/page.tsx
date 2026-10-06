import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  FileCheck2,
  GitFork,
  HelpCircle,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us — CivicFlow Municipal Governance & Telemetry",
  description:
    "CivicFlow transforms urban municipal service intake into transparent, real-time public telemetry with deterministic SLA enforcement and citizen verification.",
};

export default function AboutUsPage() {
  const commitments = [
    {
      title: "Zero Lost Complaints",
      icon: GitFork,
      description:
        "Traditional paper grievances disappear into bureaucratic silos. CivicFlow runs category and location routing rules that automatically dispatch issues to responsible municipal field queues within seconds.",
      metric: "100% Routed",
    },
    {
      title: "Strict SLA Clock Enforcement",
      icon: Clock,
      description:
        "Every civic failure has an enforceable resolution deadline (12h to 72h). If a department breaches its SLA window, the ticket is flagged red and automatically escalated to city administrative leadership.",
      metric: "94.6% On-Time",
    },
    {
      title: "Ground-Truth Verification",
      icon: FileCheck2,
      description:
        "No complaints are resolved on paper alone. Field crews must attach photographic evidence and detailed repair notes before proposing case resolution.",
      metric: "Verified Evidence",
    },
    {
      title: "The Citizen Confirmation Loop",
      icon: RotateCcw,
      description:
        "Municipalities cannot unilaterally close a ticket. Citizens inspect completed work and confirm closure, backed by an unconditional 7-day reopening right if defects persist.",
      metric: "7-Day Guarantee",
    },
  ];

  const lifecycleStages = [
    {
      number: "01",
      name: "SUBMITTED",
      badge: "Street Intake",
      desc: "Captured on mobile with exact GPS coordinates and up to 5 photos under 60 seconds.",
    },
    {
      number: "02",
      name: "TRIAGED",
      badge: "Auto-Routing",
      desc: "Evaluated by category rules to assign the responsible department and initialize the SLA clock.",
    },
    {
      number: "03",
      name: "IN_PROGRESS",
      badge: "Field Dispatch",
      desc: "Licensed municipal technicians mobilize with public equipment to execute the repair.",
    },
    {
      number: "04",
      name: "RESOLVED",
      badge: "Technician Proof",
      desc: "Field crew uploads completion proof and notes. Triggers citizen notification loop.",
    },
    {
      number: "05",
      name: "CLOSED",
      badge: "Citizen Confirmed",
      desc: "Citizen verifies ground truth and closes the ticket, followed by a 1-5 star service rating.",
    },
  ];

  const departments = [
    {
      name: "Waste & Sanitation",
      dept: "Department of Solid Waste Management",
      icon: Trash2,
      sla: "24h SLA",
      detail:
        "Overflowing dumpsters, illegal roadside dumping, street debris, and hazardous waste clearance.",
    },
    {
      name: "Streetlighting & Power",
      dept: "Electrical Engineering Division",
      icon: Lightbulb,
      sla: "48h SLA",
      detail:
        "Extinguished street poles, flickering fixtures, exposed low-voltage wiring, and dark corridors.",
    },
    {
      name: "Roads & Pedestrian Hazards",
      dept: "Roads & Highways Department",
      icon: AlertTriangle,
      sla: "72h SLA",
      detail:
        "Deep vehicle potholes, fractured sidewalks, missing manholes, and damaged median barriers.",
    },
    {
      name: "Drainage & Sewerage Network",
      dept: "Water Supply & Sewerage Authority",
      icon: Droplets,
      sla: "24h SLA",
      detail:
        "Stormwater stagnation, culvert blockages, sewer pipe overflows, and contaminated supply.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section: The Public Mandate */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Mission Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground shadow-xs mb-6">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Municipal Governance Charter</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Radical Transparency
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
              The Transparent <br />
              <span className="text-primary">Civic Conduit.</span>
            </h1>

            <p className="mt-6 text-base text-muted-foreground leading-relaxed sm:text-lg max-w-2xl">
              CivicFlow treats public infrastructure governance not as
              bureaucratic paper management, but as high-clarity, accountable
              public telemetry. We ensure urban residents have direct intake
              into municipal field queues, backed by enforced resolution
              deadlines and verified citizen confirmation loops.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                variant="default"
                size="default"
                render={<Link href="/login?redirect=/citizen/report" />}
                nativeButton={false}
                className="gap-2 rounded-4xl shadow-xs"
              >
                <span>Report an Issue (60s)</span>
                <ArrowRight className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="default"
                render={<Link href="/#telemetry" />}
                nativeButton={false}
                className="gap-2 rounded-4xl"
              >
                <Activity className="size-4 text-primary" />
                <span>View Public Telemetry</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Core Civic Commitments */}
      <section className="py-16 lg:py-24 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Core Principles
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How We Rebuild Public Trust in City Operations
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every design decision in CivicFlow is anchored in citizen
              empowerment and measurable municipal performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-background p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/20">
                        {item.metric}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. The Deterministic State Machine Journey */}
      <section className="py-16 lg:py-24 border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Deterministic Lifecycle
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              From Street Intake to Verified Closure
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Civic grievances move through an immutable 5-stage lifecycle state
              machine with automated logging of every state change.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {lifecycleStages.map((stage, idx) => (
              <div
                key={stage.number}
                className="relative rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-primary">
                      STAGE {stage.number}
                    </span>
                    <span className="rounded-4xl bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                      {stage.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground">
                    {stage.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>Audit Timestamped</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Municipal Jurisdictions Breakdown */}
      <section className="py-16 lg:py-24 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Municipal Operations
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Connected City Departments
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              CivicFlow integrates directly with municipal engineering teams to
              dispatch work orders straight to their field tablets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.name}
                  className="rounded-xl border border-border bg-background p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4.5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {dept.sla}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground">
                      {dept.name}
                    </h3>
                    <p className="text-xs font-medium text-primary mt-0.5 mb-2">
                      {dept.dept}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {dept.detail}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/60">
                    <Link
                      href="/login?redirect=/citizen/report"
                      className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <span>Report to this division</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Public Authority Contact & Emergency Hotlines */}
      <section className="py-16 border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Official Channels
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Municipal Dispatch & Public Inquiries
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  For active emergencies involving open electrical wires,
                  collapsed bridges, or severe gas leaks, contact emergency
                  hotlines immediately.
                </p>
              </div>

              {/* Right Columns: Hotlines & Addresses */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-background p-4 flex items-start gap-3">
                  <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Emergency Hotlines
                    </h4>
                    <p className="font-mono text-sm font-bold text-primary mt-1">
                      333{" "}
                      <span className="font-normal text-xs text-muted-foreground">
                        (National Citizen Helpline)
                      </span>
                    </p>
                    <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                      16100{" "}
                      <span className="font-normal text-xs text-muted-foreground">
                        (City Emergency Operations)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 flex items-start gap-3">
                  <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Central Dispatch Headquarters
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Nagar Bhaban, Municipal City Hall <br />
                      Dhaka 1000, Bangladesh
                    </p>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                      Operations: 24/7 Monitored
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 flex items-start gap-3">
                  <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Electronic Public Inquiries
                    </h4>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      dispatch@civicflow.gov.bd
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      transparency@civicflow.gov.bd
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 flex items-start gap-3">
                  <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Public Audit & Integrity
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Every complaint submission and status alteration is sealed
                      with cryptographic audit logs open to city ombudsman
                      scrutiny.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="py-16 bg-gradient-to-t from-primary/10 via-background to-background text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Empower Your Neighborhood Today.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every broken streetlight fixed and clogged drain cleared starts with
            a citizen taking 60 seconds to file a verifiable complaint.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="default"
              size="lg"
              render={<Link href="/login?redirect=/citizen/report" />}
              nativeButton={false}
              className="rounded-4xl gap-2 shadow-sm"
            >
              <span>Report an Issue (60s)</span>
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/citizen" />}
              nativeButton={false}
              className="rounded-4xl"
            >
              <span>Access Citizen Portal</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
