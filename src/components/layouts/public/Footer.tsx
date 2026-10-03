import Logo from "@/asset/svg/Logo";
import { ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card text-foreground">
      {/* Upper Footer Notice */}
      <div className="border-b border-border bg-muted/30 py-3 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Emergency Notice:</strong> For immediate gas leaks, live
              powerline collapses, or life safety hazards, call emergency
              dispatch (999) directly.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            <span>Telemetry v1.0 • SLA Monitored</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-xl font-bold tracking-tight text-foreground">
                CivicFlow
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Direct municipal grievance intake, automated ward dispatch, and
              auditable Service Level Agreement (SLA) enforcement for urban
              communities.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              <span>7-Day Citizen Reopening Protection</span>
            </div>
          </div>

          {/* Citizen Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Citizen Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/login?redirect=/citizen/report"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Report Municipal Issue
                </Link>
              </li>
              <li>
                <Link
                  href="#quick-track"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Track Existing Ticket
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Department Service Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/account-verify"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Citizen Account Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & SLA */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Accountability
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="#telemetry"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Public Transparency Metrics
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  SLA Benchmark Standards
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Ward Routing Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/staff"
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Field Staff Queue</span>
                  <ArrowUpRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* City Administration */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Municipal Portal
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Admin / Leadership Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  New Citizen Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About the CivicFlow Engine
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 CivicFlow. Municipal Service & Complaint Engine.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/about-us"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about-us"
              className="hover:text-foreground transition-colors"
            >
              Citizen Charter
            </Link>
            <span className="font-mono text-xs text-muted-foreground/60">
              API: REST / v1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
