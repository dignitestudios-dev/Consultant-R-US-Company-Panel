import type { SaveCompanyInput } from "@/features/company/types/company.types";

export const MAX_FILE_MB = 10;
const MAX_BYTES = MAX_FILE_MB * 1024 * 1024;

export const PICTURE_ACCEPT = "image/png,image/jpeg";
export const PROOF_ACCEPT = "application/pdf";
export const PICTURE_HINT = `PNG or JPG, up to ${MAX_FILE_MB} MB`;
export const PROOF_HINT = `PDF only, up to ${MAX_FILE_MB} MB`;

const extOf = (f: File) => f.name.split(".").pop()?.toLowerCase() ?? "";

/** Profile picture: PNG or JPG, under 10 MB. Returns an error message or null. */
export function validatePicture(f: File): string | null {
  const okType = f.type
    ? ["image/png", "image/jpeg"].includes(f.type)
    : ["png", "jpg", "jpeg"].includes(extOf(f));
  if (!okType) return "Picture must be a PNG or JPG.";
  if (f.size > MAX_BYTES) return `Picture must be under ${MAX_FILE_MB} MB.`;
  return null;
}

/** Proof document: PDF, under 10 MB. Returns an error message or null. */
export function validateProof(f: File): string | null {
  const okType = f.type ? f.type === "application/pdf" : extOf(f) === "pdf";
  if (!okType) return "Proof document must be a PDF.";
  if (f.size > MAX_BYTES) return `Proof document must be under ${MAX_FILE_MB} MB.`;
  return null;
}

export const LINK_LIMITS = { maxCount: 10, maxLength: 2048 } as const;
export const DESCRIPTION_MAX = 1000;

/** Trims links and drops empty rows. */
export const cleanLinks = (links?: string[]) => (links ?? []).map((s) => s.trim()).filter(Boolean);

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
  for (const url of cleanLinks(v.webUrls)) fd.append("webUrl", url);
  if (files.picture) fd.append("profilePicture", files.picture);

  if (mode === "setup") {
    if (files.licence) fd.append("Licence", files.licence);
  } else {
    if (v.companyName) fd.append("companyName", v.companyName);
    if (files.removePicture && !files.picture) fd.append("isProfileImageDeleted", "true");
  }
  return fd;
}
