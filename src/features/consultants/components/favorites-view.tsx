"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultantSheet } from "@/features/consultants/components/consultant-sheet";
import { FavoriteCard } from "@/features/consultants/components/favorite-card";
import { useFavorites } from "@/features/consultants/hooks/use-favorites";
import type { Consultant } from "@/features/consultants/types/consultants.types";

export function FavoritesView() {
  const { data, isPending, isError, error, refetch } = useFavorites();
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("profile");
  const items = data ?? [];
  const current = items.find((c) => c.id === selected) ?? null;

  const show = (p: Consultant) => {
    setSelected(p.id);
    setTab("profile");
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            Consultants you&apos;ve starred, kept in one place.
          </p>
        </div>
        {data && (
          <p className="text-sm font-semibold text-muted-foreground" role="status">
            <span className="text-foreground">{items.length}</span> starred
          </p>
        )}
      </div>

      {isPending ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,240px))] justify-center gap-x-4 gap-y-2 sm:justify-start">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="mt-14 h-[300px] rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-[10px] border bg-card px-6 py-16 text-center">
          <h2 className="font-bold">Couldn&apos;t load favorites</h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="Tap the star on a consultant to keep them here for quick access."
          action={
            <Button variant="gold" render={<Link href={ROUTES.consultants} />}>
              Browse consultants
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,240px))] justify-center gap-x-4 gap-y-2 sm:justify-start">
          {items.map((p) => (
            <li key={p.id} className="flex pt-14">
              <FavoriteCard person={p} onOpen={() => show(p)} />
            </li>
          ))}
        </ul>
      )}

      <ConsultantSheet
        person={current}
        open={open}
        onOpenChange={setOpen}
        tab={tab}
        onTabChange={setTab}
      />
    </div>
  );
}
