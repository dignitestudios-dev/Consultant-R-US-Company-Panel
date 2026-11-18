import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  checkEmail,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signUp,
  verifyResetOtp,
} from "@/features/auth/api/auth.service";
import type { SignupFormData } from "@/features/auth/types/auth.types";
import { errorMessage } from "@/utils/api-error";

export const EMAIL_TAKEN = "EMAIL_TAKEN";

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (v: SignupFormData) => {
      if (await checkEmail(v.email.trim().toLowerCase())) throw new Error(EMAIL_TAKEN);
      return signUp(v);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: logout });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useVerifyOtpMutation(email: string) {
  return useMutation({
    mutationFn: (otp: string) => verifyResetOtp(email, otp),
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useResetPasswordMutation(token: string) {
  return useMutation({
    mutationFn: (newPassword: string) => resetPassword(newPassword, token),
    onError: (e) => toast.error(errorMessage(e)),
  });
}
