"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { gooeyToast } from "@/components/ui/goey-toaster";
import GoogleLoginComponent from "@/components/GoogleLogin";
import { useRegister } from "@/hooks/auth.hooks";
import { registrationZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { z } from "zod";

const clientRegisterSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be of at least 3 characters")
      .max(50, "Name at most can have 50 characters"),
    email: z.email(
      "The Provided email is not an Email. Example-'someone@something.com'",
    ),
    contactNumber: z.string(),
    password: z
      .string()
      .min(8, "Password must be 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one Uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one Lowercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9]/, "Password must include one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  googleLogin?: ReactNode;
}

export default function RegisterForm({ googleLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: register, isPending: registerPending } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: clientRegisterSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        patient: value.contactNumber.trim()
          ? { contactNumber: value.contactNumber.trim() }
          : undefined,
      };

      register(payload, {
        onSuccess: () => {
          gooeyToast.success("Verification Code Sent", {
            description: `We sent a 6-digit OTP code to ${value.email}.`,
          });
          setTimeout(() => {
            router.push(
              `/account-verify?email=${encodeURIComponent(value.email.trim())}`,
            );
          }, 600);
        },
        onError: (err: any) => {
          gooeyToast.error("Registration Failed", {
            description:
              err.message ||
              "Could not complete registration. Email may already be registered.",
          });
        },
      });
    },
  });

  const pwd = form.state.values.password;
  const hasMinLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {/* Full Name */}
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Sarah Rahman"
                    autoComplete="name"
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Email Address */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="sarah.citizen@example.com"
                    autoComplete="email"
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Contact Number (Optional) */}
          <form.Field name="contactNumber">
            {(field) => {
              return (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>
                      Contact Phone Number
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    placeholder="+880 1712-345678"
                    autoComplete="tel"
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                </Field>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Confirm Password */}
          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Live Password Requirements Checklist */}
          {pwd.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs flex flex-col gap-1.5">
              <span className="font-semibold text-muted-foreground">
                Password Requirements:
              </span>
              <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasMinLength ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  8+ characters
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasUpper && hasLower ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasUpper && hasLower ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  Upper & lower case
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasNumber ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasNumber ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  At least 1 number
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasSpecial ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasSpecial ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  Special character
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={registerPending}
            className="w-full gap-2 mt-2 shadow-xs"
          >
            {registerPending ? (
              <Spinner>Sending verification code...</Spinner>
            ) : (
              <>
                <UserPlus className="size-4" />
                <span>Create Citizen Account</span>
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      {/* Divider & Google OAuth */}
      <div className="flex flex-col gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>

        <div className="flex justify-center w-full">
          {googleLogin ?? <GoogleLoginComponent />}
        </div>
      </div>

      {/* Switch to Sign In */}
      <div className="text-center pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Already registered on CivicFlow?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>Sign in to your account</span>
            <ArrowRight className="size-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
