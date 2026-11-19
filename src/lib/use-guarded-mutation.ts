"use client";

import { useRef } from "react";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

/**
 * `useMutation` that ignores a second `mutate` call while the first is still running.
 * The lock is set synchronously, so a rapid double-click can't send two requests.
 */
export function useGuardedMutation<TData, TError, TVariables, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const locked = useRef(false);
  const m = useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSettled: (...args) => {
      locked.current = false;
      return options.onSettled?.(...args);
    },
  });

  const mutate = ((...args: Parameters<typeof m.mutate>) => {
    if (locked.current) return;
    locked.current = true;
    m.mutate(...args);
  }) as typeof m.mutate;

  return { ...m, mutate };
}
