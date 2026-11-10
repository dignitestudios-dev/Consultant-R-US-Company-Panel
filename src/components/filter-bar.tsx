"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FILTER_GROUPS, type FilterKey, type Filters } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FilterBar({
  query, onQuery, filters, onFilters, onClear,
}: {
  query: string;
  onQuery: (q: string) => void;
  filters: Filters;
  onFilters: (f: Filters) => void;
  onClear: () => void;
}) {
  const set = (key: FilterKey, next: string[]) => onFilters({ ...filters, [key]: next });
  const active = FILTER_GROUPS.flatMap((g) => filters[g.key].map((label) => ({ key: g.key, label })));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search consultants"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search name, role, skill, location"
            className="h-10 bg-card pl-9"
          />
        </div>
        {FILTER_GROUPS.map((g) => {
          const picked = filters[g.key];
          return (
            <Popover key={g.key}>
              <PopoverTrigger
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted",
                  picked.length > 0 && "border-gold",
                )}
              >
                {g.label}
                {picked.length > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold leading-5 text-white">
                    {picked.length}
                  </span>
                )}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent align="start" className="max-h-[340px] w-60 gap-0.5 overflow-y-auto p-1.5">
                {g.options.map((opt) => {
                  const on = picked.includes(opt);
                  return (
                    <label
                      key={opt}
                      className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Checkbox
                        checked={on}
                        onCheckedChange={() =>
                          set(g.key, g.single ? (on ? [] : [opt]) : on ? picked.filter((x) => x !== opt) : [...picked, opt])
                        }
                      />
                      {opt}
                    </label>
                  );
                })}
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {(active.length > 0 || query) && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1">
          {active.map((a) => (
            <button
              key={a.key + a.label}
              type="button"
              aria-label={`Remove filter ${a.label}`}
              onClick={() => set(a.key, filters[a.key].filter((x) => x !== a.label))}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/50 bg-gold-soft pl-3 pr-2 text-xs font-semibold transition-colors hover:border-gold"
            >
              {a.label}
              <X className="size-3.5" />
            </button>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>Clear all</Button>
        </div>
      )}
    </div>
  );
}
