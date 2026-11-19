import type { Metadata } from "next";
import { PendingVerification } from "@/components/shared/pending-verification";

export const metadata: Metadata = { title: "Verification pending" };

export default function PendingVerificationPage() {
  return <PendingVerification />;
}
