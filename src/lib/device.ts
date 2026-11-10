import { STORAGE_KEYS } from "@/config/env";

/** One id per browser. The backend keys sessions on it, so it must be stable and unique. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.localStorage.getItem(STORAGE_KEYS.deviceId);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEYS.deviceId, id);
    }
    return id;
  } catch {
    return "web-unknown";
  }
}

export function getDeviceModel(): string {
  if (typeof navigator === "undefined") return "Web";
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Browser";
  return `Web ${browser}`;
}
