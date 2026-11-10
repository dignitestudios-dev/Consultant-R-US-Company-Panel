"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Availability } from "./availability";
import { FavoriteButton } from "./favorite-button";
import { Profile, Resume } from "./consultant-tabs";
import { initials, type Consultant } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ConsultantDetail({ person: p }: { person: Consultant }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/consultants"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to consultants
      </Link>

      <div className="overflow-hidden rounded-[10px] border bg-card">
        <header className="flex flex-wrap items-start gap-5 border-b p-6">
          <Avatar className="size-20 rounded-[10px] after:rounded-[10px]">
            <AvatarFallback className="rounded-[10px] bg-secondary text-2xl font-bold text-gold ring-1 ring-gold/25">
              {initials(p.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight">{p.name}</h1>
            <p className="text-muted-foreground">{p.role}</p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
              <span>{p.years} {p.years === 1 ? "year" : "years"}</span>
              <span className="flex items-center gap-1 font-normal text-muted-foreground">
                <MapPin className="size-3.5" /> {p.location}
              </span>
              <Availability value={p.availability} className="font-normal" />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton person={p} />
            <a href={`mailto:${p.email}`} className={cn(buttonVariants({ variant: "gold", size: "lg" }), "h-10 font-bold")}>
              <Mail /> Email
            </a>
            <a href={`tel:${p.phone.replace(/[^0-9]/g, "")}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 font-bold")}>
              <Phone /> Call
            </a>
          </div>
        </header>

        <Tabs defaultValue="profile" className="gap-0">
          <div className="border-b px-6 py-3">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="profile"><Profile p={p} /></TabsContent>
          <TabsContent value="resume"><Resume p={p} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
