"use client";

import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanies } from "@/features/company/hooks/use-companies";
import { initials } from "@/utils/format";

export function CompaniesView() {
  const { rows, query, setQuery, isPending, isError, error, refetch } = useCompanies();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">Companies using Consultants R US.</p>
        </div>
        <SearchInput
          label="Search companies"
          placeholder="Search companies"
          value={query}
          onChange={setQuery}
        />
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
        <EmptyState
          icon={Building2}
          title={query.trim() ? "No companies found" : "No companies yet"}
          description={
            query.trim()
              ? "Try a different search."
              : "Companies will appear here once they sign up."
          }
          action={
            query.trim() && (
              <Button variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            )
          }
        />
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
              <span className="min-w-0 truncate font-semibold" title={c.companyName ?? undefined}>
                {c.companyName}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
