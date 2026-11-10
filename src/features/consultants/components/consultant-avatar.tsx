import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials, type Consultant } from "../types";
import { cn } from "@/lib/utils";

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
