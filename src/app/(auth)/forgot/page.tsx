import type { Metadata } from "next";
import { ForgotFlow } from "@/features/auth/components/forgot-flow";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPage() {
  return <ForgotFlow />;
}
