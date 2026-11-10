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
import { checkEmail, signUp } from "@/features/auth/api";
import { signupSchema, type SignupValues } from "@/features/auth/schemas";
import { setSession } from "@/features/auth/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { errorMessage } from "@/lib/api/errors";
import { ROUTES } from "@/config/routes";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const mutation = useMutation({
    mutationFn: async (v: SignupValues) => {
      if (await checkEmail(v.email.trim().toLowerCase())) throw new Error("EMAIL_TAKEN");
      return signUp(v);
    },
    onSuccess: ({ token }) => {
      // New companies have no profile yet; the setup step fills it in.
      dispatch(setSession({ token, user: null }));
      router.replace(ROUTES.setup);
    },
    onError: (e) => {
      if (e instanceof Error && e.message === "EMAIL_TAKEN") {
        setError("email", { message: "Email already exists. Log in instead." });
        return;
      }
      toast.error(errorMessage(e));
    },
  });

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 1 of 2</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
      </div>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-5">
        <TextField
          label="Company name"
          placeholder="Company name"
          autoComplete="organization"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
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
          disabled={mutation.isPending}
          className="h-11 w-full text-sm font-bold"
        >
          {mutation.isPending && <Loader2 className="animate-spin" />} Next
        </Button>
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
