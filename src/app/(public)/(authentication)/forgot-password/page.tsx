import ForgotPasswordForm from "@/components/form/forgot-password-form";
import AuthLayout from "@/components/layouts/public/AuthLayout";

export const metadata = {
  title: "Recover Password — CivicFlow",
  description:
    "Request a 6-digit verification code to recover your CivicFlow municipal account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recover Account Access"
      subtitle="Enter your verified municipal account email address to receive a 6-digit recovery OTP code."
      mode="forgot"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
