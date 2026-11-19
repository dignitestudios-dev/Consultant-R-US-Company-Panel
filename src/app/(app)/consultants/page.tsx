import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultantBrowser } from "@/features/consultants/components/consultant-browser";

export const metadata: Metadata = { title: "Find consultants" };

export default function ConsultantsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-[10px]" />}>
      <ConsultantBrowser />
    </Suspense>
  );
}
