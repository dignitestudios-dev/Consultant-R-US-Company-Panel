"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/auth-fields";
import { LINK_LIMITS } from "@/features/company/utils/company.utils";

interface LinksFieldProps {
  value: string[];
  onChange: (links: string[]) => void;
  /** One message per row (same index as `value`). */
  errors?: (string | undefined)[];
}

/** Related links: one input per link, with an add button (max 10). */
export function LinksField({ value, onChange, errors = [] }: LinksFieldProps) {
  const rows = value.length > 0 ? value : [""];
  const atMax = rows.length >= LINK_LIMITS.maxCount;
  const set = (i: number, v: string) => onChange(rows.map((r, idx) => (idx === i ? v : r)));
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <Field label="Related links" name="webUrls-0">
      <p className="-mt-0.5 text-xs text-muted-foreground">
        Website or social pages. Up to {LINK_LIMITS.maxCount} links.
      </p>
      <ul className="space-y-2">
        {rows.map((link, i) => (
          <li key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                id={`webUrls-${i}`}
                type="url"
                inputMode="url"
                value={link}
                maxLength={LINK_LIMITS.maxLength}
                placeholder="https://example.com"
                aria-label={`Link ${i + 1}`}
                aria-invalid={!!errors[i]}
                className="h-11 min-w-0 flex-1 px-3.5 text-sm"
                onChange={(e) => set(i, e.target.value)}
              />
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label={`Remove link ${i + 1}`}
                  onClick={() => remove(i)}
                >
                  <X />
                </Button>
              )}
            </div>
            {errors[i] && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors[i]}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={atMax}
          onClick={() => onChange([...rows, ""])}
        >
          <Plus /> Add link
        </Button>
        <span className="text-xs text-muted-foreground">
          {rows.length}/{LINK_LIMITS.maxCount}
        </span>
      </div>
    </Field>
  );
}
