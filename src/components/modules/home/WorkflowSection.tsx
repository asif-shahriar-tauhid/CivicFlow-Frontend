"use client";

import {
  Camera,
  CheckCheck,
  Clock4,
  GitFork,
  ShieldCheck,
} from "lucide-react";
import { type Variants, motion } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const stepCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function WorkflowSection() {
  return (
    <section
      id="how-it-works"
      className="w-full py-16 lg:py-24 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
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
        </motion.div>

        <div className="relative">
          {/* Animated conduit pipeline flow track on desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-border -z-0 overflow-hidden">
            <motion.div
              animate={{
                left: ["-25%", "100%"],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={stepCardVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-primary group-hover:text-primary transition-colors">
                      STAGE {step.step}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-4.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <span className="text-xs font-medium text-primary/80 mt-0.5 mb-2">
                    {step.subtitle}
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-12 rounded-xl border border-border bg-muted/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="size-5" />
            </div>
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
          <span className="font-mono text-xs font-medium bg-card px-3.5 py-1.5 rounded-full border border-border shadow-xs shrink-0 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Escalation Rule: 100% Monitored
          </span>
        </motion.div>
      </div>
    </section>
  );
}
