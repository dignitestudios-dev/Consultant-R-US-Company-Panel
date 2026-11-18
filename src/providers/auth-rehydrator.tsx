"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/config/routes";
import { setSessionExpiredHandler } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearSession, hydrate } from "@/store/slices/auth.slice";

/** Restores Redux from localStorage on mount and signs out when the API says the session is gone. */
export default function AuthRehydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      if (!token) return;
      dispatch(clearSession());
      qc.clear();
      router.replace(ROUTES.login);
    });
    return () => setSessionExpiredHandler(null);
  }, [token, dispatch, qc, router]);

  return <>{children}</>;
}
