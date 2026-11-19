"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, TextField } from "@/components/shared/auth-fields";
import { FileUpload, SelectField } from "@/components/shared/form-controls";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { companySchema } from "@/features/company/schemas/company.schema";
import { LinksField } from "@/features/company/components/links-field";
import {
  DESCRIPTION_MAX,
  PICTURE_ACCEPT,
  PICTURE_HINT,
  PROOF_ACCEPT,
  PROOF_HINT,
  validatePicture,
  validateProof,
} from "@/features/company/utils/company.utils";
import { useSaveCompany } from "@/features/company/hooks/use-save-company";
import type {
  CompanyFormData,
  CompanyProfileFormProps,
} from "@/features/company/types/company.types";
import { COMPANY_SIZES, INDUSTRIES } from "@/utils/constants";
import { LIMITS } from "@/utils/validation";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { webUrls } from "@/utils/company";
import { COUNTRY, US_STATES, citiesOf } from "@/utils/us-locations";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border bg-card/60 p-5">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function CompanyProfileForm({
  mode,
  initial,
  submitLabel,
  onSaved,
}: CompanyProfileFormProps) {
  const [picture, setPicture] = useState<File | null>(null);
  const [licence, setLicence] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ picture?: string; licence?: string }>({});

  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: initial?.companyName ?? "",
      industryFocus: initial?.industryFocus ?? "",
      companySize: initial?.companySize ?? "",
      description: initial?.description ?? "",
      webUrls: webUrls(initial),
      country: COUNTRY,
      state: initial?.state ?? "",
      city: initial?.city ?? "",
    },
  });

  const mutation = useSaveCompany();
  useUnsavedChanges(isDirty || !!picture || !!licence);
  const state = useWatch({ control, name: "state" });
  const description = useWatch({ control, name: "description" }) ?? "";
  const linkErrors = Array.isArray(errors.webUrls) ? errors.webUrls.map((e) => e?.message) : [];

  function submit(v: CompanyFormData) {
    const next: typeof fileErrors = {};
    if (picture) next.picture = validatePicture(picture) ?? undefined;
    if (mode === "setup") {
      if (!licence) next.licence = "Upload your proof document.";
      else next.licence = validateProof(licence) ?? undefined;
    }
    setFileErrors(next);
    if (Object.keys(next).length) return;
    mutation.mutate(
      { mode, values: v, files: { picture, licence, removePicture: false } },
      {
        onSuccess: (company) => {
          if (mode === "edit") {
            toast.success("Company profile saved");
            reset(v);
          }
          onSaved({ ...company, isProfileCompleted: true });
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <fieldset disabled={mutation.isPending} className="m-0 min-w-0 border-0 p-0 space-y-5">
        <Section title="Company" description="What your company does and how big it is.">
          {mode === "edit" && (
            <TextField
              label="Company name"
              required
              maxLength={LIMITS.companyName}
              error={errors.companyName?.message}
              {...register("companyName")}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="industryFocus"
              render={({ field }) => (
                <SelectField
                  label="Industry focus"
                  required
                  name="industryFocus"
                  placeholder="Select industry"
                  options={INDUSTRIES}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.industryFocus?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="companySize"
              render={({ field }) => (
                <SelectField
                  label="Company size"
                  required
                  name="companySize"
                  placeholder="Select size"
                  options={COMPANY_SIZES}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.companySize?.message}
                />
              )}
            />
          </div>
        </Section>

        <Section title="Location" description="Where your company is based in the United States.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <SearchableSelect
                  label="State"
                  required
                  name="state"
                  placeholder="Select state"
                  searchPlaceholder="Search states"
                  options={US_STATES}
                  value={field.value}
                  onChange={(v) => {
                    if (v !== field.value) setValue("city", "", { shouldValidate: false });
                    field.onChange(v);
                  }}
                  error={errors.state?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <SearchableSelect
                  label="City"
                  required
                  name="city"
                  placeholder={state ? "Select city" : "Select a state first"}
                  searchPlaceholder="Search cities"
                  options={citiesOf(state)}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!state}
                  error={errors.city?.message}
                />
              )}
            />
          </div>
        </Section>

        <Section title="About" description="Optional, but it helps consultants know who you are.">
          <Controller
            control={control}
            name="webUrls"
            render={({ field }) => (
              <LinksField value={field.value ?? []} onChange={field.onChange} errors={linkErrors} />
            )}
          />
          <Field label="Description" name="description" error={errors.description?.message}>
            <Textarea
              id="description"
              rows={4}
              maxLength={DESCRIPTION_MAX}
              placeholder="Describe your operations and the consultants you typically hire."
              className="px-3.5 py-3 text-sm leading-relaxed"
              {...register("description")}
            />
            <p
              className={`text-right text-xs ${description.length >= DESCRIPTION_MAX ? "font-semibold text-destructive" : "text-muted-foreground"}`}
              aria-live="polite"
            >
              {description.length.toLocaleString("en-US")}/{DESCRIPTION_MAX.toLocaleString("en-US")}
            </p>
          </Field>
        </Section>

        {mode === "setup" && (
          <Section
            title="Documents"
            description="Your proof document is used to verify your company."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUpload
                label="Profile picture"
                name="profilePicture"
                accept={PICTURE_ACCEPT}
                hint={`${PICTURE_HINT}. Optional.`}
                validate={validatePicture}
                file={picture}
                onChange={setPicture}
                error={fileErrors.picture}
              />
              <FileUpload
                label="Proof document"
                name="Licence"
                required
                accept={PROOF_ACCEPT}
                hint={PROOF_HINT}
                validate={validateProof}
                file={licence}
                onChange={setLicence}
                error={fileErrors.licence}
              />
            </div>
          </Section>
        )}

        <Button
          type="submit"
          variant="gold"
          disabled={mutation.isPending}
          className="h-11 w-full text-sm font-bold"
        >
          {mutation.isPending && <Loader2 className="animate-spin" />} {submitLabel}
        </Button>
      </fieldset>
    </form>
  );
}
