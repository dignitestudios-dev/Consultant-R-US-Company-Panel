export interface Pagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
}

export interface SubscriptionStatus {
  status: string; // "none" | "active" | ...
  platform?: string;
  currentPeriodEnd?: string;
  lastValidated?: string;
}

/** The signed-in company. Held in Redux and used by auth, company and consultants. */
export interface Company {
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
}
