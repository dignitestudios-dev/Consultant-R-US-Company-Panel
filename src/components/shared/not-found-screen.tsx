"use client";

import { SearchX } from "lucide-react";
import { ErrorScreen } from "@/components/shared/error-screen";

export function NotFoundScreen() {
  return (
    <ErrorScreen
      fullPage
      icon={SearchX}
      title="Page not found"
      message="The page you're looking for doesn't exist or has moved."
      primary={{ label: "Go to consultants", href: "/consultants" }}
      secondary={{ label: "Log in", href: "/login" }}
    />
  );
}
