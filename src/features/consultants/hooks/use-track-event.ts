"use client";

import { useTrackEventMutation } from "@/features/consultants/api/consultants.mutations";
import type { TrackEvent } from "@/features/consultants/types/consultants.types";

/** Never blocks the UI: fire and forget. */
export function useTrackEvent(employeeId: string) {
  const m = useTrackEventMutation(employeeId);
  return (e: TrackEvent) => m.mutate(e);
}
