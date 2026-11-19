"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/shared/auth-fields";
import { StepProgress } from "@/components/shared/step-progress";
import { ROUTES } from "@/config/routes";
import { LIMITS, signupSchema } from "@/features/auth/schemas/auth.schema";
import { useSignup } from "@/features/auth/hooks/use-signup";
import type { SignupFormData } from "@/features/auth/types/auth.types";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const { submit, isPending } = useSignup(() =>
    setError("email", { message: "Email already exists. Log in instead." }),
  );

  return (
    <>
      <div className="space-y-2">
        <StepProgress step={1} />
        <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
      </div>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
        <fieldset disabled={isPending} className="m-0 min-w-0 border-0 p-0 space-y-5">
          <TextField
            label="Company name"
            placeholder="Company name"
            autoComplete="organization"
            required
            maxLength={LIMITS.companyName}
            error={errors.fullName?.message}
            {...register("fullName")}
          />
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
          <PasswordField
            label="Password"
            placeholder="At least 8 characters"
            required
            showStrength
            autoComplete="new-password"
            maxLength={LIMITS.passwordMax}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            label="Confirm password"
            placeholder="Repeat password"
            required
            autoComplete="new-password"
            maxLength={LIMITS.passwordMax}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            variant="gold"
            disabled={isPending}
            className="h-11 w-full text-sm font-bold"
          >
            {isPending && <Loader2 className="animate-spin" />} Next
          </Button>
        </fieldset>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
