export type SubscriptionStatus = {
  status: string; // "none" | "active" | ...
  platform?: string;
  currentPeriodEnd?: string;
  lastValidated?: string;
};

export type Company = {
  id: string | null;
  signUpRecord: string | { _id: string } | null;
  role: string;
  companyName: string | null;
  companySize: string | null;
  industryFocus: string | null;
  description: string | null;
  webUrl: string[] | string | null;
  profilePicture: string | null;
  licence: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  email: string | null;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  status: "pending" | "approved" | null;
  subscriptionStatus: SubscriptionStatus | null;
};

export const COMPANY_SIZES = ["0-1", "1-10", "10-50", "50-200", "200-500", "500-1000", "1000+"];
export const INDUSTRIES = ["Oil Field"];

export const isSubscribed = (c: Company | null | undefined) =>
  c?.subscriptionStatus?.status === "active";

export const webUrls = (c: Company | null | undefined): string[] => {
  const v = c?.webUrl;
  if (!v) return [];
  return (Array.isArray(v) ? v : [v]).filter(Boolean);
};
