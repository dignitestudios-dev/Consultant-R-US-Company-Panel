import type { Metadata } from "next";
import { ConsultantBrowser } from "@/features/consultants/components/consultant-browser";

export const metadata: Metadata = { title: "Find consultants" };

export default function ConsultantsPage() {
  return <ConsultantBrowser />;
}
