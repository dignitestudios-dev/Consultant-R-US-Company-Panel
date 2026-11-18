"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Availability } from "@/features/consultants/components/availability";
import { ConsultantAvatar } from "@/features/consultants/components/consultant-avatar";
import { FavoriteButton } from "@/features/consultants/components/favorite-button";
import { mailtoHref } from "@/features/consultants/utils/email.utils";
import type { Consultant } from "@/features/consultants/types/consultants.types";
import { telHref } from "@/utils/format";
import { cn } from "@/utils/cn";

/** Profile card with the avatar sitting in an arch on top. Every card is the same size. */
export function FavoriteCard({ person: p, onOpen }: { person: Consultant; onOpen: () => void }) {
  const place = [p.preferredCity, p.preferredState].filter(Boolean).join(", ");
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`Open ${p.name}`}
      className="relative flex h-[300px] w-full cursor-pointer flex-col items-center rounded-2xl border bg-card px-4 pb-4 pt-[72px] text-center outline-none transition-colors hover:border-gold/40 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-full border bg-card p-2 shadow-lg shadow-black/20">
        <ConsultantAvatar
          person={p}
          className="size-28 rounded-full after:rounded-full"
          fallbackClassName="rounded-full bg-gradient-to-br from-[#1d3a49] to-[#12242e] text-3xl"
        />
      </div>
      <FavoriteButton person={p} className="absolute top-1.5 right-1.5" />

      <h3 className="max-w-full truncate rounded-xl border bg-background/60 px-4 py-1.5 text-base font-extrabold tracking-wide uppercase shadow-sm">
        {p.name}
      </h3>
      <p className="mt-2 max-w-full truncate text-sm font-semibold">{p.jobTitle ?? "Consultant"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {p.experience !== null
          ? `${p.experience} ${p.experience === 1 ? "year" : "years"} experience`
          : "Experience not provided"}
      </p>
      <p className="mt-1 flex max-w-full items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-3.5 flex-none text-gold" aria-hidden="true" />
        <span className="truncate">{place || "Location not provided"}</span>
      </p>
      <Availability value={p.availability} className="mt-1 text-xs text-muted-foreground" />

      <div className="mt-auto grid w-full grid-cols-2 gap-2">
        <a
          href={mailtoHref(p.email)}
          onClick={stop}
          onKeyDown={stop}
          className={cn(buttonVariants({ variant: "gold", size: "lg" }), "h-9 font-bold")}
        >
          <Mail /> Email
        </a>
        <a
          href={telHref(p.phone)}
          onClick={stop}
          onKeyDown={stop}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-9 font-bold")}
        >
          <Phone /> Call
        </a>
      </div>
    </article>
  );
}
