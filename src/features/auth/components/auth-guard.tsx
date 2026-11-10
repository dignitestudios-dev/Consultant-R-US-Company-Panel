"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useCompany } from "@/features/company/hooks/use-company";
import { ProfileIncompleteError } from "@/features/company/api";
import { isSubscribed } from "@/features/company/types";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center" role="status" aria-label="Loading">
      <Loader2 className="size-7 animate-spin text-gold" />
    </div>
  );
}

/** Protects the signed-in app: session, completed profile, active subscription. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { hydrated, isAuthed } = useAuth();
  const company = useCompany();

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace(ROUTES.login);
  }, [hydrated, isAuthed, router]);

  const incomplete = company.error instanceof ProfileIncompleteError;
  const subscribed = isSubscribed(company.data);

  useEffect(() => {
    if (incomplete) router.replace(ROUTES.setup);
    else if (company.data && !subscribed) router.replace(ROUTES.subscription);
  }, [incomplete, company.data, subscribed, router]);

  if (!hydrated || !isAuthed) return <FullScreenLoader />;
  if (company.isPending || incomplete) return <FullScreenLoader />;

  if (company.isError) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="max-w-sm space-y-4 text-center">
          <h1 className="text-xl font-bold">Couldn&apos;t load your company</h1>
          <p className="text-sm text-muted-foreground">{company.error.message}</p>
          <Button variant="gold" onClick={() => company.refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!subscribed) return <FullScreenLoader />;
  return <>{children}</>;
}

/** For login / signup / forgot: signed-in users go straight to the app. */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { hydrated, isAuthed } = useAuth();

  useEffect(() => {
    if (hydrated && isAuthed) router.replace(ROUTES.consultants);
  }, [hydrated, isAuthed, router]);

  if (!hydrated || isAuthed) return <FullScreenLoader />;
  return <>{children}</>;
}
