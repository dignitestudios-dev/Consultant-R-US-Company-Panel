"use client";

import { useEffect, useState } from "react";
import { useCompaniesQuery } from "@/features/company/api/company.queries";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlParams } from "@/hooks/use-url-params";

/** Directory of companies with a text filter. */
export function useCompanies() {
  const { get, set } = useUrlParams();
  const [query, setQuery] = useState(get("q"));
  const debounced = useDebounce(query.trim());
  const q = useCompaniesQuery();
  const term = debounced.toLowerCase();

  useEffect(() => {
    if (debounced !== get("q")) set({ q: debounced || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const all = (q.data ?? []).filter((c) => c.companyName);
  const rows = term ? all.filter((c) => c.companyName!.toLowerCase().includes(term)) : all;
  return { ...q, rows, query, setQuery };
}
