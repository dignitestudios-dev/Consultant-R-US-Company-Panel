"use client";

import { useSaveCompanyMutation } from "@/features/company/api/company.mutations";

export function useSaveCompany() {
  return useSaveCompanyMutation();
}
