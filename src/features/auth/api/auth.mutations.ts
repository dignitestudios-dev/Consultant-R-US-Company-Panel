import { useGuardedMutation } from "@/lib/use-guarded-mutation";
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
  return useGuardedMutation({
    mutationFn: login,
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useSignupMutation() {
  return useGuardedMutation({
    mutationFn: async (v: SignupFormData) => {
      if (await checkEmail(v.email.trim().toLowerCase())) throw new Error(EMAIL_TAKEN);
      return signUp(v);
    },
  });
}

export function useLogoutMutation() {
  return useGuardedMutation({ mutationFn: logout });
}

export function useForgotPasswordMutation() {
  return useGuardedMutation({
    mutationFn: forgotPassword,
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useVerifyOtpMutation(email: string) {
  return useGuardedMutation({
    mutationFn: (otp: string) => verifyResetOtp(email, otp),
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useResetPasswordMutation(token: string) {
  return useGuardedMutation({
    mutationFn: (newPassword: string) => resetPassword(newPassword, token),
    onError: (e) => toast.error(errorMessage(e)),
  });
}
