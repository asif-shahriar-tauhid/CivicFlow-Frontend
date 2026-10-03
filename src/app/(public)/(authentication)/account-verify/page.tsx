import AuthLayout from "@/components/layouts/public/AuthLayout";
import VerifyEmailForm from "@/components/form/verify-email-form";

export const metadata = {
  title: "Verify Citizen Account — CivicFlow",
  description: "Verify your email to activate your CivicFlow citizen profile.",
};

export default function AccountVerifyPage() {
  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle="Enter the 6-digit confirmation code sent to your registered email to activate your citizen profile."
      mode="verify"
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
