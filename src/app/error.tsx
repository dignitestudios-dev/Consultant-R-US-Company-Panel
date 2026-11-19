"use client";

import { TriangleAlert } from "lucide-react";
import { ErrorScreen } from "@/components/shared/error-screen";

export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorScreen
      fullPage
      icon={TriangleAlert}
      title="Something went wrong"
      message="This page ran into a problem. Try again, or go back to the start."
      primary={{ label: "Try again", onClick: reset }}
      secondary={{ label: "Go to start", href: "/" }}
    />
  );
}
