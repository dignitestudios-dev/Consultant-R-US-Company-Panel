"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useLoginMutation } from "@/features/auth/api/auth.mutations";
import type { LoginFormData } from "@/features/auth/types/auth.types";
import { useAppDispatch } from "@/store";
import { setSession } from "@/store/slices/auth.slice";

export function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const m = useLoginMutation();

  const submit = (v: LoginFormData) =>
    m.mutate(v, {
      onSuccess: ({ token, user }) => {
        dispatch(setSession({ token, user }));
        router.replace(user?.isProfileCompleted ? ROUTES.consultants : ROUTES.setup);
      },
    });

  return { submit, isPending: m.isPending };
}
