"use client";

import { useFavoritesQuery } from "@/features/consultants/api/consultants.queries";

export function useFavorites() {
  return useFavoritesQuery();
}
