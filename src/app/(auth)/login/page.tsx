"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/auth-fields";

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const email = String(d.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!String(d.get("password") ?? "")) next.password = "Enter your password.";
    setErrors(next);
    if (!Object.keys(next).length) router.push("/consultants");
  }

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Company log in</h2>
        <p className="text-sm text-muted-foreground">Welcome back. Sign in to find consultants.</p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField label="Email" name="email" type="email" placeholder="you@company.com" autoComplete="email" error={errors.email} />
        <PasswordField label="Password" name="password" placeholder="Your password" autoComplete="current-password" error={errors.password} />
        <div className="-mt-2 text-right">
          <Link href="/forgot" className="text-sm font-semibold text-foreground underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="gold" className="h-11 w-full text-sm font-bold">Log in</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-foreground underline-offset-4 hover:underline">Sign up</Link>
      </p>
    </>
  );
}
