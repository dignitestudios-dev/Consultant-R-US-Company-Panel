import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/config/endpoints";
import type { Company } from "../types";

const E = ENDPOINTS.company;

export class ProfileIncompleteError extends Error {
  constructor() {
    super("Contractor profile is not completed");
    this.name = "ProfileIncompleteError";
  }
}

export async function getProfile(): Promise<Company> {
  try {
    const res = await api.get<{ company: Company }>(E.getProfile);
    // get-profile only succeeds for completed profiles, but its flags aren't reliable.
    return { ...res.data.company, isProfileCompleted: true };
  } catch (e) {
    if (e instanceof Error && /profile is not completed/i.test(e.message)) {
      throw new ProfileIncompleteError();
    }
    throw e;
  }
}

export const completeProfile = async (form: FormData) =>
  (await api.post<{ company: Company }>(E.completeProfile, form)).data.company;

export const updateProfile = async (form: FormData) =>
  (await api.post<{ company: Company }>(E.updateProfile, form)).data.company;

export type DirectoryCompany = {
  _id: string;
  companyName: string | null;
  profilePicture?: string | null;
};

export const getAllCompanies = async () =>
  (await api.get<DirectoryCompany[]>(E.allCompanies)).data ?? [];
