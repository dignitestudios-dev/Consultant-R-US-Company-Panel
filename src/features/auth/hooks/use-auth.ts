"use client";

import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const { token, user, hydrated } = useAppSelector((s) => s.auth);
  return { token, user, hydrated, isAuthed: !!token };
}
