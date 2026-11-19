import type { Metadata } from "next";
import { CompanySetup } from "@/features/company/components/company-setup";

export const metadata: Metadata = { title: "Set up company profile" };

export default function SetupPage() {
  return <CompanySetup />;
}
