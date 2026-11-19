"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/shared/password-strength";
import { cn } from "@/utils/cn";

export function Field({
  label,
  name,
  error,
  required,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  /** Adds the red asterisk. Validation itself stays in the Zod schema. */
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5", className)}>
      <Label htmlFor={name}>
        {label}
        {required && (
          <span aria-hidden="true" className="-ml-0.5 text-destructive">
            *
          </span>
        )}
      </Label>
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
  required,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
} & Omit<React.ComponentProps<"input">, "required">) {
  return (
    <Field label={label} name={name} error={error} required={required}>
      <Input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-required={required}
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
  required,
  showStrength,
  onFocus,
  onBlur,
  onChange,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  /** Shows the strength meter while the field is focused (use on "new password" fields). */
  showStrength?: boolean;
} & Omit<React.ComponentProps<"input">, "required">) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Field label={label} name={name} error={error} required={required}>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={error ? `${name}-error` : undefined}
          className="h-11 pl-3.5 pr-11 text-sm"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
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
      {showStrength && focused && <PasswordStrength value={value} />}
    </Field>
  );
}
