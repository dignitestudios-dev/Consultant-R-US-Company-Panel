import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { CompaniesView } from "@/features/company/components/companies-view";

export const metadata: Metadata = { title: "Companies" };

export default function CompaniesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-[10px]" />}>
      <CompaniesView />
    </Suspense>
  );
}
