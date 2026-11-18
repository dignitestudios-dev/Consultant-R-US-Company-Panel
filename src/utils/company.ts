import type { Company } from "@/types/common";

export const isSubscribed = (c: Company | null | undefined) =>
  c?.subscriptionStatus?.status === "active";

/** New companies wait here until an admin approves their proof document. */
export const isPendingApproval = (c: Company | null | undefined) => c?.status === "pending";

export const webUrls = (c: Company | null | undefined): string[] => {
  const v = c?.webUrl;
  if (!v) return [];
  return (Array.isArray(v) ? v : [v]).filter(Boolean);
};
