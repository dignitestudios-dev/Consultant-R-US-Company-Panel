import type { Metadata } from "next";
import { ConsultantBrowser } from "@/components/consultant-browser";

export const metadata: Metadata = { title: "Find consultants" };

export default function ConsultantsPage() {
  return <ConsultantBrowser mode="all" />;
}
