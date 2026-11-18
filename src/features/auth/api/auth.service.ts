import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/config/endpoints";
import type { ApiResponse, Company } from "@/types/common";
import type { SignupFormData } from "@/features/auth/types/auth.types";

const E = ENDPOINTS.auth;

export async function checkEmail(email: string) {
  const { data: res } = await axiosInstance.post<ApiResponse<{ exists: boolean }>>(E.checkEmail, {
    email,
  });
  return res.data.exists;
}

export async function signUp(input: SignupFormData) {
  const { data: res } = await axiosInstance.post<
    ApiResponse<{ name: string; email: string; token: string }>
  >(E.signUp, {
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    confirmPassword: input.confirmPassword,
    role: "contractor",
  });
  return res.data;
}

export async function login(input: { email: string; password: string }) {
  const { data: res } = await axiosInstance.post<ApiResponse<{ user: Company; token: string }>>(
    E.login,
    {
      email: input.email.trim().toLowerCase(),
      password: input.password.trim(),
      role: "contractor",
    },
  );
  return res.data;
}

export async function logout() {
  await axiosInstance.post(E.logout);
}

export async function forgotPassword(email: string) {
  await axiosInstance.post(E.forgotPassword, {
    email: email.trim().toLowerCase(),
    role: "contractor",
  });
}

export async function verifyResetOtp(email: string, otp: string) {
  const { data: res } = await axiosInstance.post<ApiResponse<{ token: string }>>(E.verifyResetOtp, {
    email: email.trim().toLowerCase(),
    otp,
  });
  return res.data;
}

/** Uses the token returned by verifyResetOtp, not the stored session. */
export async function resetPassword(newPassword: string, token: string) {
  await axiosInstance.post(
    E.resetPassword,
    { newPassword },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}
