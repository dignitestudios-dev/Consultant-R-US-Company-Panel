"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import { EMAIL_TAKEN, useSignupMutation } from "@/features/auth/api/auth.mutations";
import type { SignupFormData } from "@/features/auth/types/auth.types";
import { useAppDispatch } from "@/store";
import { setSession } from "@/store/slices/auth.slice";
import { errorMessage } from "@/utils/api-error";

/** `onEmailTaken` lets the form show the error on the email field. */
export function useSignup(onEmailTaken: () => void) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const m = useSignupMutation();

  const submit = (v: SignupFormData) =>
    m.mutate(v, {
      onSuccess: ({ token }) => {
        // New companies have no profile yet; the setup step fills it in.
        dispatch(setSession({ token, user: null }));
        router.replace(ROUTES.setup);
      },
      onError: (e) => {
        if (e instanceof Error && e.message === EMAIL_TAKEN) onEmailTaken();
        else toast.error(errorMessage(e));
      },
    });

  return { submit, isPending: m.isPending };
}
