"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Keeps the login-style pages narrow and gives the company setup form room. */
export function AuthContainer({ children }: { children: React.ReactNode }) {
  const wide = usePathname() === "/setup";
  return (
    <div
      className={cn(
        "w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500",
        wide ? "max-w-[620px]" : "max-w-[400px]",
      )}
    >
      {children}
    </div>
  );
}
