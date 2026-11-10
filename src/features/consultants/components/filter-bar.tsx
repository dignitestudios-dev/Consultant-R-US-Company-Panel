"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AGE_OPTIONS, EXPERIENCE_OPTIONS, filterCount, type Filters } from "../filters";
import { CERTS, DEGREES, RESUME_TYPES } from "../types";
import { INDUSTRIES } from "@/features/company/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function Trigger({ label, count }: { label: string; count: number }) {
  return (
    <PopoverTrigger
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted",
        count > 0 && "border-gold",
      )}
    >
      {label}
      {count > 0 && (
        <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold leading-5 text-white">
          {count}
        </span>
      )}
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </PopoverTrigger>
  );
}

function Option({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors hover:bg-muted">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {children}
    </label>
  );
}

function SingleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Popover>
      <Trigger label={label} count={value ? 1 : 0} />
      <PopoverContent align="start" className="max-h-[340px] w-60 gap-0.5 overflow-y-auto p-1.5">
        {options.map((o) => (
          <Option
            key={o.value}
            checked={value === o.value}
            onChange={() => onChange(value === o.value ? "" : o.value)}
          >
            {o.label}
          </Option>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function MultiGroup<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: K; label: string }[];
  value: K[];
  onChange: (v: K[]) => void;
}) {
  return (
    <Popover>
      <Trigger label={label} count={value.length} />
      <PopoverContent align="start" className="max-h-[340px] w-64 gap-0.5 overflow-y-auto p-1.5">
        {options.map((o) => {
          const on = value.includes(o.key);
          return (
            <Option
              key={o.key}
              checked={on}
              onChange={() => onChange(on ? value.filter((k) => k !== o.key) : [...value, o.key])}
            >
              {o.label}
            </Option>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function FilterBar({
  query,
  onQuery,
  filters,
  onFilters,
  onClear,
}: {
  query: string;
  onQuery: (q: string) => void;
  filters: Filters;
  onFilters: (f: Filters) => void;
  onClear: () => void;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onFilters({ ...filters, [k]: v });
  const [loc, setLoc] = useState({ s: filters.preferredState, c: filters.preferredCity });
  const locCount = [filters.preferredState, filters.preferredCity].filter(Boolean).length;

  const chips: { id: string; label: string; remove: () => void }[] = [
    ...(filters.experience
      ? [
          {
            id: "exp",
            label: EXPERIENCE_OPTIONS.find((o) => o.value === filters.experience)?.label ?? "",
            remove: () => set("experience", ""),
          },
        ]
      : []),
    ...(filters.age
      ? [{ id: "age", label: `Age ${filters.age}`, remove: () => set("age", "") }]
      : []),
    ...(filters.education
      ? [
          {
            id: "edu",
            label: DEGREES.find((d) => d.key === filters.education)?.label ?? "",
            remove: () => set("education", ""),
          },
        ]
      : []),
    ...filters.certs.map((c) => ({
      id: c,
      label: CERTS.find((x) => x.key === c)?.label ?? c,
      remove: () =>
        set(
          "certs",
          filters.certs.filter((k) => k !== c),
        ),
    })),
    ...filters.resumes.map((r) => ({
      id: r,
      label: RESUME_TYPES.find((x) => x.key === r)?.label ?? r,
      remove: () =>
        set(
          "resumes",
          filters.resumes.filter((k) => k !== r),
        ),
    })),
    ...(filters.industry
      ? [{ id: "ind", label: filters.industry, remove: () => set("industry", "") }]
      : []),
    ...(filters.availability
      ? [
          {
            id: "av",
            label: `Available ${formatDate(filters.availability)}`,
            remove: () => set("availability", ""),
          },
        ]
      : []),
    ...(locCount
      ? [
          {
            id: "loc",
            label: [filters.preferredCity, filters.preferredState].filter(Boolean).join(", "),
            remove: () => {
              setLoc({ s: "", c: "" });
              onFilters({ ...filters, preferredState: "", preferredCity: "" });
            },
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search consultants by name"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by name"
            className="h-10 bg-card pl-9"
          />
        </div>

        <SingleGroup
          label="Experience"
          options={EXPERIENCE_OPTIONS}
          value={filters.experience}
          onChange={(v) => set("experience", v)}
        />
        <SingleGroup
          label="Age"
          options={AGE_OPTIONS.map((a) => ({ value: a, label: a.replace("-", "–") }))}
          value={filters.age}
          onChange={(v) => set("age", v)}
        />
        <SingleGroup
          label="Education"
          options={DEGREES.map((d) => ({ value: d.key, label: d.label }))}
          value={filters.education}
          onChange={(v) => set("education", v as Filters["education"])}
        />
        <MultiGroup
          label="Certifications"
          options={CERTS}
          value={filters.certs}
          onChange={(v) => set("certs", v)}
        />
        <MultiGroup
          label="Job specialty"
          options={RESUME_TYPES}
          value={filters.resumes}
          onChange={(v) => set("resumes", v)}
        />
        <SingleGroup
          label="Industry"
          options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
          value={filters.industry}
          onChange={(v) => set("industry", v)}
        />

        <Popover>
          <Trigger label="Availability" count={filters.availability ? 1 : 0} />
          <PopoverContent align="start" className="w-64 gap-3 p-3">
            <Label htmlFor="filter-availability">Available on</Label>
            <Input
              id="filter-availability"
              type="date"
              value={filters.availability}
              onChange={(e) => set("availability", e.target.value)}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <Trigger label="Location" count={locCount} />
          <PopoverContent align="start" className="w-64 gap-3 p-3">
            <p className="text-xs text-muted-foreground">Where the consultant prefers to work.</p>
            <div className="grid gap-1.5">
              <Label htmlFor="filter-state">State</Label>
              <Input
                id="filter-state"
                value={loc.s}
                onChange={(e) => setLoc({ ...loc, s: e.target.value })}
                placeholder="e.g. Texas"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="filter-city">City</Label>
              <Input
                id="filter-city"
                value={loc.c}
                onChange={(e) => setLoc({ ...loc, c: e.target.value })}
                placeholder="e.g. Midland"
              />
            </div>
            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={() => onFilters({ ...filters, preferredState: loc.s, preferredCity: loc.c })}
            >
              Apply
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {(chips.length > 0 || query) && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Remove filter ${c.label}`}
              onClick={c.remove}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/50 bg-gold-soft pl-3 pr-2 text-xs font-semibold transition-colors hover:border-gold"
            >
              {c.label}
              <X className="size-3.5" />
            </button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setLoc({ s: "", c: "" });
              onClear();
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

export { filterCount };
