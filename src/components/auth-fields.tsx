"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label, name, error, className, children,
}: {
  label: string; name: string; error?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label, name, error, ...props
}: { label: string; name: string; error?: string } & React.ComponentProps<"input">) {
  return (
    <Field label={label} name={name} error={error}>
      <Input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="h-11 px-3.5 text-sm"
        {...props}
      />
    </Field>
  );
}

export function PasswordField({
  label, name, error, ...props
}: { label: string; name: string; error?: string } & React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} name={name} error={error}>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className="h-11 pl-3.5 pr-11 text-sm"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </Field>
  );
}
