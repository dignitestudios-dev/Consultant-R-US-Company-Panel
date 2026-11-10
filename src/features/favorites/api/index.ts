import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { ENDPOINTS } from "@/config/endpoints";
import { normalizeConsultant, type Consultant } from "@/features/consultants/types";

const E = ENDPOINTS.favorites;

/** The backend returns at most 10 items and answers "Wishlist is empty" with success:false. */
export async function getFavorites(): Promise<Consultant[]> {
  try {
    const res = await api.get<{ employees: Record<string, unknown>[] }>(E.list);
    return (res.data?.employees ?? [])
      .map((r) => normalizeConsultant(r, true))
      .filter((c): c is Consultant => !!c);
  } catch (e) {
    if (e instanceof ApiError && /wishlist is empty/i.test(e.message)) return [];
    throw e;
  }
}

/** Toggles: adds when not a favorite, removes when it is. */
export const toggleFavorite = async (employeeId: string) =>
  (await api.post<unknown>(E.toggle, { employeeId })).message ?? "";
