"use client";

import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  FilePlus2,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DeleteTicketModal,
  EditTicketModal,
} from "@/components/modules/requests";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetServiceRequests } from "@/hooks/request.hooks";
import type { RequestStatus, ServiceRequest } from "@/types/request.types";

// Mock fallbacks ensuring high visual feedback when backend is offline or empty
const DEMO_CITIZEN_TICKETS: Partial<ServiceRequest>[] = [
  {
    id: "demo-1",
    requestNumber: "CF-2026-0941",
    title: "Severe rainwater drainage choke causing road flooding",
    description:
      "Water accumulated over 18 inches after evening rainfall. Pedestrians unable to cross.",
    status: "RESOLVED",
    priority: "HIGH",
    caseType: "COMPLAINT",
    address: "Road 5, Block B, Dhanmondi",
    ward: "Ward 15",
    slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    resolutionSummary:
      "Field crew deployed vacuum pump and unblocked 25m stormwater line.",
    category: {
      id: "cat-1",
      name: "Waterlogging & Drainage Choke",
      feeAmount: 0,
      feeCurrency: "BDT",
      slaMinutes: 1440,
      isActive: true,
    },
    department: {
      id: "dept-1",
      name: "Drainage & Sewerage",
      isActive: true,
    },
  },
  {
    id: "demo-2",
    requestNumber: "CF-2026-0812",
    title: "Broken streetlight pole and dark intersection corridor",
    description:
      "High-mast pole lamp has been extinguished for 48 hours. Night vehicle collision hazard.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    caseType: "COMPLAINT",
    address: "Gulshan Avenue, Near Shooting Club",
    ward: "Ward 19",
    slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    category: {
      id: "cat-2",
      name: "Broken Streetlight & Dark Corridors",
      feeAmount: 0,
      feeCurrency: "BDT",
      slaMinutes: 2880,
      isActive: true,
    },
    department: {
      id: "dept-2",
      name: "Electrical Engineering",
      isActive: true,
    },
  },
  {
    id: "demo-3",
    requestNumber: "CF-2026-0785",
    title: "Overflowing commercial dumpster blocking sidewalk",
    description:
      "Garbage spilling onto the main roadway with foul stench and health hazard.",
    status: "SUBMITTED",
    priority: "NORMAL",
    caseType: "COMPLAINT",
    address: "Sector 7, Main Road, Uttara",
    ward: "Ward 1",
    slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: {
      id: "cat-3",
      name: "Illegal Garbage Dumping",
      feeAmount: 50,
      feeCurrency: "BDT",
      slaMinutes: 1440,
      isActive: true,
    },
    department: {
      id: "dept-3",
      name: "Sanitation & Waste Management",
      isActive: true,
    },
  },
];

