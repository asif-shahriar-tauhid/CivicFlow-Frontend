import z from "zod";

export const LoginZodSchema = z.object({
  email: z.email(
    "The Provided email is not an Email. Example-'someone@something.com'",
  ),
  password: z
    .string()
    .min(8, "Password must be 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one Uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one Lowercase letter.")
    .regex(/[0-9]/, "Password must include a number.")
    .regex(/[^A-Za-z0-9]/, "Password must include one special character"),
});
