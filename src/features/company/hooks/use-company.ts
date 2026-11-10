"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api";
import { setUser } from "@/features/auth/store/auth-slice";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAppDispatch } from "@/store/hooks";

export const COMPANY_KEY = ["company"] as const;

/** Fresh company profile (also keeps the stored user in sync). */
export function useCompany() {
  const { token } = useAuth();
  const dispatch = useAppDispatch();
  const query = useQuery({
    queryKey: COMPANY_KEY,
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (query.data) dispatch(setUser(query.data));
  }, [query.data, dispatch]);

  return query;
}

export const companyDisplayName = (name?: string | null) => name?.trim() || "Your company";
