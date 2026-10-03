import AuthLayout from "@/components/layouts/public/AuthLayout";
import RegisterForm from "@/components/form/register-form";
import GoogleLoginComponent from "@/components/GoogleLogin";

export const metadata = {
  title: "Create Citizen Account — CivicFlow",
  description:
    "Register to report civic complaints and track municipal resolutions.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Citizen Account"
      subtitle="Join the transparent municipal network to report issues, track repairs, and verify completion."
      mode="register"
    >
      <RegisterForm googleLogin={<GoogleLoginComponent />} />
    </AuthLayout>
  );
}
