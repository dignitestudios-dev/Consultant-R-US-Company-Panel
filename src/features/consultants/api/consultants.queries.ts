import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getConsultants, getFavorites } from "@/features/consultants/api/consultants.service";
import type { Filters } from "@/features/consultants/types/consultants.types";

export const FAVORITES_KEY = ["favorites"] as const;
export const CONSULTANTS_KEY = ["consultants"] as const;

export function useConsultantsQuery(filters: Filters) {
  const { token } = useAuth();
  return useInfiniteQuery({
    queryKey: [...CONSULTANTS_KEY, filters],
    queryFn: ({ pageParam }) => getConsultants(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    enabled: !!token,
  });
}

export function useFavoritesQuery() {
  const { token } = useAuth();
  return useQuery({ queryKey: FAVORITES_KEY, queryFn: getFavorites, enabled: !!token });
}
