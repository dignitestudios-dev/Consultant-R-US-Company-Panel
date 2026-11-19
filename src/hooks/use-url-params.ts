"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Reads and writes the page's search params so state survives refresh, sharing and back.
 * `set` takes several keys at once and removes any key whose value is empty.
 */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? "";

  const set = (patch: Record<string, string | null | undefined>) => {
    // Start from the live URL so two quick updates do not overwrite each other.
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return { get, set };
}
