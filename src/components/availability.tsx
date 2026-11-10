import { cn } from "@/lib/utils";
import type { Consultant } from "@/lib/data";

const TONE: Record<Consultant["availability"], string> = {
  "Available now": "bg-success",
  "Within 30 days": "bg-gold",
  "Project dependent": "bg-muted-foreground/50",
};

export function Availability({ value, className }: { value: Consultant["availability"]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap text-sm", className)}>
      <span className={cn("size-2 rounded-full", TONE[value])} aria-hidden="true" />
      {value}
    </span>
  );
}