export default function CitizenPortalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingTicket, setEditingTicket] = useState<ServiceRequest | null>(
    null,
  );
  const [deletingTicket, setDeletingTicket] = useState<ServiceRequest | null>(
    null,
  );

  const { data: response, isLoading, refetch } = useGetServiceRequests();

  // Pick API data if available, fallback to realistic pre-seeded data if empty
  const rawTickets = useMemo(() => {
    const apiData = response?.data;
    if (Array.isArray(apiData) && apiData.length > 0) {
      return apiData;
    }
    return DEMO_CITIZEN_TICKETS as ServiceRequest[];
  }, [response]);

  // Filter & Search
  const filteredTickets = useMemo(() => {
    return rawTickets.filter((item) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesNumber = item.requestNumber?.toLowerCase().includes(query);
        const matchesAddress = item.address?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNumber && !matchesAddress) return false;
      }

      // Status Filter
      if (statusFilter === "ALL") return true;
      if (statusFilter === "ACTIVE") {
        return [
          "SUBMITTED",
          "TRIAGED",
          "ASSIGNED",
          "IN_PROGRESS",
          "REOPENED",
        ].includes(item.status);
      }
      if (statusFilter === "ACTION_REQUIRED") {
        return item.status === "RESOLVED" || item.status === "AWAITING_CITIZEN";
      }
      if (statusFilter === "CLOSED") {
        return item.status === "CLOSED" || item.status === "REJECTED";
      }

      return item.status === statusFilter;
    });
  }, [rawTickets, searchTerm, statusFilter]);

  // Compute KPI Counts
  const totalCount = rawTickets.length;
  const activeCount = rawTickets.filter((t) =>
    ["SUBMITTED", "TRIAGED", "ASSIGNED", "IN_PROGRESS", "REOPENED"].includes(
      t.status,
    ),
  ).length;
  const actionRequiredCount = rawTickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "AWAITING_CITIZEN",
  ).length;
  const closedCount = rawTickets.filter((t) => t.status === "CLOSED").length;

  return (
    <div className="flex flex-col gap-8 pb-16 animate-in fade-in duration-200">
      {/* Portal Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Citizen Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Municipal Grievance Dossiers
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Monitor real-time repair progress, field technician assignments, and
            SLA deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 text-xs rounded-4xl"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            render={<Link href="/citizen/report" />}
            nativeButton={false}
            className="gap-1.5 rounded-4xl shadow-xs"
          >
            <FilePlus2 className="size-3.5" />
            <span>Report New Issue</span>
          </Button>
        </div>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {/* Total */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Total Reported
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {totalCount}
            </span>
            <span className="text-[11px] text-muted-foreground">Lifelong</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
            In Field Action
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400 tabular-nums">
              {activeCount}
            </span>
            <span className="text-[11px] text-muted-foreground">
              SLA active
            </span>
          </div>
        </div>

        {/* Action Required */}
        <div
          className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
            actionRequiredCount > 0
              ? "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20"
              : "border-border bg-card"
          }`}
        >
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="size-3.5" />
            Awaiting Verification
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
              {actionRequiredCount}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Confirm to close
            </span>
          </div>
        </div>

        {/* Verified & Closed */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            Resolved & Verified
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              {closedCount}
            </span>
            <span className="text-[11px] text-muted-foreground">Closed</span>
          </div>
        </div>
      </div>

      {/* Action Required Prompt Banner (if any ticket is resolved awaiting citizen confirmation) */}
      {actionRequiredCount > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                Action Required: {actionRequiredCount} ticket(s) completed by
                municipal crews.
              </p>
              <p className="text-muted-foreground">
                Inspect completed resolution proof and confirm closure, or
                exercise your 7-day reopening right.
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setStatusFilter("ACTION_REQUIRED")}
            className="rounded-4xl text-xs shrink-0"
          >
            Filter Pending Reviews
          </Button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by ticket # (CF-2026), title, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Tickets" },
            { id: "ACTIVE", label: `Active (${activeCount})` },
            {
              id: "ACTION_REQUIRED",
              label: `Action Required (${actionRequiredCount})`,
            },
            { id: "CLOSED", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-4xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${
                statusFilter === tab.id
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List View */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Spinner />
          <span className="text-xs text-muted-foreground">
            Synchronizing with municipal telemetry...
          </span>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center flex flex-col items-center justify-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Search className="size-5" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No complaints found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {searchTerm
              ? "No tickets match your search query. Try searching by address or reset your filter."
              : "You haven't reported any municipal issues in this category yet."}
          </p>
          <Button
            variant="default"
            size="sm"
            render={<Link href="/citizen/report" />}
            nativeButton={false}
            className="mt-4 gap-1.5 rounded-4xl"
          >
            <FilePlus2 className="size-3.5" />
            <span>Report an Issue (60s)</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTickets.map((ticket) => {
            const isResolved = ticket.status === "RESOLVED";

            return (
              <div
                key={ticket.id}
                className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-border/80 hover:shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left ticket overview */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Monospace Tracking ID */}
                    <span className="font-mono text-xs font-bold text-primary tracking-wider">
                      {ticket.requestNumber || "CF-PENDING"}
                    </span>

                    <StatusBadge status={ticket.status} />

                    <PriorityBadge priority={ticket.priority} />

                    {ticket.category && (
                      <span className="rounded-4xl bg-muted/60 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                        {ticket.category.name}
                      </span>
                    )}

                    {ticket.department && (
                      <span className="text-[11px] text-muted-foreground/80 hidden sm:inline">
                        • {ticket.department.name}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <Link
                    href={`/citizen/requests/${ticket.id}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {ticket.title}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                    {ticket.description}
                  </p>

                  {/* Telemetry metadata footer */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate max-w-xs">
                        {ticket.address}
                      </span>
                      {ticket.ward && <span>({ticket.ward})</span>}
                    </span>

                    {ticket.slaDueAt && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="size-3 text-amber-500" />
                        <span>
                          SLA Due:{" "}
                          {new Date(ticket.slaDueAt).toLocaleDateString()}
                        </span>
                      </span>
                    )}

                    <span className="text-[11px]">
                      Reported {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Action Button Column */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-border/60 pt-3 md:border-0 md:pt-0">
                  {ticket.status === "SUBMITTED" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTicket(ticket)}
                        className="gap-1.5 rounded-4xl border-primary/30 text-primary hover:bg-primary/10 text-xs"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingTicket(ticket)}
                        className="gap-1.5 rounded-4xl border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Cancel</span>
                      </Button>
                    </>
                  )}

                  {isResolved ? (
                    <Button
                      variant="default"
                      size="sm"
                      render={<Link href={`/citizen/requests/${ticket.id}`} />}
                      nativeButton={false}
                      className="w-full md:w-auto gap-1.5 rounded-4xl bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Verify & Confirm</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/citizen/requests/${ticket.id}`} />}
                      nativeButton={false}
                      className="w-full md:w-auto gap-1.5 rounded-4xl"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Ticket Modal */}
      <EditTicketModal
        ticket={editingTicket}
        isOpen={Boolean(editingTicket)}
        onClose={() => setEditingTicket(null)}
        onSuccess={() => refetch()}
      />

      {/* Delete / Cancel Ticket Modal */}
      <DeleteTicketModal
        ticket={deletingTicket}
        isOpen={Boolean(deletingTicket)}
        onClose={() => setDeletingTicket(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
