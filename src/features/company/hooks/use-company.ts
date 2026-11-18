"use client";

import { useEffect } from "react";
import { useCompanyQuery } from "@/features/company/api/company.queries";
import { ProfileIncompleteError } from "@/features/company/api/company.service";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/auth.slice";

/** Fresh company profile (also keeps the stored user in sync). */
export function useCompany() {
  const dispatch = useAppDispatch();
  const query = useCompanyQuery();

  useEffect(() => {
    if (query.data) dispatch(setUser(query.data));
  }, [query.data, dispatch]);

  return { ...query, isProfileIncomplete: query.error instanceof ProfileIncompleteError };
}
