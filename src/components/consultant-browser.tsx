"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX, ShieldUser, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Availability } from "./availability";
import { ConsultantSheet } from "./consultant-sheet";
import { FavoriteButton } from "./favorite-button";
import { FilterBar } from "./filter-bar";
import { CONSULTANTS, emptyFilters, initials, matches, type Consultant } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type SortKey = "name" | "years";

function SortHead({
  label, k, sort, onSort, className,
}: {
  label: string; k: SortKey; className?: string;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (k: SortKey) => void;
}) {
  const on = sort.key === k;
  const Icon = !on ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead
      className={className}
      aria-sort={on ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          "-ml-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-muted",
          on ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", on ? "text-gold" : "opacity-60")} />
      </button>
    </TableHead>
  );
}

export function ConsultantBrowser({ mode }: { mode: "all" | "favorites" }) {
  const { favorites } = useStore();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(emptyFilters());
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "years", dir: "desc" });
  const [selected, setSelected] = useState<Consultant | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("profile");

  const isFav = mode === "favorites";
  const rows = CONSULTANTS.filter((p) => (isFav ? favorites.includes(p.id) : matches(p, filters, query))).sort((a, b) => {
    const d = sort.dir === "asc" ? 1 : -1;
    return sort.key === "name" ? a.name.localeCompare(b.name) * d : (a.years - b.years) * d;
  });

  const onSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" ? "asc" : "desc" }));

  const show = (p: Consultant, t: string) => {
    setSelected(p);
    setTab(t);
    setOpen(true);
  };
  const clearAll = () => { setFilters(emptyFilters()); setQuery(""); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">{isFav ? "Favorites" : "Find consultants"}</h1>
          <p className="text-sm text-muted-foreground">
            {isFav
              ? "Consultants you've starred, kept in one place."
              : "Filter by expertise, certifications, location, and availability."}
          </p>
        </div>
        <p className="text-sm font-semibold text-muted-foreground" role="status">
          <span className="text-foreground">{rows.length}</span> {isFav ? "starred" : rows.length === 1 ? "consultant" : "consultants"}
          <span className="font-normal"> · sample data</span>
        </p>
      </div>

      {!isFav && (
        <FilterBar query={query} onQuery={setQuery} filters={filters} onFilters={setFilters} onClear={clearAll} />
      )}

      <div className={cn(!isFav && "overflow-hidden rounded-[10px] border bg-card shadow-sm")}>
        {isFav ? (
          rows.length > 0 && (
            <ul className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((p) => (
                <li
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => show(p, "profile")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(p, "profile"); } }}
                  className="relative flex cursor-pointer gap-4 rounded-[10px] border border-transparent bg-card p-2.5 outline-none transition-all hover:border-gold/40 hover:bg-[#122631] focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <div className="grid size-[87px] flex-none place-items-center rounded-[10px] bg-gradient-to-br from-[#1d3a49] to-[#12242e] text-2xl font-bold text-gold ring-1 ring-gold/20">
                    {initials(p.name)}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 pr-9">
                    <div className="space-y-1">
                      <h3 className="truncate text-base font-semibold tracking-[-0.011em]">{p.name}</h3>
                      <p className="truncate text-sm font-light">{p.role}</p>
                    </div>
                    <p className="flex items-center gap-1.5 text-base font-medium">
                      <ShieldUser className="size-5 text-gold" aria-hidden="true" />
                      {String(p.years).padStart(2, "0")} {p.years === 1 ? "Year" : "Years"}
                    </p>
                  </div>
                  <FavoriteButton person={p} className="absolute right-1 top-1" />
                </li>
              ))}
            </ul>
          )
        ) : (
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-14"><span className="sr-only">Favorite</span></TableHead>
              <SortHead label="Consultant" k="name" sort={sort} onSort={onSort} />
              <SortHead label="Experience" k="years" sort={sort} onSort={onSort} className="hidden sm:table-cell" />
              <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">Expertise</TableHead>
              <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground xl:table-cell">Location</TableHead>
              <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">Availability</TableHead>
              <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground xl:table-cell">Certifications</TableHead>
              <TableHead className="hidden text-right sm:table-cell"><span className="sr-only">Resume</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow
                key={p.id}
                onClick={() => show(p, "profile")}
                data-state={open && selected?.id === p.id ? "selected" : undefined}
                className="group cursor-pointer"
              >
                <TableCell className="py-2 pl-3 pr-0"><FavoriteButton person={p} /></TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 rounded-lg after:rounded-lg">
                      <AvatarFallback className="rounded-lg bg-secondary ring-1 ring-gold/25 text-xs font-bold text-gold">{initials(p.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); show(p, "profile"); }}
                        className="block text-left text-sm font-bold underline-offset-4 outline-none hover:underline focus-visible:underline"
                      >
                        {p.name}
                      </button>
                      <span className="block truncate text-xs text-muted-foreground">{p.role}<span className="sm:hidden"> · {p.years} {p.years === 1 ? "yr" : "yrs"}</span></span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm font-bold sm:table-cell">{p.years} {p.years === 1 ? "year" : "years"}</TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm lg:table-cell">{p.expertise}</TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm xl:table-cell">{p.location}</TableCell>
                <TableCell className="hidden md:table-cell"><Availability value={p.availability} /></TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-6 px-2.5">{p.certs[0]}</Badge>
                    {p.certs.length > 1 && <span className="whitespace-nowrap text-xs text-muted-foreground">+{p.certs.length - 1} more</span>}
                  </div>
                </TableCell>
                <TableCell className="hidden pr-4 text-right sm:table-cell">
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    className="font-bold"
                    onClick={(e) => { e.stopPropagation(); show(p, "resume"); }}
                  >
                    Resume
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}

        {rows.length === 0 && (
          <div className={cn("flex flex-col items-center gap-3 px-6 py-16 text-center animate-in fade-in", isFav && "rounded-[10px] border bg-card")}>
            <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              {isFav ? <Star className="size-5" /> : <SearchX className="size-5" />}
            </span>
            <div className="space-y-1">
              <h2 className="font-bold">{isFav ? "No favorites yet" : "No consultants match these filters"}</h2>
              <p className="text-sm text-muted-foreground">
                {isFav ? "Star a consultant to keep them here." : "Remove a filter or try a different search."}
              </p>
            </div>
            {!isFav && <Button variant="outline" onClick={clearAll}>Clear filters</Button>}
          </div>
        )}
      </div>

      <ConsultantSheet person={selected} open={open} onOpenChange={setOpen} tab={tab} onTabChange={setTab} />
    </div>
  );
}
