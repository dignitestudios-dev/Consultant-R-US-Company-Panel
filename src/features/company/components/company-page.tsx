"use client";

import { useState } from "react";
import { Eye, FileCheck2, KeyRound, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyProfileForm } from "@/features/company/components/company-profile-form";
import { useCompany } from "@/features/company/hooks/use-company";
import { companyDisplayName } from "@/features/company/utils/company.utils";
import {
  ChangePasswordDialog,
  DeleteAccountDialog,
} from "@/features/company/components/account-dialogs";
import { DocumentViewer } from "@/components/shared/document-viewer";
import { ProfilePictureEditor } from "@/features/company/components/profile-picture-editor";
import { PRIVACY_URL, TERMS_URL } from "@/config/routes";

export function CompanyPage() {
  const { data: company, isPending } = useCompany();
  const [pwOpen, setPwOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);

  if (isPending || !company) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[520px] w-full rounded-xl" />
      </div>
    );
  }

  const name = companyDisplayName(company.companyName);
  const place = [company.city, company.state].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Company profile</h1>
        <p className="text-sm text-muted-foreground">Updates here also appear in the mobile app.</p>
      </div>

      <Card>
        <CardHeader className="items-center gap-5 text-center">
          <ProfilePictureEditor company={company} name={name} />
          <div className="min-w-0 space-y-1">
            <CardTitle className="truncate text-xl font-bold" title={name}>
              {name}
            </CardTitle>
            <CardDescription>
              {[company.industryFocus, place].filter(Boolean).join(" · ") || company.email}
            </CardDescription>
          </div>
          {company.status && (
            <Badge variant="secondary" className="capitalize">
              {company.status === "pending" ? "Pending verification" : company.status}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {company.licence && (
            <button
              type="button"
              onClick={() => setProofOpen(true)}
              className="flex w-full items-center gap-3 rounded-[10px] border bg-background/40 p-3 text-left text-sm font-semibold transition-colors hover:border-gold/40"
            >
              <FileCheck2 className="size-5 text-gold" />
              <span className="flex-1">Proof document</span>
              <Eye className="size-4 text-muted-foreground" />
            </button>
          )}
          <CompanyProfileForm
            key={company.companyName + (company.description ?? "")}
            mode="edit"
            initial={company}
            submitLabel="Save changes"
            onSaved={() => undefined}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Account</CardTitle>
          <CardDescription>{company.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setPwOpen(true)}>
            <KeyRound /> Change password
          </Button>
          <Button type="button" variant="destructive" onClick={() => setDelOpen(true)}>
            <Trash2 /> Delete account
          </Button>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </CardContent>
      </Card>

      <DocumentViewer
        url={proofOpen ? company.licence : null}
        title="Proof document"
        onClose={() => setProofOpen(false)}
      />
      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
      <DeleteAccountDialog open={delOpen} onOpenChange={setDelOpen} />
    </div>
  );
}
