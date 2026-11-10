"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  error,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
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
  label,
  name,
  error,
  ...props
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
  label,
  name,
  error,
  ...props
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

const controlClass =
  "h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive disabled:opacity-50 dark:bg-input/30";

export function SelectField({
  label,
  name,
  error,
  options,
  placeholder,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  options: string[];
  placeholder?: string;
} & React.ComponentProps<"select">) {
  return (
    <Field label={label} name={name} error={error}>
      <select
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={controlClass}
        {...props}
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-card">
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function FileField({
  label,
  name,
  error,
  hint,
  ...props
}: { label: string; name: string; error?: string; hint?: string } & React.ComponentProps<"input">) {
  return (
    <Field label={label} name={name} error={error}>
      <input
        id={name}
        name={name}
        type="file"
        aria-invalid={!!error}
        className={cn(
          controlClass,
          "h-auto cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground",
        )}
        {...props}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Field>
  );
}
