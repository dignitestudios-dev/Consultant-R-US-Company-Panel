"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/config/routes";
import { useAppDispatch } from "@/store";
import { clearSession } from "@/store/slices/auth.slice";

/** Clears local session state and goes to login (no server call). */
export function useClearSession() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const qc = useQueryClient();
  return () => {
    dispatch(clearSession());
    qc.clear();
    router.replace(ROUTES.login);
  };
}
