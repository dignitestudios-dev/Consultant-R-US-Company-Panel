"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, UserX } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Availability } from "./availability";
import { ConsultantAvatar } from "./consultant-avatar";
import { FavoriteButton } from "./favorite-button";
import { CertificatesTab, ProfileTab, ResumesTab } from "./consultant-tabs";
import { useConsultant } from "../hooks/use-consultants";
import { mailtoHref } from "../email";
import { telHref } from "@/lib/format";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

const Back = () => (
  <Link
    href={ROUTES.consultants}
    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft className="size-4" /> Back to consultants
  </Link>
);

export function ConsultantDetail({ id }: { id: string }) {
  const { data: p, isPending, isError, error, refetch } = useConsultant(id);

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Back />
        <Skeleton className="h-40 w-full rounded-[10px]" />
        <Skeleton className="h-72 w-full rounded-[10px]" />
      </div>
    );
  }

  if (isError || !p) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Back />
        <div className="flex flex-col items-center gap-3 rounded-[10px] border bg-card px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <UserX className="size-5" />
          </span>
          <h1 className="font-bold">
            {isError ? "Couldn't load this consultant" : "Consultant not found"}
          </h1>
          {isError && <p className="text-sm text-muted-foreground">{error.message}</p>}
          {isError && (
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  const place = [p.preferredCity, p.preferredState].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Back />

      <div className="overflow-hidden rounded-[10px] border bg-card">
        <header className="flex flex-wrap items-start gap-5 border-b p-6">
          <ConsultantAvatar
            person={p}
            className="size-20 rounded-[10px] after:rounded-[10px]"
            fallbackClassName="rounded-[10px] text-2xl"
          />
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight">{p.name}</h1>
            <p className="text-muted-foreground">{p.jobTitle ?? "Consultant"}</p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
              {p.experience !== null && (
                <span>
                  {p.experience} {p.experience === 1 ? "year" : "years"}
                </span>
              )}
              {place && (
                <span className="flex items-center gap-1 font-normal text-muted-foreground">
                  <MapPin className="size-3.5" /> {place}
                </span>
              )}
              <Availability value={p.availability} className="font-normal" />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton person={p} />
            <a
              href={mailtoHref(p.email)}
              className={cn(buttonVariants({ variant: "gold", size: "lg" }), "h-10 font-bold")}
            >
              <Mail /> Email
            </a>
            <a
              href={telHref(p.phone)}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 font-bold")}
            >
              <Phone /> Call
            </a>
          </div>
        </header>

        <Tabs defaultValue="profile" className="gap-0">
          <div className="border-b px-6 py-3">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="resume">Resumes</TabsTrigger>
              <TabsTrigger value="certificates">Certificates / Degrees</TabsTrigger>
            </TabsList>
          </div>
          <div className="@container">
            <TabsContent value="profile">
              <ProfileTab p={p} />
            </TabsContent>
            <TabsContent value="resume">
              <ResumesTab p={p} />
            </TabsContent>
            <TabsContent value="certificates">
              <CertificatesTab p={p} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
