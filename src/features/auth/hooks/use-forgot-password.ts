"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/features/auth/api/auth.mutations";
import { errorMessage } from "@/utils/api-error";

export const OTP_SECONDS = 120;

export type ForgotStep = "email" | "otp" | "reset";

/** Owns the three-step flow: email, code, new password. */
export function useForgotFlow() {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  return {
    step,
    email,
    resetToken,
    emailSent: (e: string) => {
      setEmail(e);
      setStep("otp");
    },
    verified: (t: string) => {
      setResetToken(t);
      setStep("reset");
    },
  };
}

export function useSendCode(onSent: (email: string) => void) {
  const m = useForgotPasswordMutation();
  return {
    isPending: m.isPending,
    submit: (email: string) =>
      m.mutate(email, { onSuccess: () => onSent(email.trim().toLowerCase()) }),
  };
}

export function useVerifyCode(email: string, onVerified: (token: string) => void) {
  const [left, setLeft] = useState(OTP_SECONDS);
  const verify = useVerifyOtpMutation(email);
  const resend = useForgotPasswordMutation();

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return {
    left,
    isVerifying: verify.isPending,
    isResending: resend.isPending,
    verify: (otp: string) => verify.mutate(otp, { onSuccess: ({ token }) => onVerified(token) }),
    resend: () =>
      resend.mutate(email, {
        onSuccess: () => {
          setLeft(OTP_SECONDS);
          toast.success("A new code was sent");
        },
        onError: (e) => toast.error(errorMessage(e)),
      }),
  };
}

export function useResetPassword(token: string) {
  const router = useRouter();
  const m = useResetPasswordMutation(token);
  return {
    isPending: m.isPending,
    submit: (newPassword: string) =>
      m.mutate(newPassword, {
        onSuccess: () => {
          toast.success("Password reset. Log in with your new password.");
          router.replace(ROUTES.login);
        },
      }),
  };
}
