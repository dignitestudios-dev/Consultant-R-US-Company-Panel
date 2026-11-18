"use client";

import { Mail, MapPin, Phone } from "lucide-react";
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
import {
  CertificatesTab,
  ProfileTab,
  ResumesTab,
} from "@/features/consultants/components/consultant-tabs";
import { ConsultantAvatar } from "@/features/consultants/components/consultant-avatar";
import { FavoriteButton } from "@/features/consultants/components/favorite-button";
import { mailtoHref } from "@/features/consultants/utils/email.utils";
import { formatPhone, telHref } from "@/utils/format";
import type { Consultant } from "@/features/consultants/types/consultants.types";
import { cn } from "@/utils/cn";

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
                <FavoriteButton person={person} />
              </div>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2 break-all">
                  <Mail className="size-3.5 flex-none text-gold" />
                  {person.email ?? <span className="text-muted-foreground">No email</span>}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-3.5 flex-none text-gold" />
                  {formatPhone(person.phone) ?? (
                    <span className="text-muted-foreground">No phone</span>
                  )}
                </p>
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
