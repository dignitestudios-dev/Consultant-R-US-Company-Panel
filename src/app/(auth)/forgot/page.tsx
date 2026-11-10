"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/auth-fields";
import { forgotPassword, resetPassword, verifyResetOtp } from "@/features/auth/api";
import { forgotEmailSchema, otpSchema, resetSchema } from "@/features/auth/schemas";
import { errorMessage } from "@/lib/api/errors";
import { ROUTES } from "@/config/routes";

const OTP_SECONDS = 120;

export default function ForgotPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

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

      {step === "email" && (
        <EmailStep
          onDone={(e) => {
            setEmail(e);
            setStep("otp");
          }}
        />
      )}
      {step === "otp" && (
        <OtpStep
          email={email}
          onDone={(t) => {
            setResetToken(t);
            setStep("reset");
          }}
        />
      )}
      {step === "reset" && <ResetStep token={resetToken} />}

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
  } = useForm({ resolver: zodResolver(forgotEmailSchema) });
  const m = useMutation({
    mutationFn: (v: { email: string }) => forgotPassword(v.email),
    onSuccess: (_, v) => onDone(v.email.trim().toLowerCase()),
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <form onSubmit={handleSubmit((v) => m.mutate(v))} noValidate className="space-y-5">
      <TextField
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button
        type="submit"
        variant="gold"
        disabled={m.isPending}
        className="h-11 w-full text-sm font-bold"
      >
        {m.isPending && <Loader2 className="animate-spin" />} Send code
      </Button>
    </form>
  );
}

function OtpStep({ email, onDone }: { email: string; onDone: (token: string) => void }) {
  const [left, setLeft] = useState(OTP_SECONDS);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(otpSchema) });

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const verify = useMutation({
    mutationFn: (v: { otp: string }) => verifyResetOtp(email, v.otp),
    onSuccess: ({ token }) => onDone(token),
    onError: (e) => toast.error(errorMessage(e)),
  });
  const resend = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      setLeft(OTP_SECONDS);
      toast.success("A new code was sent");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <form onSubmit={handleSubmit((v) => verify.mutate(v))} noValidate className="space-y-5">
      <TextField
        label="Verification code"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        autoComplete="one-time-code"
        error={errors.otp?.message}
        {...register("otp")}
      />
      <Button
        type="submit"
        variant="gold"
        disabled={verify.isPending}
        className="h-11 w-full text-sm font-bold"
      >
        {verify.isPending && <Loader2 className="animate-spin" />} Verify
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {left > 0 ? (
          <>
            Code expires in {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
          </>
        ) : (
          <button
            type="button"
            onClick={() => resend.mutate()}
            disabled={resend.isPending}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Resend code
          </button>
        )}
      </p>
    </form>
  );
}

function ResetStep({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetSchema) });
  const m = useMutation({
    mutationFn: (v: { newPassword: string }) => resetPassword(v.newPassword, token),
    onSuccess: () => {
      toast.success("Password reset. Log in with your new password.");
      router.replace(ROUTES.login);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <form onSubmit={handleSubmit((v) => m.mutate(v))} noValidate className="space-y-5">
      <PasswordField
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <PasswordField
        label="Confirm password"
        placeholder="Repeat password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button
        type="submit"
        variant="gold"
        disabled={m.isPending}
        className="h-11 w-full text-sm font-bold"
      >
        {m.isPending && <Loader2 className="animate-spin" />} Reset password
      </Button>
    </form>
  );
}
