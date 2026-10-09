"use client";

import {
  AlertCircle,
  Compass,
  Edit3,
  Layers,
  MapPin,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateServiceRequest } from "@/hooks/request.hooks";
import { MUNICIPAL_CATEGORIES } from "@/lib/constants/categories";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  CaseType,
  RequestPriority,
  ServiceRequest,
  UpdateServiceRequestInput,
} from "@/types/request.types";
import { updateServiceRequestClientSchema } from "@/validation/request.validation";

interface EditTicketModalProps {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedTicket?: ServiceRequest) => void;
}

export function EditTicketModal({
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: EditTicketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("COMPLAINT");
  const [priority, setPriority] = useState<RequestPriority>("NORMAL");
  const [categoryId, setCategoryId] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [zone, setZone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const { mutate: updateRequest, isPending: isUpdating } =
    useUpdateServiceRequest();

  useEffect(() => {
    if (ticket && isOpen) {
      setTitle(ticket.title || "");
      setDescription(ticket.description || "");
      setCaseType(ticket.caseType || "COMPLAINT");
      setPriority(ticket.priority || "NORMAL");
      setCategoryId(ticket.categoryId || ticket.category?.id || "");
      setAddress(ticket.address || "");
      setWard(ticket.ward || "");
      setZone(ticket.zone || "");
      setLandmark(ticket.landmark || "");
      setLatitude(ticket.latitude ?? null);
      setLongitude(ticket.longitude ?? null);
      setErrors({});
    }
  }, [ticket, isOpen]);

  const selectedCategoryDef = useMemo(() => {
    if (!categoryId) return null;
    return (
      MUNICIPAL_CATEGORIES.find((cat) => cat.id === categoryId) ||
      (ticket?.category?.id === categoryId
        ? {
            id: ticket.category.id,
            name: ticket.category.name,
            departmentName: ticket.department?.name || "Assigned Department",
            icon: Layers,
            description: "",
            slaHours: Math.round((ticket.category.slaMinutes || 1440) / 60),
            feeAmount: ticket.category.feeAmount || 0,
            feeCurrency: ticket.category.feeCurrency || "BDT",
            quickPrompts: [],
          }
        : null)
    );
  }, [categoryId, ticket]);

  if (!isOpen || !ticket) return null;

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
        setLatitude(lat);
        setLongitude(lng);
        setIsDetectingGps(false);
        gooeyToast.success("GPS Coordinates Locked", {
          description: `Lat: ${lat}, Lng: ${lng} (±${Math.round(pos.coords.accuracy)}m)`,
        });
      },
      (err) => {
        setIsDetectingGps(false);
        gooeyToast.error("Location Acquisition Failed", {
          description:
            err.message ||
            "Please allow browser location permissions or verify device GPS.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleClearGps = () => {
    setLatitude(null);
    setLongitude(null);
    gooeyToast.info("GPS Coordinates Cleared");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formValues = {
      title: title.trim(),
      description: description.trim(),
      caseType,
      priority,
      address: address.trim(),
      ward: ward.trim(),
      zone: zone.trim(),
      landmark: landmark.trim(),
      latitude,
      longitude,
      categoryId: categoryId.trim(),
    };

    const result = updateServiceRequestClientSchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const pathKey = issue.path[0] as string;
        if (pathKey && !fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message;
        }
      }
      setErrors(fieldErrors);

      const firstError = result.error.issues[0]?.message;
      gooeyToast.error("Validation Error", {
        description: firstError || "Please check your inputs and try again.",
      });
      return;
    }

    setErrors({});

    const payload: UpdateServiceRequestInput = {
      title: formValues.title,
      description: formValues.description,
      caseType: formValues.caseType,
      priority: formValues.priority,
      address: formValues.address,
    };

    if (formValues.ward) payload.ward = formValues.ward;
    if (formValues.zone) payload.zone = formValues.zone;
    if (formValues.landmark) payload.landmark = formValues.landmark;
    if (formValues.categoryId) payload.categoryId = formValues.categoryId;

    if (
      formValues.latitude !== null &&
      formValues.longitude !== null &&
      !Number.isNaN(Number(formValues.latitude)) &&
      !Number.isNaN(Number(formValues.longitude))
    ) {
      payload.latitude = Number(formValues.latitude);
      payload.longitude = Number(formValues.longitude);
    }

    updateRequest(
      {
        requestId: ticket.id,
        payload,
      },
      {
        onSuccess: (res: ApiResponse<ServiceRequest>) => {
          gooeyToast.success("Ticket Updated Successfully", {
            description: `Modifications saved for ${ticket.requestNumber || "ticket"}.`,
          });
          onSuccess?.(res?.data);
          onClose();
        },
        onError: (err: Error) => {
          gooeyToast.error("Update Failed", {
            description:
              err.message ||
              "Could not update the ticket. Please verify your permissions and details.",
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-labelledby="edit-ticket-title"
        aria-modal="true"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-sky-500 to-emerald-500" />

        <div className="flex items-start justify-between p-6 pb-4 border-b border-border bg-muted/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                {ticket.requestNumber || "TICKET"}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h2
              id="edit-ticket-title"
              className="text-lg font-bold tracking-tight text-foreground sm:text-xl flex items-center gap-2"
            >
              <Edit3 className="size-5 text-primary shrink-0" />
              <span>Edit Submitted Ticket</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update grievance details and ground coordinates while in the
              Submitted triage queue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Close edit modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span>Classification &amp; Urgency</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-caseType"
                    className="font-semibold text-foreground text-xs"
                  >
                    Case Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="edit-caseType"
                      onClick={() => setCaseType("COMPLAINT")}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-center ${
                        caseType === "COMPLAINT"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      Public Complaint
                    </button>
                    <button
                      type="button"
                      onClick={() => setCaseType("SERVICE_REQUEST")}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-center ${
                        caseType === "SERVICE_REQUEST"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      Service Request
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground text-xs block">
                    Priority Level
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(
                      ["LOW", "NORMAL", "HIGH", "URGENT"] as RequestPriority[]
                    ).map((p) => {
                      const isSelected = priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 px-1 rounded-lg border text-[11px] font-medium transition-all text-center ${
                            isSelected
                              ? p === "URGENT"
                                ? "border-red-500 bg-red-500/15 text-red-600 dark:text-red-400 font-bold"
                                : p === "HIGH"
                                  ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                                  : p === "LOW"
                                    ? "border-slate-500 bg-slate-500/15 text-slate-700 dark:text-slate-300 font-bold"
                                    : "border-primary bg-primary/15 text-primary font-bold"
                              : "border-border bg-card hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <label
                  htmlFor="edit-category"
                  className="font-semibold text-foreground text-xs flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="size-3.5 text-primary" />
                    <span>Municipal Category</span>
                  </span>
                  {selectedCategoryDef && (
                    <span className="text-[11px] text-muted-foreground font-normal">
                      SLA: {selectedCategoryDef.slaHours}h • Dept:{" "}
                      {selectedCategoryDef.departmentName}
                    </span>
                  )}
                </label>
                <select
                  id="edit-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">-- Keep Current Category --</option>
                  {MUNICIPAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.departmentName})
                      {cat.feeAmount > 0
                        ? ` • ${cat.feeAmount} ${cat.feeCurrency}`
                        : " • Free"}
                    </option>
                  ))}
                </select>
                {selectedCategoryDef?.feeAmount ? (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    ℹ️ This category carries a municipal statutory service fee of{" "}
                    {selectedCategoryDef.feeAmount}{" "}
                    {selectedCategoryDef.feeCurrency}.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="edit-ticket-title-input"
                    className="font-semibold text-foreground text-xs"
                  >
                    Incident Title <span className="text-destructive">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      title.length > 160
                        ? "text-destructive font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {title.length} / 160
                  </span>
                </div>
                <Input
                  id="edit-ticket-title-input"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="Concise summary of the civic issue"
                  className={
                    errors.title
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.title && (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="edit-ticket-description-input"
                    className="font-semibold text-foreground text-xs"
                  >
                    Full Grievance Description{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      description.length > 5000
                        ? "text-destructive font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {description.length} / 5000
                  </span>
                </div>
                <Textarea
                  id="edit-ticket-description-input"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  rows={4}
                  placeholder="Describe location details, ground hazard impact, or urgency context..."
                  className={`min-h-[100px] resize-y ${
                    errors.description
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                <span>Location Telemetry &amp; Field Coordinates</span>
              </span>

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-ticket-address-input"
                  className="font-semibold text-foreground text-xs"
                >
                  Street Address / Landmark Location{" "}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="edit-ticket-address-input"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address)
                      setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  placeholder="e.g., Road 5, Block B, Dhanmondi, Dhaka"
                  className={
                    errors.address
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.address && (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="edit-ticket-ward-input"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    Ward (e.g. Ward 15)
                  </label>
                  <Input
                    id="edit-ticket-ward-input"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="Ward 15"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="edit-ticket-zone-input"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    Zone (e.g. Zone South)
                  </label>
                  <Input
                    id="edit-ticket-zone-input"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Zone South"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="edit-ticket-landmark-input"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    Nearby Landmark
                  </label>
                  <Input
                    id="edit-ticket-landmark-input"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Beside City Hospital"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Compass className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-foreground block">
                      GPS Geolocation Coordinates
                    </span>
                    {latitude !== null && longitude !== null ? (
                      <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>
                          {latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E
                        </span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        No GPS coordinates tagged yet.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {latitude !== null && longitude !== null && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearGps}
                      className="text-[11px] h-7 px-2 text-muted-foreground hover:text-destructive"
                    >
                      Clear GPS
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGpsDetect}
                    disabled={isDetectingGps}
                    className="text-[11px] h-7 px-3 gap-1.5 rounded-full"
                  >
                    {isDetectingGps ? (
                      <>
                        <Spinner className="size-3" />
                        <span>Acquiring...</span>
                      </>
                    ) : (
                      <>
                        <Compass className="size-3 text-primary" />
                        <span>
                          {latitude !== null ? "Re-detect GPS" : "Detect GPS"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {errors.longitude && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  <span>{errors.longitude}</span>
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border px-6 py-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground font-mono">
              🛡️ Editable only while ticket status is SUBMITTED
            </span>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isUpdating}
                className="rounded-4xl px-4 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={isUpdating}
                className="gap-2 rounded-4xl px-5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                {isUpdating ? (
                  <>
                    <Spinner className="size-3.5" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save &amp; Update Ticket</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
