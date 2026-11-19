"use client";

import { toast } from "sonner";
import { useSaveCompany } from "@/features/company/hooks/use-save-company";
import { validatePicture } from "@/features/company/utils/company.utils";
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
          webUrls: webUrls(company),
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
      const problem = validatePicture(file);
      if (problem) {
        toast.error(problem);
        return;
      }
      save(file, false);
    },
    remove: () => save(null, true),
  };
}
