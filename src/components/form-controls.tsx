"use client";

import { useRef } from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/auth-fields";
import { cn } from "@/lib/utils";

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <Field label={label} name={name} error={error}>
      <Select value={value || null} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger id={name} aria-invalid={!!error} className="h-11 w-full px-3.5 text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

/** Upload tile built from shadcn Button + Input. Shows the chosen file with a remove button. */
export function FileUpload({
  label,
  name,
  file,
  onChange,
  accept,
  hint,
  error,
  required,
}: {
  label: string;
  name: string;
  file: File | null;
  onChange: (f: File | null) => void;
  accept?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const Icon = file?.type.startsWith("image/") ? ImageIcon : FileText;

  return (
    <Field label={`${label}${required ? " *" : ""}`} name={name} error={error}>
      <Input
        ref={ref}
        id={name}
        type="file"
        accept={accept}
        className="hidden"
        tabIndex={-1}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border bg-background/40 p-3">
          <span className="grid size-9 flex-none place-items-center rounded-md bg-gold-soft text-gold">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${label}`}
            onClick={() => {
              if (ref.current) ref.current.value = "";
              onChange(null);
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          aria-invalid={!!error}
          className={cn(
            "flex w-full flex-col items-center gap-1.5 rounded-lg border border-dashed border-input px-4 py-5 text-center transition-colors hover:border-gold/60 hover:bg-gold-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            error && "border-destructive",
          )}
        >
          <Upload className="size-5 text-gold" />
          <span className="text-sm font-semibold">Click to upload</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </button>
      )}
    </Field>
  );
}
