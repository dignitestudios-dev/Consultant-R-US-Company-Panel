import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/config/endpoints";
import type { ApiResponse, Company } from "@/types/common";
import type { DirectoryCompany } from "@/features/company/types/company.types";

const E = ENDPOINTS.company;
const A = ENDPOINTS.auth;

export class ProfileIncompleteError extends Error {
  constructor() {
    super("Contractor profile is not completed");
    this.name = "ProfileIncompleteError";
  }
}

export async function getProfile(): Promise<Company> {
  try {
    const { data: res } = await axiosInstance.get<ApiResponse<{ company: Company }>>(E.getProfile);
    // get-profile only succeeds for completed profiles, but its flags are not reliable.
    return { ...res.data.company, isProfileCompleted: true };
  } catch (e) {
    if (e instanceof Error && /profile is not completed/i.test(e.message)) {
      throw new ProfileIncompleteError();
    }
    throw e;
  }
}

export async function completeProfile(form: FormData): Promise<Company> {
  const { data: res } = await axiosInstance.post<ApiResponse<{ company: Company }>>(
    E.completeProfile,
    form,
  );
  return res.data.company;
}

export async function updateProfile(form: FormData): Promise<Company> {
  const { data: res } = await axiosInstance.post<ApiResponse<{ company: Company }>>(
    E.updateProfile,
    form,
  );
  return res.data.company;
}

export async function getAllCompanies(): Promise<DirectoryCompany[]> {
  const { data: res } = await axiosInstance.get<ApiResponse<DirectoryCompany[]>>(E.allCompanies);
  return res.data ?? [];
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  await axiosInstance.post(A.changePassword, input);
}

export async function deleteAccount(password: string) {
  await axiosInstance.post(A.deleteAccount, { password });
}
