import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

/** `availability` is the date the consultant becomes available. */
export function Availability({ value, className }: { value: string | null; className?: string }) {
  const d = value ? new Date(value) : null;
  const valid = !!d && !Number.isNaN(d.getTime());
  const now = valid && d!.getTime() <= Date.now();
  const label = !valid ? "Not specified" : now ? "Available now" : `From ${formatDate(value)}`;
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap text-sm", className)}>
      <span
        className={cn(
          "size-2 rounded-full",
          now ? "bg-success" : valid ? "bg-gold" : "bg-muted-foreground/50",
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
