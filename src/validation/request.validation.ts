import { z } from "zod";

export const createServiceRequestClientSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(160, "Title cannot exceed 160 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description cannot exceed 5000 characters"),
    caseType: z.enum(["COMPLAINT", "SERVICE_REQUEST"]),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
    address: z
      .string()
      .trim()
      .min(3, "Please provide a valid street address (minimum 3 characters)")
      .max(500, "Address cannot exceed 500 characters"),
    ward: z.string().max(100),
    zone: z.string().max(100),
    landmark: z.string().max(255),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    categoryId: z.string(),
  })
  .refine(
    (data) => {
      const hasLat = data.latitude !== null && data.latitude !== undefined;
      const hasLng = data.longitude !== null && data.longitude !== undefined;
      return (hasLat && hasLng) || (!hasLat && !hasLng);
    },
    {
      message: "Latitude and Longitude must both be provided together.",
      path: ["longitude"],
    },
  );

export const reopenRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(
      5,
      "Please explain why the issue is still unresolved (minimum 5 characters)",
    )
    .max(1000, "Reason cannot exceed 1000 characters"),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const updateServiceRequestClientSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(160, "Title cannot exceed 160 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description cannot exceed 5000 characters"),
    caseType: z.enum(["COMPLAINT", "SERVICE_REQUEST"]),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
    address: z
      .string()
      .trim()
      .min(3, "Please provide a valid street address (minimum 3 characters)")
      .max(500, "Address cannot exceed 500 characters"),
    ward: z.string().max(100).optional().or(z.literal("")),
    zone: z.string().max(100).optional().or(z.literal("")),
    landmark: z.string().max(255).optional().or(z.literal("")),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    categoryId: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const hasLat = data.latitude !== null && data.latitude !== undefined;
      const hasLng = data.longitude !== null && data.longitude !== undefined;
      return (hasLat && hasLng) || (!hasLat && !hasLng);
    },
    {
      message: "Latitude and Longitude must both be provided together.",
      path: ["longitude"],
    },
  );
