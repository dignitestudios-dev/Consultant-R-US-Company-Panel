import { ROUTES } from "@/config/routes";

/** Login URL that remembers the page the user was on. */
export function loginUrlWithReturn(): string {
  if (typeof window === "undefined") return ROUTES.login;
  const here = window.location.pathname + window.location.search;
  const onAuthPage = [ROUTES.login, ROUTES.signup, ROUTES.forgot, ROUTES.setup].some((p) =>
    window.location.pathname.startsWith(p),
  );
  return onAuthPage || here === "/"
    ? ROUTES.login
    : `${ROUTES.login}?next=${encodeURIComponent(here)}`;
}

/** The `next` page from the current URL, only if it is a safe in-app path. */
export function returnPathFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}
