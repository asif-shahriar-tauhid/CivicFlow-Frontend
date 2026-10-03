import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CreditCard,
  History,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const guarantees = [
  {
    icon: RotateCcw,
    title: "7-Day Reopening Right",
    description:
      "Municipal crews cannot close a ticket prematurely. If a pothole reappears or waste is only half-cleared, citizens reopen the ticket with one click.",
  },
  {
    icon: ShieldCheck,
    title: "Photographic Evidence Gate",
    description:
      "Every field resolution requires photo attachments showing the completed repair before the case can transition to resolved status.",
  },
  {
    icon: CreditCard,
    title: "Digital bKash & Invoicing",
    description:
      "Permits and fee-backed service requests checkout securely via tokenized bKash with downloadable PDF invoices generated on completion.",
  },
  {
    icon: History,
    title: "Immutable Audit Trail",
    description:
      "Every transition, timestamp, actor ID, and assignment change is written to an unalterable log for full city oversight and public integrity.",
  },
];

export default function TrustGuarantees() {
  return (
    <section className="w-full py-16 lg:py-24 bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTA */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Public Accountability
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built on Trust, Verified by Evidence.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Traditional municipal portals lose reports in bureaucratic limbo.
              CivicFlow introduces verifiable mechanisms that keep city field
              operations honest, timely, and responsive to citizens.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="default"
                size="default"
                render={<Link href="/login?redirect=/citizen/report" />}
                nativeButton={false}
                className="gap-2"
              >
                <span>Submit Grievance Now</span>
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="default"
                render={<Link href="/about-us" />}
                nativeButton={false}
              >
                Read Citizen Charter
              </Button>
            </div>
          </div>

          {/* Right Column: 4 Guarantees */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {guarantees.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-muted/20 p-5 flex flex-col gap-2.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
