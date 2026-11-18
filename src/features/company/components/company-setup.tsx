"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyProfileForm } from "@/features/company/components/company-profile-form";
import { FullScreenLoader } from "@/components/shared/auth-guard";
import { StepProgress } from "@/components/shared/step-progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useClearSession } from "@/hooks/use-clear-session";
import { ROUTES } from "@/config/routes";

export function CompanySetup() {
  const router = useRouter();
  const cancel = useClearSession();
  const { hydrated, isAuthed, user } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace(ROUTES.login);
  }, [hydrated, isAuthed, router]);

  if (!hydrated || !isAuthed) return <FullScreenLoader />;

  return (
    <>
      <div className="space-y-2">
        <StepProgress step={2} />
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
      <Button type="button" variant="ghost" className="h-10 w-full" onClick={cancel}>
        Cancel and go back to log in
      </Button>
    </>
  );
}
