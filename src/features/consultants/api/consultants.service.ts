import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/config/endpoints";
import type { ApiResponse, Pagination } from "@/types/common";
import type {
  Consultant,
  ConsultantPage,
  Filters,
  TrackEvent,
} from "@/features/consultants/types/consultants.types";
import { normalizeConsultant } from "@/features/consultants/utils/consultants.utils";
import { toQuery } from "@/features/consultants/utils/filters.utils";
import { ApiError } from "@/utils/api-error";

const E = ENDPOINTS.consultants;
const F = ENDPOINTS.favorites;

export const PAGE_SIZE = 20;

interface ListData {
  employees: Record<string, unknown>[];
  companiesCount?: number;
  pagination?: Pagination;
}

export async function getConsultants(
  filters: Filters,
  page: number,
  limit = PAGE_SIZE,
): Promise<ConsultantPage> {
  const { data: res } = await axiosInstance.get<ApiResponse<ListData>>(E.list, {
    params: { page, limit, ...toQuery(filters) },
  });
  const raw = res.data?.employees ?? [];
  const pg = res.data?.pagination;
  return {
    // Rows whose account did not match (e.g. the age filter) come back with no signUpRecord.
    items: raw.map((r) => normalizeConsultant(r)).filter((c): c is Consultant => !!c),
    page: Number(pg?.currentPage ?? page),
    totalPages: Number(pg?.totalPages ?? 1),
    totalItems: Number(pg?.totalItems ?? raw.length),
    companiesCount: Number(res.data?.companiesCount ?? 0),
  };
}

export async function trackEvent(employeeId: string, eventType: TrackEvent) {
  await axiosInstance.post(E.trackEvent, { employeeId, eventType });
}

/** The backend returns at most 10 items and answers "Wishlist is empty" with success:false. */
export async function getFavorites(): Promise<Consultant[]> {
  try {
    const { data: res } = await axiosInstance.get<
      ApiResponse<{ employees: Record<string, unknown>[] }>
    >(F.list);
    return (res.data?.employees ?? [])
      .map((r) => normalizeConsultant(r, true))
      .filter((c): c is Consultant => !!c);
  } catch (e) {
    if (e instanceof ApiError && /wishlist is empty/i.test(e.message)) return [];
    throw e;
  }
}

/** Toggles: adds when not a favorite, removes when it is. */
export async function toggleFavorite(employeeId: string) {
  const { data: res } = await axiosInstance.post<ApiResponse<unknown>>(F.toggle, { employeeId });
  return res.message ?? "";
}
