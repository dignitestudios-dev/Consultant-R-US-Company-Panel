"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/shared/auth-fields";
import { ROUTES } from "@/config/routes";
import {
  LIMITS,
  forgotEmailSchema,
  otpSchema,
  resetSchema,
} from "@/features/auth/schemas/auth.schema";
import {
  useForgotFlow,
  useResetPassword,
  useSendCode,
  useVerifyCode,
} from "@/features/auth/hooks/use-forgot-password";
import type {
  ForgotEmailFormData,
  OtpFormData,
  ResetFormData,
} from "@/features/auth/types/auth.types";

export function ForgotFlow() {
  const flow = useForgotFlow();
  const { step, email } = flow;

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {step === "email"
            ? "Forgot password"
            : step === "otp"
              ? "Verify your email"
              : "New password"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === "email" && "Enter your email and we'll send a verification code."}
          {step === "otp" && `Enter the 6-digit code we sent to ${email}.`}
          {step === "reset" && "Choose a new password for your account."}
        </p>
      </div>

      {step === "email" && <EmailStep onDone={flow.emailSent} />}
      {step === "otp" && <OtpStep email={email} onDone={flow.verified} />}
      {step === "reset" && <ResetStep token={flow.resetToken} />}

      <Link
        href={ROUTES.login}
        className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to log in
      </Link>
    </>
  );
}

function EmailStep({ onDone }: { onDone: (email: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotEmailFormData>({ resolver: zodResolver(forgotEmailSchema) });
  const { submit, isPending } = useSendCode(onDone);

  return (
    <form onSubmit={handleSubmit((v) => submit(v.email))} noValidate className="space-y-5">
      <fieldset disabled={isPending} className="m-0 min-w-0 border-0 p-0 space-y-5">
        <TextField
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          variant="gold"
          disabled={isPending}
          className="h-11 w-full text-sm font-bold"
        >
          {isPending && <Loader2 className="animate-spin" />} Send code
        </Button>
      </fieldset>
    </form>
  );
}

function OtpStep({ email, onDone }: { email: string; onDone: (token: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  const { left, isVerifying, isResending, verify, resend } = useVerifyCode(email, onDone);

  return (
    <form onSubmit={handleSubmit((v) => verify(v.otp))} noValidate className="space-y-5">
      <fieldset disabled={isVerifying} className="m-0 min-w-0 border-0 p-0 space-y-5">
        <TextField
          label="Verification code"
          inputMode="numeric"
          maxLength={6}
          required
          placeholder="123456"
          autoComplete="one-time-code"
          error={errors.otp?.message}
          {...register("otp")}
        />
        <Button
          type="submit"
          variant="gold"
          disabled={isVerifying}
          className="h-11 w-full text-sm font-bold"
        >
          {isVerifying && <Loader2 className="animate-spin" />} Verify
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {left > 0 ? (
            <>
              Code expires in {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
            </>
          ) : (
            <button
              type="button"
              onClick={resend}
              disabled={isResending}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              {isResending && <Loader2 className="size-3.5 animate-spin" />} Resend code
            </button>
          )}
        </p>
      </fieldset>
    </form>
  );
}

function ResetStep({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({ resolver: zodResolver(resetSchema) });
  const { submit, isPending } = useResetPassword(token);

  return (
    <form onSubmit={handleSubmit((v) => submit(v.newPassword))} noValidate className="space-y-5">
      <fieldset disabled={isPending} className="m-0 min-w-0 border-0 p-0 space-y-5">
        <PasswordField
          label="New password"
          placeholder="At least 8 characters"
          required
          showStrength
          maxLength={LIMITS.passwordMax}
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <PasswordField
          label="Confirm password"
          placeholder="Repeat password"
          required
          maxLength={LIMITS.passwordMax}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          variant="gold"
          disabled={isPending}
          className="h-11 w-full text-sm font-bold"
        >
          {isPending && <Loader2 className="animate-spin" />} Reset password
        </Button>
      </fieldset>
    </form>
  );
}
