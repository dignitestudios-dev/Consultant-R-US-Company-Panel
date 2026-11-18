"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/shared/auth-fields";
import { ROUTES } from "@/config/routes";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import type { LoginFormData } from "@/features/auth/types/auth.types";

export function LoginForm() {
  const { submit, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Company log in</h2>
        <p className="text-sm text-muted-foreground">Welcome back. Sign in to find consultants.</p>
      </div>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
        <TextField
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="-mt-2 text-right">
          <Link
            href={ROUTES.forgot}
            className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          variant="gold"
          disabled={isPending}
          className="h-11 w-full text-sm font-bold"
        >
          {isPending && <Loader2 className="animate-spin" />} Log in
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.signup}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
