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
import { MAX_FILE_MB } from "@/features/company/utils/company.utils";
import { useSaveCompany } from "@/features/company/hooks/use-save-company";
import type {
  CompanyFormData,
  CompanyProfileFormProps,
} from "@/features/company/types/company.types";
import { COMPANY_SIZES, INDUSTRIES } from "@/utils/constants";
import { webUrls } from "@/utils/company";
import { COUNTRY, US_STATES, citiesOf } from "@/utils/us-locations";

const tooBig = (f?: File | null) => !!f && f.size > MAX_FILE_MB * 1024 * 1024;

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
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: initial?.companyName ?? "",
      industryFocus: initial?.industryFocus ?? "",
      companySize: initial?.companySize ?? "",
      description: initial?.description ?? "",
      webUrls: webUrls(initial).join("\n"),
      country: COUNTRY,
      state: initial?.state ?? "",
      city: initial?.city ?? "",
    },
  });

  const mutation = useSaveCompany();
  const state = useWatch({ control, name: "state" });

  function submit(v: CompanyFormData) {
    const next: typeof fileErrors = {};
    if (tooBig(picture)) next.picture = `Picture must be under ${MAX_FILE_MB} MB.`;
    if (mode === "setup") {
      if (!licence) next.licence = "Upload your proof document.";
      else if (tooBig(licence)) next.licence = `File must be under ${MAX_FILE_MB} MB.`;
    }
    setFileErrors(next);
    if (Object.keys(next).length) return;
    mutation.mutate(
      { mode, values: v, files: { picture, licence, removePicture: false } },
      {
        onSuccess: (company) => {
          if (mode === "edit") toast.success("Company profile saved");
          onSaved({ ...company, isProfileCompleted: true });
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <Section title="Company" description="What your company does and how big it is.">
        {mode === "edit" && (
          <TextField
            label="Company name"
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
        <Field label="Website URL" name="webUrls" error={errors.webUrls?.message}>
          <Textarea
            id="webUrls"
            rows={2}
            placeholder="https://example.com"
            className="px-3.5 py-3 text-sm"
            {...register("webUrls")}
          />
          <p className="text-xs text-muted-foreground">One URL per line.</p>
        </Field>
        <Field label="Description" name="description" error={errors.description?.message}>
          <Textarea
            id="description"
            rows={4}
            maxLength={1000}
            placeholder="Describe your operations and the consultants you typically hire."
            className="px-3.5 py-3 text-sm leading-relaxed"
            {...register("description")}
          />
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
              accept="image/*"
              hint="PNG or JPG, optional"
              file={picture}
              onChange={setPicture}
              error={fileErrors.picture}
            />
            <FileUpload
              label="Proof document"
              name="Licence"
              required
              accept="image/*,application/pdf"
              hint="Business licence. PDF or image"
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
    </form>
  );
}
