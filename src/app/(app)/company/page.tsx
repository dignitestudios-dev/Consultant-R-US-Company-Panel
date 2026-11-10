import type { Metadata } from "next";
import { CompanyPage } from "@/features/company/components/company-page";

export const metadata: Metadata = { title: "Company profile" };

export default function Page() {
  return <CompanyPage />;
}
