import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { ENDPOINTS } from "@/config/endpoints";
import { ApiError, SESSION_EXPIRED_MESSAGES } from "@/utils/api-error";
import { getDeviceId, getDeviceModel } from "@/utils/device";
import { STORAGE_KEYS } from "@/utils/constants";

const PASSWORD_CHECK_URLS = [
  ENDPOINTS.auth.changePassword,
  ENDPOINTS.auth.deleteAccount,
  ENDPOINTS.auth.login,
];

let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(fn: (() => void) | null) {
  onSessionExpired = fn;
}

const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 90_000,
  headers: { Accept: "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.set("devicemodel", getDeviceModel());
  config.headers.set("deviceuniqueid", getDeviceId());
  if (typeof window !== "undefined" && !config.headers.get("Authorization")) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.token);
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
    } catch {
      /* storage unavailable */
    }
  }
  return config;
});

function toApiError(message: string | undefined, status?: number, url?: string) {
  // Any 401/403 means the session is no longer valid. Password-confirm endpoints are skipped
  // because a wrong password there is not a dead session.
  const authFailure =
    (status === 401 || status === 403) && !PASSWORD_CHECK_URLS.some((u) => url?.includes(u));
  if (authFailure || (message && SESSION_EXPIRED_MESSAGES.includes(message))) onSessionExpired?.();
  return new ApiError(message || "Something went wrong. Please try again.", status);
}

axiosInstance.interceptors.response.use(
  (response) => {
    // The backend sometimes answers 200 with success:false.
    if (response.data && response.data.success === false) {
      return Promise.reject(
        toApiError(response.data.message, response.status, response.config.url),
      );
    }
    return response;
  },
  (error) => {
    if (error instanceof AxiosError) {
      if (!error.response) {
        return Promise.reject(new ApiError("Can't reach the server. Check your connection."));
      }
      return Promise.reject(
        toApiError(error.response.data?.message, error.response.status, error.config?.url),
      );
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
