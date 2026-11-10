import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { env, STORAGE_KEYS } from "@/config/env";
import { getDeviceId, getDeviceModel } from "@/lib/device";
import { ApiError, SESSION_EXPIRED_MESSAGES } from "./errors";

export type Pagination = {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
};

let onSessionExpired: (() => void) | null = null;
export const setSessionExpiredHandler = (fn: (() => void) | null) => {
  onSessionExpired = fn;
};

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.token);
  } catch {
    return null;
  }
}

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 90_000,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  config.headers.set("devicemodel", getDeviceModel());
  config.headers.set("deviceuniqueid", getDeviceId());
  const token = config.headers.get("Authorization") ? null : readToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

function fail(message: string | undefined, status?: number): never {
  if (message && SESSION_EXPIRED_MESSAGES.includes(message)) onSessionExpired?.();
  throw new ApiError(message || "Something went wrong. Please try again.", status);
}

async function request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const res = await http.request<ApiResponse<T>>(config);
    const body = res.data;
    // The backend sometimes answers 200 with success:false.
    if (body && body.success === false) fail(body.message, res.status);
    return body;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof AxiosError) {
      if (!e.response) throw new ApiError("Can't reach the server. Check your connection.");
      const body = e.response.data as Partial<ApiResponse<unknown>> | undefined;
      fail(body?.message, e.response.status);
    }
    throw e;
  }
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>({ method: "GET", url, params }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ method: "POST", url, data, ...config }),
};
