"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, LogOut, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullScreenLoader } from "@/components/shared/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCompany } from "@/features/company/hooks/use-company";
import { ROUTES, SUPPORT_EMAIL } from "@/config/routes";
import { isPendingApproval } from "@/utils/company";

/** Shown while an admin has not approved the company yet. */
export function PendingVerification() {
  const router = useRouter();
  const { hydrated, isAuthed } = useAuth();
  const company = useCompany();
  const { logout, isPending: loggingOut } = useLogout();

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace(ROUTES.login);
  }, [hydrated, isAuthed, router]);

  useEffect(() => {
    if (company.data && !isPendingApproval(company.data)) router.replace(ROUTES.consultants);
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
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Verification pending</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Thanks for setting up {company.data?.companyName ?? "your company"}. Our team is
            reviewing your proof document. You&apos;ll be able to use your account as soon as it is
            approved.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:text-gold hover:underline"
            >
              <Mail className="size-3.5" /> {SUPPORT_EMAIL}
            </a>
          </p>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
            <Button
              variant="gold"
              className="h-10 font-bold"
              onClick={() => company.refetch()}
              disabled={company.isFetching || loggingOut}
            >
              {company.isFetching && <Loader2 className="animate-spin" />} Check status
            </Button>
            <Button
              variant="outline"
              className="h-10"
              onClick={() => void logout()}
              disabled={loggingOut}
            >
              {loggingOut ? <Loader2 className="animate-spin" /> : <LogOut />} Log out
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
