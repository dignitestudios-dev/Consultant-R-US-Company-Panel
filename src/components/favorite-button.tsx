"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { actions, useStore } from "@/lib/store";
import type { Consultant } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FavoriteButton({ person, className }: { person: Consultant; className?: string }) {
  const { favorites } = useStore();
  const on = favorites.includes(person.id);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-pressed={on}
      aria-label={`${on ? "Remove" : "Add"} ${person.name} ${on ? "from" : "to"} favorites`}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        const added = actions.toggleFavorite(person.id);
        toast(added ? `${person.name} added to favorites` : `${person.name} removed from favorites`);
      }}
    >
      <Star
        className={cn(
          "size-[18px] transition-all duration-200",
          on ? "scale-110 fill-gold text-gold" : "text-muted-foreground",
        )}
      />
    </Button>
  );
}
