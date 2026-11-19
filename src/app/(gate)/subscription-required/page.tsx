import type { Metadata } from "next";
import { SubscriptionRequired } from "@/components/shared/subscription-required";

export const metadata: Metadata = { title: "Subscription required" };

export default function SubscriptionRequiredPage() {
  return <SubscriptionRequired />;
}
