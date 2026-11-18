"use client";

import { useRef } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfilePicture } from "@/features/company/hooks/use-profile-picture";
import type { Company } from "@/types/common";
import { initials } from "@/utils/format";

/** Large company picture with change / remove actions. Saves as soon as a file is chosen. */
export function ProfilePictureEditor({ company, name }: { company: Company; name: string }) {
  const input = useRef<HTMLInputElement>(null);
  const { change, remove, isPending } = useProfilePicture(company);

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative">
        <Avatar className="size-40 rounded-2xl ring-1 ring-gold/30 after:rounded-2xl">
          {company.profilePicture && (
            <AvatarImage src={company.profilePicture} alt={name} className="object-cover" />
          )}
          <AvatarFallback className="rounded-2xl bg-secondary text-5xl font-bold text-gold">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        {isPending && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-black/50">
            <Loader2 className="size-7 animate-spin text-gold" />
          </div>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) change(file);
          e.target.value = "";
        }}
      />
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="gold"
          disabled={isPending}
          onClick={() => input.current?.click()}
        >
          <Camera /> {company.profilePicture ? "Update picture" : "Add picture"}
        </Button>
        {company.profilePicture && (
          <Button type="button" variant="outline" disabled={isPending} onClick={remove}>
            <Trash2 /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}
