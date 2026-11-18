import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/utils/format";
import type { Consultant } from "@/features/consultants/types/consultants.types";
import { cn } from "@/utils/cn";

export function ConsultantAvatar({
  person,
  className,
  fallbackClassName,
}: {
  person: Pick<Consultant, "name" | "profilePicture">;
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <Avatar className={className}>
      {person.profilePicture && (
        <AvatarImage src={person.profilePicture} alt="" className="object-cover" />
      )}
      <AvatarFallback
        className={cn("bg-secondary font-bold text-gold ring-1 ring-gold/25", fallbackClassName)}
      >
        {initials(person.name)}
      </AvatarFallback>
    </Avatar>
  );
}
