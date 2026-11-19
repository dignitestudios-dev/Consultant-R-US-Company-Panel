"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field } from "@/components/shared/auth-fields";
import { cn } from "@/utils/cn";

const MAX_SHOWN = 120;

interface SearchableSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

/** Select with a search box. Opens below the field. */
export function SearchableSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  searchPlaceholder = "Search",
  disabled,
  error,
  required,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // A saved value that is not in the list (older profiles) still shows as selected.
  const all = value && !options.includes(value) ? [value, ...options] : options;
  const q = query.trim().toLowerCase();
  const matches = q ? all.filter((o) => o.toLowerCase().includes(q)) : all;
  const shown = matches.slice(0, MAX_SHOWN);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <Field label={label} name={name} error={error} required={required}>
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
      >
        <PopoverTrigger
          id={name}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3.5 text-left text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30",
            !value && "text-muted-foreground",
          )}
        >
          <span className="min-w-0 truncate">{value || placeholder}</span>
          <ChevronDown className="size-4 flex-none text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="w-(--anchor-width) min-w-56 gap-0 p-0"
        >
          <div className="relative border-b p-2">
            <Search className="pointer-events-none absolute top-1/2 left-4.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (shown[0]) pick(shown[0]);
                }
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 pl-8 text-sm"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
            {shown.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results</li>
            ) : (
              shown.map((o) => (
                <li key={o} role="option" aria-selected={o === value}>
                  <button
                    type="button"
                    onClick={() => pick(o)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                  >
                    <span className="truncate">{o}</span>
                    {o === value && <Check className="size-4 flex-none text-gold" />}
                  </button>
                </li>
              ))
            )}
            {matches.length > MAX_SHOWN && (
              <li className="px-3 py-2 text-center text-xs text-muted-foreground">
                Keep typing to narrow {matches.length - MAX_SHOWN} more results
              </li>
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
