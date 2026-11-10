"use client";

import Link from "next/link";
import { Mail, Maximize2, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificatesTab, ProfileTab, ResumesTab } from "./consultant-tabs";
import { ConsultantAvatar } from "./consultant-avatar";
import { FavoriteButton } from "./favorite-button";
import { mailtoHref } from "../email";
import { telHref } from "@/lib/format";
import { ROUTES } from "@/config/routes";
import type { Consultant } from "../types";
import { cn } from "@/lib/utils";

export function ConsultantSheet({
  person,
  open,
  onOpenChange,
  tab,
  onTabChange,
}: {
  person: Consultant | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tab: string;
  onTabChange: (t: string) => void;
}) {
  const place = person && [person.preferredCity, person.preferredState].filter(Boolean).join(", ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 border-l-white/10 bg-card p-0 data-[side=right]:sm:max-w-[600px]">
        {person && (
          <>
            <SheetHeader className="space-y-4 border-b p-5 pr-14">
              <div className="flex items-start gap-4">
                <ConsultantAvatar
                  person={person}
                  className="size-14 rounded-xl after:rounded-xl"
                  fallbackClassName="rounded-xl text-lg"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <SheetTitle className="text-xl font-extrabold">{person.name}</SheetTitle>
                  <SheetDescription>{person.jobTitle ?? "Consultant"}</SheetDescription>
                  <p className="flex flex-wrap items-center gap-x-3 text-xs font-semibold">
                    {person.experience !== null && (
                      <span>
                        {person.experience} {person.experience === 1 ? "year" : "years"}
                      </span>
                    )}
                    {place && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3" /> {place}
                      </span>
                    )}
                  </p>
                </div>
                <Link
                  href={ROUTES.consultant(person.id)}
                  aria-label={`Open ${person.name} in full page`}
                  title="Open full page"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-lg" }),
                    "text-muted-foreground",
                  )}
                >
                  <Maximize2 className="size-4" />
                </Link>
                <FavoriteButton person={person} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={mailtoHref(person.email)}
                  className={cn(buttonVariants({ variant: "gold", size: "lg" }), "h-10 font-bold")}
                >
                  <Mail /> Email
                </a>
                <a
                  href={telHref(person.phone)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-10 font-bold",
                  )}
                >
                  <Phone /> Call
                </a>
              </div>
            </SheetHeader>
            <Tabs
              value={tab}
              onValueChange={(v) => onTabChange(String(v))}
              className="min-h-0 flex-1 gap-0"
            >
              <div className="px-5 pt-3">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="resume">Resumes</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates / Degrees</TabsTrigger>
                </TabsList>
              </div>
              <Separator className="mt-3" />
              <div className="@container min-h-0 flex-1 overflow-y-auto">
                <TabsContent value="profile">
                  <ProfileTab p={person} />
                </TabsContent>
                <TabsContent value="resume">
                  <ResumesTab p={person} />
                </TabsContent>
                <TabsContent value="certificates">
                  <CertificatesTab p={person} />
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
