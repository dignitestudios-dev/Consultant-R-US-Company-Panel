"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/auth-fields";

export default function ForgotPage() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Forgot password</h2>
        <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send a verification code.</p>
      </div>
      {sent ? (
        <div role="status" className="space-y-2 rounded-xl border border-gold/40 bg-gold-soft p-5 animate-in fade-in zoom-in-95">
          <MailCheck className="size-6 text-gold" />
          <p className="font-semibold">Check your inbox</p>
          <p className="text-sm text-muted-foreground">
            Code sending isn&apos;t active in this prototype, so no email was sent.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <TextField label="Email" name="email" type="email" placeholder="you@company.com" autoComplete="email" error={error} />
          <Button type="submit" variant="gold" className="h-11 w-full text-sm font-bold">Send code</Button>
        </form>
      )}
      <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline">
        <ArrowLeft className="size-4" /> Back to log in
      </Link>
    </>
  );
}
