import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/config/endpoints";
import type { Company } from "@/features/company/types";

const E = ENDPOINTS.auth;

export const checkEmail = async (email: string) =>
  (await api.post<{ exists: boolean }>(E.checkEmail, { email })).data.exists;

export type SignUpInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const signUp = async (input: SignUpInput) =>
  (
    await api.post<{ name: string; email: string; token: string }>(E.signUp, {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      confirmPassword: input.confirmPassword,
      role: "contractor",
    })
  ).data;

export const login = async (input: { email: string; password: string }) =>
  (
    await api.post<{ user: Company; token: string }>(E.login, {
      email: input.email.trim().toLowerCase(),
      password: input.password.trim(),
      role: "contractor",
    })
  ).data;

export const logout = () => api.post(E.logout);

export const forgotPassword = (email: string) =>
  api.post(E.forgotPassword, { email: email.trim().toLowerCase(), role: "contractor" });

export const verifyResetOtp = async (email: string, otp: string) =>
  (
    await api.post<{ token: string }>(E.verifyResetOtp, {
      email: email.trim().toLowerCase(),
      otp,
    })
  ).data;

/** Uses the token returned by verifyResetOtp, not the stored session. */
export const resetPassword = (newPassword: string, token: string) =>
  api.post(E.resetPassword, { newPassword }, { headers: { Authorization: `Bearer ${token}` } });

export const changePassword = (input: { currentPassword: string; newPassword: string }) =>
  api.post(E.changePassword, input);

export const deleteAccount = (password: string) => api.post(E.deleteAccount, { password });
