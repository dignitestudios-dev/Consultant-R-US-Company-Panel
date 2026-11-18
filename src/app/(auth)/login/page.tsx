import { GuestOnly } from "@/components/shared/auth-guard";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}
