"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, LogOut, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullScreenLoader } from "@/features/auth/components/auth-guard";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCompany } from "@/features/company/hooks/use-company";
import { isSubscribed } from "@/features/company/types";
import { ROUTES } from "@/config/routes";

export default function SubscriptionRequiredPage() {
  const router = useRouter();
  const { hydrated, isAuthed } = useAuth();
  const company = useCompany();
  const logout = useLogout();

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace(ROUTES.login);
  }, [hydrated, isAuthed, router]);

  useEffect(() => {
    if (isSubscribed(company.data)) router.replace(ROUTES.consultants);
  }, [company.data, router]);

  if (!hydrated || !isAuthed || company.isPending) return <FullScreenLoader />;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md space-y-6 text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
        <Image
          src="/logo.png"
          alt="Consultants R US"
          width={198}
          height={204}
          className="mx-auto h-20 w-auto"
        />
        <div className="space-y-3 rounded-xl border bg-card p-7">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-gold-soft text-gold">
            <Smartphone className="size-6" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Subscription required</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your company doesn&apos;t have an active subscription yet. Subscriptions are bought in
            the Consultants R US mobile app (App Store or Google Play). Once it&apos;s active,
            refresh this page to continue.
          </p>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
            <Button
              variant="gold"
              className="h-10 font-bold"
              onClick={() => company.refetch()}
              disabled={company.isFetching}
            >
              {company.isFetching && <Loader2 className="animate-spin" />} Check again
            </Button>
            <Button variant="outline" className="h-10" onClick={logout}>
              <LogOut /> Log out
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
