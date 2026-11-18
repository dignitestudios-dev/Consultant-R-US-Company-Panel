"use client";

import { toast } from "sonner";
import { useSaveCompany } from "@/features/company/hooks/use-save-company";
import { MAX_FILE_MB } from "@/features/company/utils/company.utils";
import type { Company } from "@/types/common";
import { webUrls } from "@/utils/company";

/** Uploads a new profile picture (or removes it) keeping every other field as it is. */
export function useProfilePicture(company: Company) {
  const m = useSaveCompany();

  const save = (picture: File | null, removePicture: boolean) =>
    m.mutate(
      {
        mode: "edit",
        values: {
          companyName: company.companyName ?? "",
          industryFocus: company.industryFocus ?? "",
          companySize: company.companySize ?? "",
          description: company.description ?? "",
          webUrls: webUrls(company).join("\n"),
          country: company.country ?? "",
          state: company.state ?? "",
          city: company.city ?? "",
        },
        files: { picture, licence: null, removePicture },
      },
      {
        onSuccess: () =>
          toast.success(picture ? "Profile picture updated" : "Profile picture removed"),
      },
    );

  return {
    isPending: m.isPending,
    change: (file: File) => {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`Picture must be under ${MAX_FILE_MB} MB.`);
        return;
      }
      save(file, false);
    },
    remove: () => save(null, true),
  };
}
