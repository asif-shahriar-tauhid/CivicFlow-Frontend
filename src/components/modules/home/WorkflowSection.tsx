import { Camera, CheckCheck, Clock4, GitFork, ShieldCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Capture & Geo-Tag",
    subtitle: "Under 60 seconds on the street",
    icon: Camera,
    description:
      "Upload up to 5 photos from your mobile device. Automatic GPS coordinates and landmark tags pinpoint the exact civic failure.",
  },
  {
    step: "02",
    title: "Automated Routing",
    subtitle: "Zero administrative delays",
    icon: GitFork,
    description:
      "Category and ward routing rules immediately assign the grievance to the designated municipal department and active field queue.",
  },
  {
    step: "03",
    title: "Field Action & SLA",
    subtitle: "Strict deadline enforcement",
    icon: Clock4,
    description:
      "Technicians mobilize under category SLA clocks (12h to 48h). Progress milestones and investigation notes update live.",
  },
  {
    step: "04",
    title: "Citizen Verification",
    subtitle: "7-Day Reopen Guarantee",
    icon: CheckCheck,
    description:
      "Inspect completed work photos before confirming closure. If the issue is not fixed, reopen the case with one click within 7 days.",
  },
];

export default function WorkflowSection() {
  return (
    <section
      id="how-it-works"
      className="w-full py-16 lg:py-24 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Accountable Architecture
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How CivicFlow Resolves Your City Grievances
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            From street-level submission to verified municipal completion, every
            request is guarded by a deterministic state machine and strict SLA
            timers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((step, _idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-primary">
                    STAGE {step.step}
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <span className="text-xs font-medium text-primary/80 mt-0.5 mb-2">
                  {step.subtitle}
                </span>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Municipal SLA Compliance Guarantee
              </h4>
              <p className="text-xs text-muted-foreground">
                Any ticket breaching its category deadline is flagged red and
                automatically escalated to administrative leadership.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-medium bg-card px-3 py-1.5 rounded-full border border-border shrink-0">
            Escalation Rule: 100% Monitored
          </span>
        </div>
      </div>
    </section>
  );
}
