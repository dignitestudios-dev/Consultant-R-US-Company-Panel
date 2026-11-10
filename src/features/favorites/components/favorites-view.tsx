"use client";

import { useState } from "react";
import { ShieldUser, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultantAvatar } from "@/features/consultants/components/consultant-avatar";
import { ConsultantSheet } from "@/features/consultants/components/consultant-sheet";
import { FavoriteButton } from "@/features/consultants/components/favorite-button";
import { useFavorites } from "../hooks/use-favorites";
import type { Consultant } from "@/features/consultants/types";

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
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[107px] rounded-[10px]" />
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
        <div className="flex flex-col items-center gap-3 rounded-[10px] border bg-card px-6 py-16 text-center animate-in fade-in">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Star className="size-5" />
          </span>
          <div className="space-y-1">
            <h2 className="font-bold">No favorites yet</h2>
            <p className="text-sm text-muted-foreground">Star a consultant to keep them here.</p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <li
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => show(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  show(p);
                }
              }}
              className="relative flex cursor-pointer gap-4 rounded-[10px] border border-transparent bg-card p-2.5 outline-none transition-all hover:border-gold/40 hover:bg-[#122631] focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ConsultantAvatar
                person={p}
                className="size-[87px] rounded-[10px] after:rounded-[10px]"
                fallbackClassName="rounded-[10px] bg-gradient-to-br from-[#1d3a49] to-[#12242e] text-2xl"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 pr-9">
                <div className="space-y-1">
                  <h3 className="truncate text-base font-semibold tracking-[-0.011em]">{p.name}</h3>
                  <p className="truncate text-sm font-light">{p.jobTitle ?? "Consultant"}</p>
                </div>
                {p.experience !== null && (
                  <p className="flex items-center gap-1.5 text-base font-medium">
                    <ShieldUser className="size-5 text-gold" aria-hidden="true" />
                    {String(p.experience).padStart(2, "0")} {p.experience === 1 ? "Year" : "Years"}
                  </p>
                )}
              </div>
              <FavoriteButton person={p} className="absolute right-1 top-1" />
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
