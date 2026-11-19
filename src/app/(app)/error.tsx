"use client";

import { TriangleAlert } from "lucide-react";
import { ErrorScreen } from "@/components/shared/error-screen";

/** Keeps the header visible: only the page content is replaced. */
export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorScreen
      icon={TriangleAlert}
      title="This page couldn't load"
      message="Something went wrong while showing this page. Your other pages still work."
      primary={{ label: "Try again", onClick: reset }}
      secondary={{ label: "Back to consultants", href: "/consultants" }}
    />
  );
}
