import type { Company } from "@/types/common";

export interface CompanyFormData {
  companyName?: string;
  industryFocus: string;
  companySize: string;
  description?: string;
  /** Related links, one per entry. */
  webUrls: string[];
  country: string;
  state: string;
  city: string;
}

/** Files that go with the profile form (they are not part of the validated values). */
export interface CompanyFiles {
  picture: File | null;
  licence: File | null;
  removePicture: boolean;
}

export interface SaveCompanyInput {
  mode: "setup" | "edit";
  values: CompanyFormData;
  files: CompanyFiles;
}

export interface DirectoryCompany {
  _id: string;
  companyName: string | null;
  profilePicture?: string | null;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountFormData {
  password: string;
}

export interface CompanyProfileFormProps {
  mode: "setup" | "edit";
  initial?: Company | null;
  submitLabel: string;
  onSaved: (company: Company) => void;
}
