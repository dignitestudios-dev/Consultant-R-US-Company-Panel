export const ROUTES = {
  login: "/login",
  signup: "/signup",
  forgot: "/forgot",
  setup: "/setup",
  subscription: "/subscription-required",
  pending: "/pending-verification",
  consultants: "/consultants",
  favorites: "/favorites",
  companies: "/companies",
  company: "/company",
} as const;

/** Pages anyone can open. Everything else needs a session. */
export const PUBLIC_ROUTES: string[] = [ROUTES.login, ROUTES.signup, ROUTES.forgot];

export const SUPPORT_EMAIL = "info@Consultantsrus.com";

export const PRIVACY_URL = "https://www.consultantsrus.co/privacy-policy";
export const TERMS_URL = "https://www.consultantsrus.co/term-conditions";
