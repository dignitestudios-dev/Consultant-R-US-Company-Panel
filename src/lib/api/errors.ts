export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function errorMessage(
  e: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (e instanceof ApiError) return e.message || fallback;
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

/** Messages the backend sends when a session is no longer valid. */
export const SESSION_EXPIRED_MESSAGES = [
  "Invalid or expired token provided",
  "Unauthorized - Please relogin",
  "No such User found - Access denied",
];
