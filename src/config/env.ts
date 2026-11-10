export const env = {
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "https://api.consultantsrus.co").replace(/\/+$/, ""),
};

export const STORAGE_KEYS = {
  token: "auth-token",
  user: "auth-user",
  deviceId: "device-id",
} as const;
