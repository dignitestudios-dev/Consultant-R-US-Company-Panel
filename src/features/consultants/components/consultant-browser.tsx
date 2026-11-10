"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, Loader2, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Availability } from "./availability";
import { ConsultantAvatar } from "./consultant-avatar";
import { ConsultantSheet } from "./consultant-sheet";
import { FavoriteButton } from "./favorite-button";
import { FilterBar } from "./filter-bar";
import { useConsultants } from "../hooks/use-consultants";
import { emptyFilters } from "../filters";
import { specialties, type Consultant } from "../types";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

type SortKey = "name" | "experience";
type Sort = { key: SortKey; dir: "asc" | "desc" };

function SortHead({
  label,
  k,
  sort,
  onSort,
  className,
}: {
  label: string;
  k: SortKey;
  className?: string;
  sort: Sort;
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

const headClass = "text-xs font-bold uppercase tracking-wider text-muted-foreground";

export function ConsultantBrowser() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(emptyFilters());
  const [sort, setSort] = useState<Sort>({ key: "name", dir: "asc" });
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("profile");

  const list = useConsultants(filters);
  const pages = list.data?.pages;
  const loaded = useMemo(() => pages?.flatMap((p) => p.items) ?? [], [pages]);
  const total = pages?.[0]?.totalItems ?? 0;
  const companiesCount = pages?.[0]?.companiesCount ?? 0;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? loaded.filter((c) => c.name.toLowerCase().includes(q)) : loaded;
    const d = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) =>
      sort.key === "name"
        ? a.name.localeCompare(b.name) * d
        : ((a.experience ?? -1) - (b.experience ?? -1)) * d,
    );
  }, [loaded, query, sort]);

  // Read the open consultant from the live list so the heart stays in sync.
  const current: Consultant | null = loaded.find((c) => c.id === selected) ?? null;

  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" ? "asc" : "desc" },
    );
  const show = (p: Consultant, t: string) => {
    setSelected(p.id);
    setTab(t);
    setOpen(true);
  };
  const clearAll = () => {
    setFilters(emptyFilters());
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Find consultants</h1>
          <p className="text-sm text-muted-foreground">
            Filter by experience, certifications, location, and availability.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {companiesCount > 0 && (
            <Link
              href={ROUTES.companies}
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:border-gold/50"
            >
              <Building2 className="size-4 text-gold" />
              {companiesCount} {companiesCount === 1 ? "company" : "companies"}
            </Link>
          )}
          <p className="text-sm font-semibold text-muted-foreground" role="status">
            <span className="text-foreground">{total}</span>{" "}
            {total === 1 ? "consultant" : "consultants"}
          </p>
        </div>
      </div>

      <FilterBar
        query={query}
        onQuery={setQuery}
        filters={filters}
        onFilters={setFilters}
        onClear={clearAll}
      />

      <div className="overflow-hidden rounded-[10px] border bg-card shadow-sm">
        {list.isPending ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : list.isError ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <h2 className="font-bold">Couldn&apos;t load consultants</h2>
            <p className="text-sm text-muted-foreground">{list.error.message}</p>
            <Button variant="outline" onClick={() => list.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14">
                  <span className="sr-only">Favorite</span>
                </TableHead>
                <SortHead label="Consultant" k="name" sort={sort} onSort={onSort} />
                <SortHead
                  label="Experience"
                  k="experience"
                  sort={sort}
                  onSort={onSort}
                  className="hidden sm:table-cell"
                />
                <TableHead className={cn(headClass, "hidden lg:table-cell")}>Specialty</TableHead>
                <TableHead className={cn(headClass, "hidden xl:table-cell")}>
                  Preferred location
                </TableHead>
                <TableHead className={cn(headClass, "hidden md:table-cell")}>
                  Availability
                </TableHead>
                <TableHead className="hidden text-right sm:table-cell">
                  <span className="sr-only">Resume</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => {
                const sp = specialties(p);
                const place = [p.preferredCity, p.preferredState].filter(Boolean).join(", ");
                return (
                  <TableRow
                    key={p.id}
                    onClick={() => show(p, "profile")}
                    data-state={open && selected === p.id ? "selected" : undefined}
                    className="group cursor-pointer"
                  >
                    <TableCell className="py-2 pl-3 pr-0">
                      <FavoriteButton person={p} />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <ConsultantAvatar
                          person={p}
                          className="size-10 rounded-lg after:rounded-lg"
                          fallbackClassName="rounded-lg text-xs"
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              show(p, "profile");
                            }}
                            className="block text-left text-sm font-bold underline-offset-4 outline-none hover:underline focus-visible:underline"
                          >
                            {p.name}
                          </button>
                          <span className="block truncate text-xs text-muted-foreground">
                            {p.jobTitle ?? "Consultant"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm font-bold sm:table-cell">
                      {p.experience !== null
                        ? `${p.experience} ${p.experience === 1 ? "year" : "years"}`
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {sp.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="h-6 px-2.5">
                            {sp[0]}
                          </Badge>
                          {sp.length > 1 && (
                            <span className="whitespace-nowrap text-xs text-muted-foreground">
                              +{sp.length - 1} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm xl:table-cell">
                      {place || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Availability value={p.availability} />
                    </TableCell>
                    <TableCell className="hidden pr-4 text-right sm:table-cell">
                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        className="font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          show(p, "resume");
                        }}
                      >
                        Resume
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {list.isSuccess && rows.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center animate-in fade-in">
            <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-5" />
            </span>
            <div className="space-y-1">
              <h2 className="font-bold">No consultants match</h2>
              <p className="text-sm text-muted-foreground">
                Remove a filter or try a different search.
              </p>
            </div>
            <Button variant="outline" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        )}

        {list.hasNextPage && (
          <div className="flex justify-center border-t p-4">
            <Button
              variant="outline"
              onClick={() => list.fetchNextPage()}
              disabled={list.isFetchingNextPage}
            >
              {list.isFetchingNextPage && <Loader2 className="animate-spin" />} Load more
            </Button>
          </div>
        )}
      </div>

      <ConsultantSheet
        person={current}
        open={open}
        onOpenChange={setOpen}
        tab={tab}
        onTabChange={setTab}
      />
    </div>
  );
}
