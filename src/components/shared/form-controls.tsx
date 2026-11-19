"use client";

import { useRef, useState } from "react";
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
import { Field } from "@/components/shared/auth-fields";
import { cn } from "@/utils/cn";

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  error,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} name={name} error={error} required={required}>
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
  validate,
}: {
  label: string;
  name: string;
  file: File | null;
  onChange: (f: File | null) => void;
  accept?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Checked as soon as a file is picked. Return a message to reject it. */
  validate?: (f: File) => string | null;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [pickError, setPickError] = useState<string | undefined>();
  const Icon = file?.type.startsWith("image/") ? ImageIcon : FileText;

  return (
    <Field label={label} name={name} error={pickError ?? error} required={required}>
      <Input
        ref={ref}
        id={name}
        type="file"
        accept={accept}
        className="hidden"
        tabIndex={-1}
        onChange={(e) => {
          const picked = e.target.files?.[0] ?? null;
          const problem = picked && validate ? validate(picked) : null;
          if (problem) {
            setPickError(problem);
            e.target.value = "";
            return;
          }
          setPickError(undefined);
          onChange(picked);
        }}
      />
      {file ? (
        <div className="flex min-w-0 items-center gap-3 overflow-hidden rounded-lg border bg-background/40 p-3">
          <span className="grid size-9 flex-none place-items-center rounded-md bg-gold-soft text-gold">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" title={file.name}>
              {file.name}
            </p>
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
              setPickError(undefined);
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
            (pickError ?? error) && "border-destructive",
          )}
        >
          <Upload className="size-5 text-gold" />
          <span className="text-sm font-semibold">Click to upload</span>
        </button>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Field>
  );
}
