import { z } from "zod";

export const CreateRoutingRuleSchema = z.object({
  categoryId: z.string().uuid("Please select a valid municipal category"),
  departmentId: z.string().uuid("Please select a valid destination department"),
  location: z
    .string()
    .trim()
    .max(500, "Location scope cannot exceed 500 characters")
    .optional(),
  priority: z
    .number()
    .int("Priority must be an integer")
    .min(0, "Priority cannot be negative")
    .max(100, "Maximum priority is 100")
    .default(0),
});

export const UpdateRoutingRuleSchema = z.object({
  categoryId: z.string().uuid("Please select a valid category").optional(),
  departmentId: z
    .string()
    .uuid("Please select a valid destination department")
    .optional(),
  location: z
    .string()
    .trim()
    .max(500, "Location scope cannot exceed 500 characters")
    .nullable()
    .optional(),
  priority: z
    .number()
    .int("Priority must be an integer")
    .min(0, "Priority cannot be negative")
    .max(100, "Maximum priority is 100")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateRoutingRuleInput = z.infer<typeof CreateRoutingRuleSchema>;
export type UpdateRoutingRuleInput = z.infer<typeof UpdateRoutingRuleSchema>;
