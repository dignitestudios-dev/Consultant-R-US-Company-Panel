"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FileField, SelectField, TextField } from "@/components/auth-fields";
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

export function CompanyProfileForm({ mode, initial, submitLabel, onSaved }: Props) {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  const [picture, setPicture] = useState<File | null>(null);
  const [licence, setLicence] = useState<File | null>(null);
  const [removePicture, setRemovePicture] = useState(false);
  const [fileErrors, setFileErrors] = useState<{ picture?: string; licence?: string }>({});

  const {
    register,
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
      {mode === "edit" && (
        <TextField
          label="Company name"
          error={errors.companyName?.message}
          {...register("companyName")}
        />
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Industry focus"
          placeholder="Select industry"
          options={INDUSTRIES}
          error={errors.industryFocus?.message}
          {...register("industryFocus")}
        />
        <SelectField
          label="Company size"
          placeholder="Select size"
          options={COMPANY_SIZES}
          error={errors.companySize?.message}
          {...register("companySize")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Country" error={errors.country?.message} {...register("country")} />
        <TextField label="State" error={errors.state?.message} {...register("state")} />
        <TextField label="City" error={errors.city?.message} {...register("city")} />
      </div>
      <Field label="Website URL (optional)" name="webUrls" error={errors.webUrls?.message}>
        <Textarea
          id="webUrls"
          rows={2}
          placeholder="https://example.com"
          className="px-3.5 py-3 text-sm"
          {...register("webUrls")}
        />
        <p className="text-xs text-muted-foreground">One URL per line.</p>
      </Field>
      <Field label="Description (optional)" name="description" error={errors.description?.message}>
        <Textarea
          id="description"
          rows={5}
          maxLength={1000}
          placeholder="Describe your operations and the consultants you typically hire."
          className="px-3.5 py-3 text-sm leading-relaxed"
          {...register("description")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <FileField
          label="Profile picture (optional)"
          name="profilePicture"
          accept="image/*"
          error={fileErrors.picture}
          onChange={(e) => setPicture(e.target.files?.[0] ?? null)}
        />
        {mode === "setup" && (
          <FileField
            label="Proof document *"
            name="Licence"
            accept="image/*,application/pdf"
            hint="Business licence or similar. PDF or image."
            error={fileErrors.licence}
            onChange={(e) => setLicence(e.target.files?.[0] ?? null)}
          />
        )}
      </div>

      {mode === "edit" && initial?.profilePicture && !picture && (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={removePicture}
            onChange={(e) => setRemovePicture(e.target.checked)}
            className="size-4 accent-[#a9742a]"
          />
          Remove current profile picture
        </label>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="gold"
          disabled={mutation.isPending}
          className="h-11 min-w-40 font-bold"
        >
          {mutation.isPending && <Loader2 className="animate-spin" />} {submitLabel}
        </Button>
      </div>
    </form>
  );
}
