"use client";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { getConsultants, type ConsultantPage } from "../api";
import type { Filters } from "../filters";
import type { Consultant } from "../types";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  CONSULTANTS_KEY,
  CONSULTANT_KEY,
  FAVORITES_KEY,
} from "@/features/favorites/hooks/use-favorites";

export function useConsultants(filters: Filters) {
  const { token } = useAuth();
  return useInfiniteQuery({
    queryKey: [...CONSULTANTS_KEY, filters],
    queryFn: ({ pageParam }) => getConsultants(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    enabled: !!token,
  });
}

/**
 * The backend has no "get one consultant" endpoint, so we reuse what the list and
 * favorites already loaded, and otherwise walk the list until the id turns up.
 */
export function useConsultant(id: string) {
  const qc = useQueryClient();
  const { token } = useAuth();

  const fromCache = (): Consultant | undefined => {
    for (const [, data] of qc.getQueriesData<InfiniteData<ConsultantPage>>({
      queryKey: CONSULTANTS_KEY,
    })) {
      const hit = data?.pages.flatMap((p) => p.items).find((c) => c.id === id);
      if (hit) return hit;
    }
    return qc.getQueryData<Consultant[]>(FAVORITES_KEY)?.find((c) => c.id === id);
  };

  return useQuery({
    queryKey: [...CONSULTANT_KEY, id],
    enabled: !!token,
    initialData: fromCache,
    queryFn: async () => {
      const cached = fromCache();
      if (cached) return cached;
      const empty: Filters = {
        experience: "",
        age: "",
        education: "",
        certs: [],
        resumes: [],
        industry: "",
        availability: "",
        preferredState: "",
        preferredCity: "",
      };
      let page = 1;
      for (;;) {
        const res = await getConsultants(empty, page, 50);
        const hit = res.items.find((c) => c.id === id);
        if (hit) return hit;
        if (page >= res.totalPages) return null;
        page += 1;
      }
    },
  });
}
