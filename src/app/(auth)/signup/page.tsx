"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/auth-fields";
import { actions } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "").trim();
    const email = String(d.get("email") ?? "").trim();
    const pw = String(d.get("password") ?? "");
    const next: Record<string, string> = {};
    if (!name) next.name = "Enter your company name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (pw.length < 8) next.password = "Use at least 8 characters.";
    if (String(d.get("confirm") ?? "") !== pw) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    actions.setCompany({ name });
    router.push("/setup");
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 1 of 2</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField label="Company name" name="name" placeholder="Company name" autoComplete="organization" error={errors.name} />
        <TextField label="Email" name="email" type="email" placeholder="you@company.com" autoComplete="email" error={errors.email} />
        <PasswordField label="Password" name="password" placeholder="At least 8 characters" autoComplete="new-password" error={errors.password} />
        <PasswordField label="Confirm password" name="confirm" placeholder="Repeat password" autoComplete="new-password" error={errors.confirm} />
        <Button type="submit" variant="gold" className="h-11 w-full text-sm font-bold">Next</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">Log in</Link>
      </p>
    </>
  );
}
