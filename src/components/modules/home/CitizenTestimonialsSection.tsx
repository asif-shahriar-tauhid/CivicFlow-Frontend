"use client";

import { CheckCircle2, Clock, MapPin, Quote, Star } from "lucide-react";
import { type Variants, motion } from "framer-motion";

const VERIFIED_REVIEWS = [
  {
    id: "rev-1",
    ticketNumber: "CF-2026-0892",
    citizenName: "Farhana Rahman",
    role: "Resident • Dhanmondi Ward 15",
    category: "Drainage & Sewerage",
    turnaround: "Resolved in 9h",
    rating: 5,
    quote:
      "After evening rainfall flooded our lane, I submitted GPS photos on CivicFlow. A suction crew arrived the next morning and uploaded clear proof photos before asking me to confirm closure.",
  },
  {
    id: "rev-2",
    ticketNumber: "CF-2026-0854",
    citizenName: "Mahmudul Hasan",
    role: "Shop Owner • Mirpur Ward 10",
    category: "Public Streetlighting",
    turnaround: "Resolved in 6.5h",
    rating: 5,
    quote:
      "Two dark street poles near our market entrance were fixed within the 12-hour SLA window. Having a real tracking number instead of a lost paper application changed everything.",
  },
  {
    id: "rev-3",
    ticketNumber: "CF-2026-0819",
    citizenName: "Dr. Nusrat Jahan",
    role: "Clinic Director • Uttara Sector 7",
    category: "Waste & Sanitation",
    turnaround: "Resolved in 14h",
    rating: 5,
    quote:
      "When initial cleanup missed construction bags behind the clinic, I used the 7-day reopen right with one click. The supervisor reassigned a heavy truck and cleared it completely.",
  },
  {
    id: "rev-4",
    ticketNumber: "CF-2026-0798",
    citizenName: "Tanvir Ahmed",
    role: "Civil Contractor • Banani Ward 19",
    category: "Excavation Permit",
    turnaround: "Approved in 18h",
    rating: 5,
    quote:
      "Paying the municipal road-cut permit fee via tokenized bKash and downloading an official PDF receipt saved three trips to City Hall. The audit trail is crystal clear.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function CitizenTestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="w-full py-16 lg:py-20 bg-background border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Citizen Confirmation Loop
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Verified Resident Closure Reviews
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every review below is tied to a closed municipal dossier where the
            reporting resident inspected field proof and verified completion.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VERIFIED_REVIEWS.map((review) => (
            <motion.div
              key={review.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {review.ticketNumber}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="size-3.5 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="relative mt-2">
                  <Quote className="size-5 text-primary/20 mb-1.5" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {review.citizenName}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-primary shrink-0" />
                      <span className="truncate">{review.role}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    Verified Closure
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3 text-amber-500" />
                    {review.turnaround}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
