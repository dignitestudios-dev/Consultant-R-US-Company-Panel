"use client";

import { useLogoutMutation } from "@/features/auth/api/auth.mutations";
import { useClearSession } from "@/hooks/use-clear-session";

/** Ends the session locally even if the server call fails. `isPending` is true while the API call runs. */
export function useLogout() {
  const clear = useClearSession();
  const m = useLogoutMutation();

  const logout = async () => {
    if (m.isPending) return;
    try {
      await m.mutateAsync();
    } catch {
      /* the local session is cleared regardless */
    }
    clear();
  };

  return { logout, isPending: m.isPending };
}
