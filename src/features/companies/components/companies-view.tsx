"use client";

import { useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCompanies } from "@/features/company/api";
import { initials } from "@/features/consultants/types";

export function CompaniesView() {
  const [query, setQuery] = useState("");
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = (data ?? []).filter((c) => c.companyName);
    return q ? all.filter((c) => c.companyName!.toLowerCase().includes(q)) : all;
  }, [data, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">Companies using Consultants R US.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search companies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies"
            className="h-10 bg-card pl-9"
          />
        </div>
      </div>

      {isPending ? (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-[10px]" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-[10px] border bg-card px-6 py-16 text-center">
          <h2 className="font-bold">Couldn&apos;t load companies</h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[10px] border bg-card px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Building2 className="size-5" />
          </span>
          <h2 className="font-bold">No companies found</h2>
        </div>
      ) : (
        <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <li key={c._id} className="flex items-center gap-4 rounded-[10px] border bg-card p-4">
              <Avatar className="size-12 rounded-lg after:rounded-lg">
                {c.profilePicture && (
                  <AvatarImage src={c.profilePicture} alt="" className="object-cover" />
                )}
                <AvatarFallback className="rounded-lg bg-secondary text-sm font-bold text-gold ring-1 ring-gold/25">
                  {initials(c.companyName!)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 truncate font-semibold">{c.companyName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
