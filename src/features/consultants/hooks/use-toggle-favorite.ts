"use client";

import { useToggleFavoriteMutation } from "@/features/consultants/api/consultants.mutations";

export function useToggleFavorite() {
  return useToggleFavoriteMutation();
}
