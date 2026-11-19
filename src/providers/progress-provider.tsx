"use client";

import { ProgressProvider } from "@bprogress/next/app";

/** Thin gold bar at the top of the viewport on every client-side navigation. */
export default function AppProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider height="3px" color="#c19a4d" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
}
