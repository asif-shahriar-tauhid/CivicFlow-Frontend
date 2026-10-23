"use client";

import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Mail,
  PhoneCall,
  Send,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const WARDS = [
  "All City Wards (Monthly Digest)",
  "Ward 04 — Uttara & North Corridor",
  "Ward 10 — Mirpur Central",
  "Ward 15 — Dhanmondi & Lake Zone",
  "Ward 19 — Banani & Gulshan",
  "Ward 22 — Motijheel Commercial",
];

export default function WardAlertCtaSection() {
  const [email, setEmail] = useState("");
  const [selectedWard, setSelectedWard] = useState(WARDS[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setErrorMsg(
        "Please enter a valid email address (e.g. resident@dhaka.gov.bd).",
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      gooeyToast.success("Subscribed to Municipal Alerts", {
        description: `Dispatches for ${selectedWard} will be sent to ${trimmed}.`,
      });
    }, 600);
  };

  return (
    <section
      id="ward-alerts"
      className="w-full py-16 lg:py-24 bg-gradient-to-b from-muted/30 to-background border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          {/* Left card: Ward Alert & Transparency Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                <BellRing className="size-3.5" />
                <span>Automated Ward Dispatch Bulletins</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Subscribe to Ward Maintenance &amp; SLA Alerts
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Receive scheduled road-cut advisories, monsoon drainage
                bulletins, and monthly ward SLA compliance scorecards directly
                in your inbox.
              </p>

              {isSubscribed ? (
                <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Ward Alert Subscription Confirmed
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      You are registered for{" "}
                      <strong className="text-foreground">{selectedWard}</strong>{" "}
                      advisories at{" "}
                      <span className="font-mono text-foreground">{email}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubscribed(false);
                        setEmail("");
                      }}
                      className="mt-2 text-xs font-semibold text-primary hover:underline"
                    >
                      Register another ward or email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-6 space-y-3" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="ward-select"
                        className="block text-xs font-semibold text-foreground mb-1.5"
                      >
                        Select Municipal Ward
                      </label>
                      <select
                        id="ward-select"
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                      >
                        {WARDS.map((ward) => (
                          <option key={ward} value={ward}>
                            {ward}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="alert-email"
                        className="block text-xs font-semibold text-foreground mb-1.5"
                      >
                        Citizen Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                          id="alert-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMsg) setErrorMsg(null);
                          }}
                          placeholder="citizen@example.com"
                          aria-invalid={Boolean(errorMsg)}
                          className="pl-8 h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs font-medium text-destructive">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="size-3.5 text-primary" />
                      Zero spam • Official municipal dispatches only
                    </span>

                    <Button
                      type="submit"
                      variant="default"
                      size="sm"
                      disabled={isSubmitting}
                      className="gap-1.5 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="size-3.5" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <Send className="size-3.5" />
                          <span>Activate Ward Alerts</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right card: Direct Action CTA & Emergency Hotlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                60-Second Street Intake
              </span>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Spot an Infrastructure Failure in Your Neighborhood?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Don&apos;t let potholes, dark corridors, or blocked drains go
                unreported. Submit a geo-tagged grievance and start the
                mandatory SLA countdown immediately.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-card p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <PhoneCall className="size-3.5 text-primary" />
                    National Civic Helpline
                  </span>
                  <span className="font-mono font-bold text-primary">333</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2">
                  <span className="text-muted-foreground">
                    Emergency Fire / Safety Dispatch
                  </span>
                  <span className="font-mono font-bold text-destructive">
                    999
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <Button
                variant="default"
                size="default"
                render={<Link href="/login?redirect=/citizen/report" />}
                nativeButton={false}
                className="flex-1 gap-1.5 font-semibold"
              >
                <span>Report Issue Now</span>
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="default"
                render={<Link href="/about-us" />}
                nativeButton={false}
                className="font-medium"
              >
                Citizen Charter
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
