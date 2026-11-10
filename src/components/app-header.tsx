"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Building2, ChevronDown, LogOut, Star, Users } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/consultants", label: "Consultants", icon: Users },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/company", label: "Company profile", icon: Building2 },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { company, favorites } = useStore();
  const initials = company.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[#374856] bg-card/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Link href="/consultants" aria-label="Consultants R US, home" className="flex-none">
          <Image src="/logo.png" alt="Consultants R US" width={198} height={204} priority className="h-12 w-auto" />
        </Link>

        <nav aria-label="Main" className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-none items-center gap-2 px-3 text-sm font-semibold transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4 sm:hidden" aria-hidden="true" />
                <span className="max-sm:sr-only">{label}</span>
                {href === "/favorites" && favorites.length > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold leading-5 text-white">
                    {favorites.length}
                  </span>
                )}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex flex-none items-center gap-2.5 rounded-lg p-1.5 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            id="account-menu-trigger"
            aria-label="Account menu"
          >
            <Avatar size="sm">
              <AvatarFallback className="bg-secondary text-xs font-bold text-gold">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[160px] truncate text-sm font-semibold md:block">{company.name}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => router.push("/company")}>
              <Building2 /> Company profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setConfirmLogout(true)}>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of {company.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again to find and contact consultants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/login")}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
