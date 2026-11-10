"use client";

import { useMutation } from "@tanstack/react-query";
import { trackEvent, type TrackEvent } from "../api";

/** Tells the backend (which notifies the consultant) a document was opened or downloaded. Never blocks the UI. */
export function useTrackEvent(employeeId: string) {
  const m = useMutation({ mutationFn: (e: TrackEvent) => trackEvent(employeeId, e) });
  return (e: TrackEvent) => m.mutate(e);
}
