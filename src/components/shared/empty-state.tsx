import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Centered placeholder for lists with nothing to show. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 px-6 py-20 text-center animate-in fade-in zoom-in-95 duration-300",
        className,
      )}
    >
      <div className="relative grid size-24 place-items-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-dashed border-gold/25" />
        <span className="absolute inset-3 rounded-full bg-gold-soft blur-md" />
        <span className="relative grid size-14 place-items-center rounded-full border border-gold/30 bg-card text-gold shadow-lg">
          <Icon className="size-6" />
        </span>
      </div>
      <div className="max-w-sm space-y-1.5">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
