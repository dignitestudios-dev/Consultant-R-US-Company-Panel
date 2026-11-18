"use client";

import { useClearSession } from "@/hooks/use-clear-session";
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "@/features/company/api/company.mutations";

export function useChangePassword(onDone: () => void) {
  return useChangePasswordMutation(onDone);
}

/** After the account is deleted the local session is cleared and the user lands on login. */
export function useDeleteAccount() {
  const clear = useClearSession();
  return useDeleteAccountMutation(clear);
}
