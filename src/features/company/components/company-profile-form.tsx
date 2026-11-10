"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, TextField } from "@/components/auth-fields";
import { FileUpload, SelectField } from "@/components/form-controls";
import { completeProfile, updateProfile } from "../api";
import { MAX_FILE_MB, companySchema, splitLines, type CompanyValues } from "../schemas";
import { COMPANY_SIZES, INDUSTRIES, webUrls, type Company } from "../types";
import { COMPANY_KEY } from "../hooks/use-company";
import { setUser } from "@/features/auth/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { errorMessage } from "@/lib/api/errors";

type Props = {
  mode: "setup" | "edit";
  initial?: Company | null;
  submitLabel: string;
  onSaved: (company: Company) => void;
};

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

export function CompanyProfileForm({ mode, initial, submitLabel, onSaved }: Props) {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  const [picture, setPicture] = useState<File | null>(null);
  const [licence, setLicence] = useState<File | null>(null);
  const [removePicture, setRemovePicture] = useState(false);
  const [fileErrors, setFileErrors] = useState<{ picture?: string; licence?: string }>({});

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: initial?.companyName ?? "",
      industryFocus: initial?.industryFocus ?? "",
      companySize: initial?.companySize ?? "",
      description: initial?.description ?? "",
      webUrls: webUrls(initial).join("\n"),
      country: initial?.country ?? "United States",
      state: initial?.state ?? "",
      city: initial?.city ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (v: CompanyValues) => {
      const fd = new FormData();
      fd.append("industryFocus", v.industryFocus);
      fd.append("companySize", v.companySize);
      fd.append("description", v.description?.trim() ?? "");
      fd.append("city", v.city);
      fd.append("state", v.state);
      fd.append("country", v.country);
      for (const url of splitLines(v.webUrls)) fd.append("webUrl", url);
      if (picture) fd.append("profilePicture", picture);

      if (mode === "setup") {
        if (licence) fd.append("Licence", licence);
        return completeProfile(fd);
      }
      if (v.companyName) fd.append("companyName", v.companyName);
      if (removePicture && !picture) fd.append("isProfileImageDeleted", "true");
      return updateProfile(fd);
    },
    onSuccess: (company) => {
      const next = { ...company, isProfileCompleted: true };
      dispatch(setUser(next));
      qc.invalidateQueries({ queryKey: COMPANY_KEY });
      if (mode === "edit") toast.success("Company profile saved");
      onSaved(next);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  function submit(v: CompanyValues) {
    const next: typeof fileErrors = {};
    if (tooBig(picture)) next.picture = `Picture must be under ${MAX_FILE_MB} MB.`;
    if (mode === "setup") {
      if (!licence) next.licence = "Upload your proof document.";
      else if (tooBig(licence)) next.licence = `File must be under ${MAX_FILE_MB} MB.`;
    }
    setFileErrors(next);
    if (Object.keys(next).length) return;
    mutation.mutate(v);
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

      <Section title="Location" description="Where your company is based.">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Country" error={errors.country?.message} {...register("country")} />
          <TextField
            label="State"
            placeholder="e.g. Texas"
            error={errors.state?.message}
            {...register("state")}
          />
          <TextField
            label="City"
            placeholder="e.g. Houston"
            error={errors.city?.message}
            {...register("city")}
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

      <Section
        title={mode === "setup" ? "Documents" : "Profile picture"}
        description={
          mode === "setup"
            ? "Your proof document is used to verify your company."
            : "Shown next to your company name."
        }
      >
        <div className={mode === "setup" ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
          <FileUpload
            label="Profile picture"
            name="profilePicture"
            accept="image/*"
            hint="PNG or JPG, optional"
            file={picture}
            onChange={setPicture}
            error={fileErrors.picture}
          />
          {mode === "setup" && (
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
          )}
        </div>
        {mode === "edit" && initial?.profilePicture && !picture && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="remove-picture"
              checked={removePicture}
              onCheckedChange={(c) => setRemovePicture(c === true)}
            />
            <Label htmlFor="remove-picture" className="font-normal text-muted-foreground">
              Remove current profile picture
            </Label>
          </div>
        )}
      </Section>

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
