import type { SaveCompanyInput } from "@/features/company/types/company.types";

export const MAX_FILE_MB = 10;

export function splitLines(v?: string) {
  return (v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const companyDisplayName = (name?: string | null) => name?.trim() || "Your company";

/** Builds the multipart body the complete-profile / update-profile endpoints expect. */
export function buildCompanyFormData({ mode, values: v, files }: SaveCompanyInput) {
  const fd = new FormData();
  fd.append("industryFocus", v.industryFocus);
  fd.append("companySize", v.companySize);
  fd.append("description", v.description?.trim() ?? "");
  fd.append("city", v.city);
  fd.append("state", v.state);
  fd.append("country", v.country);
  for (const url of splitLines(v.webUrls)) fd.append("webUrl", url);
  if (files.picture) fd.append("profilePicture", files.picture);

  if (mode === "setup") {
    if (files.licence) fd.append("Licence", files.licence);
  } else {
    if (v.companyName) fd.append("companyName", v.companyName);
    if (files.removePicture && !files.picture) fd.append("isProfileImageDeleted", "true");
  }
  return fd;
}
