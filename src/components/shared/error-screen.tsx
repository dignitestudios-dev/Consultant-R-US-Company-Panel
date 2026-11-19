"use client";

import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface ErrorScreenProps {
  icon: LucideIcon;
  title: string;
  message: string;
  primary: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; onClick?: () => void; href?: string };
  /** Full-page (root) or fills the content area (section). */
  fullPage?: boolean;
}

/** On-theme recovery screen for crashes and missing pages. No technical detail is shown. */
export function ErrorScreen({
  icon: Icon,
  title,
  message,
  primary,
  secondary,
  fullPage,
}: ErrorScreenProps) {
  return (
    <main
      className={`grid place-items-center px-5 py-12 ${fullPage ? "min-h-screen" : "min-h-[60vh]"}`}
    >
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-gold-soft text-gold">
          <Icon className="size-6" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          <Button
            variant="gold"
            className="h-10 font-bold"
            onClick={primary.onClick}
            render={primary.href ? <a href={primary.href} /> : undefined}
          >
            {primary.label}
          </Button>
          {secondary && (
            <Button
              variant="outline"
              className="h-10"
              onClick={secondary.onClick}
              render={secondary.href ? <a href={secondary.href} /> : undefined}
            >
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
