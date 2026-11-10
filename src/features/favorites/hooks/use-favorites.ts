"use client";

import { useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import { getFavorites, toggleFavorite } from "../api";
import type { ConsultantPage } from "@/features/consultants/api";
import type { Consultant } from "@/features/consultants/types";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { errorMessage } from "@/lib/api/errors";

export const FAVORITES_KEY = ["favorites"] as const;
export const CONSULTANTS_KEY = ["consultants"] as const;
export const CONSULTANT_KEY = ["consultant"] as const;

export function useFavorites() {
  const { token } = useAuth();
  return useQuery({ queryKey: FAVORITES_KEY, queryFn: getFavorites, enabled: !!token });
}

/** Flip the heart everywhere it is cached so the UI answers instantly. */
export function useToggleFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (c: Pick<Consultant, "id" | "isWishList">) => toggleFavorite(c.id),
    onMutate: async (c) => {
      const next = !c.isWishList;
      await Promise.all([
        qc.cancelQueries({ queryKey: CONSULTANTS_KEY }),
        qc.cancelQueries({ queryKey: FAVORITES_KEY }),
      ]);
      const snapshots = qc.getQueriesData({ queryKey: CONSULTANTS_KEY });
      const favorites = qc.getQueryData<Consultant[]>(FAVORITES_KEY);

      qc.setQueriesData<InfiniteData<ConsultantPage>>(
        { queryKey: CONSULTANTS_KEY },
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              items: p.items.map((i) => (i.id === c.id ? { ...i, isWishList: next } : i)),
            })),
          },
      );
      qc.setQueryData<Consultant | undefined>([...CONSULTANT_KEY, c.id], (old) =>
        old ? { ...old, isWishList: next } : old,
      );
      if (!next) {
        qc.setQueryData<Consultant[]>(FAVORITES_KEY, (old) => old?.filter((i) => i.id !== c.id));
      }
      return { snapshots, favorites, next };
    },
    onSuccess: (_msg, _c, ctx) => {
      toast.success(ctx?.next ? "Added to favorites" : "Removed from favorites");
    },
    onError: (e, _c, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
      if (ctx?.favorites) qc.setQueryData(FAVORITES_KEY, ctx.favorites);
      qc.invalidateQueries({ queryKey: CONSULTANT_KEY });
      toast.error(errorMessage(e));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}
