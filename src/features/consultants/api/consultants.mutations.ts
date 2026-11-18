import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleFavorite, trackEvent } from "@/features/consultants/api/consultants.service";
import { CONSULTANTS_KEY, FAVORITES_KEY } from "@/features/consultants/api/consultants.queries";
import type {
  Consultant,
  ConsultantPage,
  TrackEvent,
} from "@/features/consultants/types/consultants.types";
import { errorMessage } from "@/utils/api-error";

/** Tells the backend (which notifies the consultant) a document was opened or downloaded. */
export function useTrackEventMutation(employeeId: string) {
  return useMutation({ mutationFn: (e: TrackEvent) => trackEvent(employeeId, e) });
}

/** Flip the heart everywhere it is cached so the UI answers instantly. */
export function useToggleFavoriteMutation() {
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
      toast.error(errorMessage(e));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}
