"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../api";
import { clearSession } from "../store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { ROUTES } from "@/config/routes";

/** Clears local state and goes to login (no server call). */
export function useLogoutLocal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const qc = useQueryClient();
  return () => {
    dispatch(clearSession());
    qc.clear();
    router.replace(ROUTES.login);
  };
}

/** Ends the session locally even if the server call fails. */
export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const qc = useQueryClient();

  return async () => {
    try {
      await logout();
    } catch {
      /* the local session is cleared regardless */
    }
    dispatch(clearSession());
    qc.clear();
    router.replace(ROUTES.login);
  };
}
