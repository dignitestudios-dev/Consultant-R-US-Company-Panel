"use client";

import { useState } from "react";
import { useCompaniesQuery } from "@/features/company/api/company.queries";

/** Directory of companies with a text filter. */
export function useCompanies() {
  const [query, setQuery] = useState("");
  const q = useCompaniesQuery();
  const term = query.trim().toLowerCase();
  const all = (q.data ?? []).filter((c) => c.companyName);
  const rows = term ? all.filter((c) => c.companyName!.toLowerCase().includes(term)) : all;
  return { ...q, rows, query, setQuery };
}
