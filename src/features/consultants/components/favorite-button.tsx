"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleFavorite } from "@/features/consultants/hooks/use-toggle-favorite";
import type { Consultant } from "@/features/consultants/types/consultants.types";
import { cn } from "@/utils/cn";

export function FavoriteButton({ person, className }: { person: Consultant; className?: string }) {
  const toggle = useToggleFavorite();
  const on = person.isWishList;
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
        toggle.mutate({ id: person.id, isWishList: on });
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
