import ResetPasswordForm from "@/components/form/reset-password-form";
import AuthLayout from "@/components/layouts/public/AuthLayout";

export const metadata = {
  title: "Reset Password — CivicFlow",
  description:
    "Reset your CivicFlow password with your 6-digit verification code.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Account Password"
      subtitle="Enter the 6-digit verification code sent to your email along with your new secure password."
      mode="reset"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
