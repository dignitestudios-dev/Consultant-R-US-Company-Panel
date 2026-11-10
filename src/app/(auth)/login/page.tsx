"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/auth-fields";
import { GuestOnly } from "@/features/auth/components/auth-guard";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";
import { setSession } from "@/features/auth/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { errorMessage } from "@/lib/api/errors";
import { ROUTES } from "@/config/routes";

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}

function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      dispatch(setSession({ token, user }));
      router.replace(user?.isProfileCompleted ? ROUTES.consultants : ROUTES.setup);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Company log in</h2>
        <p className="text-sm text-muted-foreground">Welcome back. Sign in to find consultants.</p>
      </div>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-5">
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
          disabled={mutation.isPending}
          className="h-11 w-full text-sm font-bold"
        >
          {mutation.isPending && <Loader2 className="animate-spin" />} Log in
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
