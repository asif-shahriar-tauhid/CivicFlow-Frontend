"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Info,
  Layers,
  MapPin,
  Send,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateServiceRequest } from "@/hooks/request.hooks";
import {
  type CategoryDefinition,
  MUNICIPAL_CATEGORIES,
} from "@/lib/constants/categories";
import { createServiceRequestClientSchema } from "@/validation/request.validation";

function ReportIssueFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryQuery = searchParams.get("category");

  const defaultCategory =
    MUNICIPAL_CATEGORIES.find((cat) =>
      initialCategoryQuery
        ? cat.name.toLowerCase().includes(initialCategoryQuery.toLowerCase())
        : false,
    ) || MUNICIPAL_CATEGORIES[0];

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDefinition>(defaultCategory);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
    accuracy?: number;
  }>({ latitude: null, longitude: null });

  const { mutate: createRequest, isPending: isSubmitting } =
    useCreateServiceRequest();

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      gooeyToast.error("GPS Unavailable", {
        description: "Your browser does not support geolocation detection.",
      });
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setGpsCoordinates({
          latitude: lat,
          longitude: lng,
          accuracy: Math.round(pos.coords.accuracy),
        });
        form.setFieldValue("latitude", lat);
        form.setFieldValue("longitude", lng);
        setIsDetectingGps(false);
        gooeyToast.success("Location Acquired", {
          description: `Coordinates locked with ±${Math.round(pos.coords.accuracy)}m accuracy.`,
        });
      },
      (err) => {
        setIsDetectingGps(false);
        gooeyToast.error("Location Detection Failed", {
          description:
            err.message ||
            "Please allow browser location permissions or type address manually.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);

    if (evidenceFiles.length + incoming.length > 5) {
      gooeyToast.warning("Photo Limit Reached", {
        description:
          "You can upload a maximum of 5 evidence photos per report.",
      });
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    for (const file of incoming) {
      if (file.size > 10 * 1024 * 1024) {
        gooeyToast.error("File Too Large", {
          description: `${file.name} exceeds the 10MB limit.`,
        });
        continue;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setEvidenceFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...validPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(filePreviews[index]);
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      caseType: (defaultCategory.feeAmount > 0
        ? "SERVICE_REQUEST"
        : "COMPLAINT") as "COMPLAINT" | "SERVICE_REQUEST",
      priority: "NORMAL" as "LOW" | "NORMAL" | "HIGH" | "URGENT",
      address: "",
      ward: "",
      zone: "",
      landmark: "",
      latitude: null as number | null,
      longitude: null as number | null,
      categoryId: defaultCategory.id,
    },
    validators: {
      onSubmit: createServiceRequestClientSchema,
    },
    onSubmit: ({ value }) => {
      const formData = new FormData();
      formData.append("title", value.title.trim());
      formData.append("description", value.description.trim());
      formData.append("caseType", value.caseType);
      formData.append("priority", value.priority);
      formData.append("address", value.address.trim());

      const finalCategoryId = value.categoryId || selectedCategory.id;
      if (finalCategoryId) {
        formData.append("categoryId", finalCategoryId);
      }

      if (value.ward?.trim()) formData.append("ward", value.ward.trim());
      if (value.zone?.trim()) formData.append("zone", value.zone.trim());
      if (value.landmark?.trim())
        formData.append("landmark", value.landmark.trim());

      if (value.latitude !== null && value.longitude !== null) {
        formData.append("latitude", String(value.latitude));
        formData.append("longitude", String(value.longitude));
      }

      for (const file of evidenceFiles) {
        formData.append("files", file);
      }

      createRequest(formData, {
        onSuccess: (res: any) => {
          gooeyToast.success("Issue Reported Successfully", {
            description: `Tracking ID: ${res.data?.requestNumber || "Created"}. Department notified.`,
          });
          const targetId = res.data?.id;
          if (targetId) {
            router.push(`/citizen/requests/${targetId}`);
          } else {
            router.push("/citizen");
          }
        },
        onError: (err: any) => {
          gooeyToast.error("Submission Failed", {
            description:
              err.message ||
              "Could not submit civic grievance. Please verify all fields.",
          });
        },
      });
    },
  });

  return (
    <div className="mx-auto max-w-3xl pb-16 animate-in fade-in duration-200">
      <div className="mb-6">
        <Link
          href="/citizen"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to My Tickets</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Report a Municipal Grievance
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct municipal intake with GPS coordinates, photo proof, and SLA
              enforcement.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-mono text-muted-foreground self-start">
            <Clock className="size-3 text-primary" />
            <span>Target intake: &lt;60s</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-8"
      >
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                1. Select Municipal Jurisdiction
              </h2>
              <p className="text-xs text-muted-foreground">
                Determines the responding department and strict SLA response
                timeline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MUNICIPAL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory.name === cat.name;

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    form.setFieldValue("categoryId", cat.id);
                    if (cat.feeAmount > 0) {
                      form.setFieldValue("caseType", "SERVICE_REQUEST");
                    }
                  }}
                  className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-muted/20 hover:border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {cat.name.split(" ")[0]}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      {cat.slaHours}h SLA
                    </span>
                  </div>

                  <p className="text-xs text-foreground font-medium line-clamp-1">
                    {cat.name}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-border/60 w-full flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{cat.departmentName}</span>
                    <span className="font-medium text-foreground">
                      {cat.feeAmount === 0
                        ? "Free Service"
                        : `${cat.feeAmount} ${cat.feeCurrency}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              Common issues:
            </span>
            {selectedCategory.quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  form.setFieldValue("title", prompt);
                }}
                className="rounded-4xl border border-border bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                + {prompt}
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <form.Field name="caseType">
              {(field) => (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Service Intake Classification
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Choose between a general free public complaint or a
                        specialized municipal service request.
                      </p>
                    </div>
                    {selectedCategory.feeAmount > 0 &&
                      field.state.value === "SERVICE_REQUEST" && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-bold text-primary self-start sm:self-auto">
                          Intake Fee: ৳ {selectedCategory.feeAmount}{" "}
                          {selectedCategory.feeCurrency}
                        </span>
                      )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.handleChange("COMPLAINT")}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        field.state.value === "COMPLAINT"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          Public Civic Complaint
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Free Intake
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        Report community infrastructure hazards (waterlogging,
                        dark streetlights). No municipal fee.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.handleChange("SERVICE_REQUEST")}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        field.state.value === "SERVICE_REQUEST"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          Municipal Service Request
                        </span>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full font-mono">
                          {selectedCategory.feeAmount > 0
                            ? `৳ ${selectedCategory.feeAmount} BDT`
                            : "Standard Service"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        Dedicated departmental intervention, heavy haulage
                        dispatch, or excavation permits.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  2. Incident Location & Geotag
                </h2>
                <p className="text-xs text-muted-foreground">
                  Precise GPS coordinates enable municipal crews to deploy
                  directly.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGpsDetect}
              disabled={isDetectingGps}
              className="gap-1.5 text-xs shrink-0"
            >
              <Compass
                className={`size-3.5 ${isDetectingGps ? "animate-spin text-primary" : ""}`}
              />
              <span>{isDetectingGps ? "Locking GPS..." : "Detect My GPS"}</span>
            </Button>
          </div>

          {gpsCoordinates.latitude !== null && (
            <div className="mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 p-2.5 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Geotag Active:</span>
                <span className="font-mono tabular-nums">
                  {gpsCoordinates.latitude}° N, {gpsCoordinates.longitude}° E
                </span>
              </span>
              {gpsCoordinates.accuracy && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  ±{gpsCoordinates.accuracy}m
                </span>
              )}
            </div>
          )}

          <FieldGroup>
            <form.Field name="address">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Street Address or Intersection{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. House 14, Road 7, Block C"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <form.Field name="ward">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Ward Number</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Ward 4"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="zone">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>City Zone</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Zone North"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="landmark">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Notable Landmark
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Behind Central Mosque"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>
          </FieldGroup>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Camera className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  3. Photographic Evidence
                </h2>
                <p className="text-xs text-muted-foreground">
                  Attach up to 5 photos. High-fidelity evidence expedites SLA
                  triage.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {evidenceFiles.length} / 5 photos
            </span>
          </div>

          {evidenceFiles.length < 5 && (
            <label className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 cursor-pointer">
              <Upload className="size-6 text-muted-foreground mb-2" />
              <span className="text-sm font-semibold text-foreground">
                Snap or upload photos
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG, WEBP (up to 10MB each)
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {filePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {filePreviews.map((url, idx) => (
                <div
                  key={url}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                >
                  {url ? (
                    <Image
                      src={url}
                      alt={`Evidence ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-90 hover:bg-destructive transition-colors"
                    aria-label="Remove photo"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileCheck2 className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                4. Description & Priority
              </h2>
              <p className="text-xs text-muted-foreground">
                Provide concise notes to help the field crew diagnose the
                repair.
              </p>
            </div>
          </div>

          <FieldGroup>
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        Brief Summary{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {field.state.value.length}/160
                      </span>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Major drainage blockage causing knee-deep water"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        Detailed Problem Description{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {field.state.value.length}/5000
                      </span>
                    </div>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      placeholder="Explain how long the issue has persisted, immediate safety hazards, or specific points for the technician."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <form.Field name="priority">
                {(field) => (
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-2">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["LOW", "NORMAL", "HIGH", "URGENT"] as const).map(
                        (p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => field.handleChange(p)}
                            className={`py-1.5 rounded-4xl text-xs font-medium text-center border transition-all ${
                              field.state.value === p
                                ? p === "URGENT"
                                  ? "border-destructive bg-destructive/10 text-destructive font-bold"
                                  : "border-primary bg-primary/10 text-primary font-bold"
                                : "border-border bg-input/30 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field name="caseType">
                {(field) => (
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-2">
                      Request Type
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => field.handleChange("COMPLAINT")}
                        className={`py-1.5 rounded-4xl text-xs font-medium text-center border transition-all ${
                          field.state.value === "COMPLAINT"
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border bg-input/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Public Grievance
                      </button>
                      <button
                        type="button"
                        onClick={() => field.handleChange("SERVICE_REQUEST")}
                        className={`py-1.5 rounded-4xl text-xs font-medium text-center border transition-all ${
                          field.state.value === "SERVICE_REQUEST"
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border bg-input/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Service Request
                      </button>
                    </div>
                  </div>
                )}
              </form.Field>
            </div>
          </FieldGroup>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-xs text-muted-foreground">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">
              Municipal SLA Commitment:
            </span>{" "}
            Submitting this complaint will register an immutable ticket in the
            city queue with a{" "}
            <strong>
              {selectedCategory.slaHours}-hour resolution benchmark
            </strong>
            . You retain the right to confirm completion or reopen the case
            within 7 days.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/citizen" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="w-full sm:w-auto gap-2 shadow-sm px-6"
          >
            {isSubmitting ? (
              <Spinner>Dispatching Grievance...</Spinner>
            ) : (
              <>
                <Send className="size-4" />
                <span>Submit Grievance ({selectedCategory.slaHours}h SLA)</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ReportIssuePage() {
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ReportIssueFormInner />
    </Suspense>
  );
}
