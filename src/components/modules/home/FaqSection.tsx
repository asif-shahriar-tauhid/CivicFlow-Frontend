"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FaqItem {
  id: string;
  category: "General" | "SLA & Routing" | "Permits & Fees" | "Citizen Rights";
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Citizen Rights",
    question: "How does the 7-day citizen reopening guarantee work?",
    answer:
      "When a field technician marks your grievance as RESOLVED, it does not close automatically. You are notified to inspect the repair and attached proof photos. If the pothole, leak, or lighting fault was not properly fixed, you can reopen the ticket with one click within 7 days, returning it directly to the active department queue.",
  },
  {
    id: "faq-2",
    category: "General",
    question: "Do I need an account to track an existing municipal ticket?",
    answer:
      "No. Any resident can enter a Ticket ID (such as CF-2026-0941) in the Hero quick-tracker on the home page to view live lifecycle status, assigned ward sector, and remaining SLA hours. Signing into your Citizen Portal unlocks full photo attachments, technician notes, and closure confirmation.",
  },
  {
    id: "faq-3",
    category: "SLA & Routing",
    question: "What happens if a city department breaches its SLA deadline?",
    answer:
      "Every category has a binding SLA clock (12 hours for streetlighting, 24 hours for drainage and waste, 48–72 hours for road resurfacing). If a ticket exceeds its target deadline without resolution, CivicFlow flags the dossier in red and escalates it to the Admin SLA Overdue Desk for supervisory intervention.",
  },
  {
    id: "faq-4",
    category: "Permits & Fees",
    question: "Which requests are free vs. fee-backed via bKash?",
    answer:
      "Public safety and infrastructure failures—such as waterlogging, drainage chokes, and broken streetlights—are 100% free to report. Commercial excavation permits, bulk demolition rubble haulage, and specialized road-cut clearances carry regulated municipal tariffs payable via tokenized bKash with instant PDF receipts.",
  },
  {
    id: "faq-5",
    category: "SLA & Routing",
    question: "How are grievances routed to the right municipal department?",
    answer:
      "CivicFlow evaluates your selected category, ward location, and priority against automated routing rules. Within seconds of submission, the ticket is dispatched to the responsible department (e.g., Drainage & Sewerage or Electrical Engineering) without manual paper sorting.",
  },
  {
    id: "faq-6",
    category: "Citizen Rights",
    question: "Can I edit or cancel my complaint after submitting it?",
    answer:
      "Yes. While your ticket is in the SUBMITTED state awaiting triage dispatch, you can edit the title, description, street address, priority, or GPS coordinates—or cancel the request altogether—directly from your Citizen Portal.",
  },
];

const CATEGORIES = [
  "All",
  "General",
  "SLA & Routing",
  "Permits & Fees",
  "Citizen Rights",
] as const;

export default function FaqSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const filteredFaqs = FAQS.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory,
  );

  return (
    <section
      id="faq"
      className="w-full py-16 lg:py-20 bg-background border-t border-border"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <HelpCircle className="size-3.5" />
            <span>Citizen Charter &amp; Help Desk</span>
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Frequently Asked Municipal Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about SLA enforcement, automated ward
            routing, bKash permit invoices, and citizen verification rights.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
                  selectedCategory === category
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-colors ${
                  isOpen
                    ? "border-primary/40 bg-card shadow-xs"
                    : "border-border bg-card/60 hover:border-border/90"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary border-primary/30" : ""
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/60 px-5 pt-3.5 pb-5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
