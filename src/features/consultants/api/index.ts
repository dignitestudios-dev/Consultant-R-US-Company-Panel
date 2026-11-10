import { api, type Pagination } from "@/lib/api/client";
import { ENDPOINTS } from "@/config/endpoints";
import { normalizeConsultant, type Consultant } from "../types";
import { toQuery, type Filters } from "../filters";

const E = ENDPOINTS.consultants;

export const PAGE_SIZE = 20;

export type ConsultantPage = {
  items: Consultant[];
  page: number;
  totalPages: number;
  totalItems: number;
  companiesCount: number;
};

export async function getConsultants(
  filters: Filters,
  page: number,
  limit = PAGE_SIZE,
): Promise<ConsultantPage> {
  const res = await api.get<{
    employees: Record<string, unknown>[];
    companiesCount?: number;
    pagination?: Pagination;
  }>(E.list, { page, limit, ...toQuery(filters) });

  const raw = res.data?.employees ?? [];
  const pg = res.data?.pagination;
  return {
    // Rows whose account didn't match (e.g. the age filter) come back with no signUpRecord.
    items: raw.map((r) => normalizeConsultant(r)).filter((c): c is Consultant => !!c),
    page: Number(pg?.currentPage ?? page),
    totalPages: Number(pg?.totalPages ?? 1),
    totalItems: Number(pg?.totalItems ?? raw.length),
    companiesCount: Number(res.data?.companiesCount ?? 0),
  };
}

export type TrackEvent = "view-resume" | "resume-downloaded" | "profile-view";

export const trackEvent = (employeeId: string, eventType: TrackEvent) =>
  api.post(E.trackEvent, { employeeId, eventType });
