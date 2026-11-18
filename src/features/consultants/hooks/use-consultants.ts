"use client";

import { useConsultantsQuery } from "@/features/consultants/api/consultants.queries";
import type { Filters } from "@/features/consultants/types/consultants.types";

export function useConsultants(filters: Filters) {
  return useConsultantsQuery(filters);
}
