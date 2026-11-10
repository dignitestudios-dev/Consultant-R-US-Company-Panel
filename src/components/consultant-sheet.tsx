"use client";

import Link from "next/link";
import { Mail, Maximize2, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile, Resume } from "./consultant-tabs";
import { FavoriteButton } from "./favorite-button";
import { initials, type Consultant } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ConsultantSheet({
  person, open, onOpenChange, tab, onTabChange,
}: {
  person: Consultant | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tab: string;
  onTabChange: (t: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 border-l-white/10 bg-card p-0 data-[side=right]:sm:max-w-[600px]">
        {person && (
          <>
            <SheetHeader className="space-y-4 border-b p-5 pr-14">
              <div className="flex items-start gap-4">
                <Avatar className="size-14 rounded-xl after:rounded-xl">
                  <AvatarFallback className="rounded-xl bg-secondary ring-1 ring-gold/25 text-lg font-bold text-gold">
                    {initials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <SheetTitle className="text-xl font-extrabold">{person.name}</SheetTitle>
                  <SheetDescription>{person.role}</SheetDescription>
                  <p className="flex flex-wrap items-center gap-x-3 text-xs font-semibold">
                    <span>{person.years} {person.years === 1 ? "year" : "years"}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3" /> {person.location}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/consultants/${person.id}`}
                  aria-label={`Open ${person.name} in full page`}
                  title="Open full page"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "text-muted-foreground")}
                >
                  <Maximize2 className="size-4" />
                </Link>
                <FavoriteButton person={person} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={`mailto:${person.email}`} className={cn(buttonVariants({ variant: "gold", size: "lg" }), "h-10 font-bold")}>
                  <Mail /> Email
                </a>
                <a href={`tel:${person.phone.replace(/[^0-9]/g, "")}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 font-bold")}>
                  <Phone /> Call
                </a>
              </div>
            </SheetHeader>
            <Tabs value={tab} onValueChange={(v) => onTabChange(String(v))} className="min-h-0 flex-1 gap-0">
              <div className="px-5 pt-3">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                </TabsList>
              </div>
              <Separator className="mt-3" />
              <div className="min-h-0 flex-1 overflow-y-auto">
                <TabsContent value="profile"><Profile p={person} /></TabsContent>
                <TabsContent value="resume"><Resume key={person.id} p={person} /></TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
