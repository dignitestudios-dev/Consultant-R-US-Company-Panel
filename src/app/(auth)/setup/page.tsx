"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyProfileForm } from "@/features/company/components/company-profile-form";
import { FullScreenLoader } from "@/features/auth/components/auth-guard";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/config/routes";

export default function SetupPage() {
  const router = useRouter();
  const { hydrated, isAuthed, user } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace(ROUTES.login);
  }, [hydrated, isAuthed, router]);

  if (!hydrated || !isAuthed) return <FullScreenLoader />;

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1.5" aria-hidden="true">
            <span className="h-1 flex-1 rounded-full bg-gold" />
            <span className="h-1 flex-1 rounded-full bg-gold" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 2 of 2</p>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Set up company profile</h2>
        <p className="text-sm text-muted-foreground">
          {user?.companyName
            ? `Tell consultants a little about ${user.companyName}.`
            : "Tell consultants a little about your company."}
        </p>
      </div>
      <CompanyProfileForm
        mode="setup"
        submitLabel="Finish"
        onSaved={() => router.replace(ROUTES.consultants)}
      />
    </>
  );
}
