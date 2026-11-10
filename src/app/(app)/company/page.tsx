import type { Metadata } from "next";
import { CompanyForm } from "@/components/company-form";

export const metadata: Metadata = { title: "Company profile" };

export default function CompanyPage() {
  return <CompanyForm />;
}
