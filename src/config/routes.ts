export const ROUTES = {
  login: "/login",
  signup: "/signup",
  forgot: "/forgot",
  setup: "/setup",
  subscription: "/subscription-required",
  consultants: "/consultants",
  favorites: "/favorites",
  companies: "/companies",
  company: "/company",
  consultant: (id: string) => `/consultants/${id}`,
} as const;

/** Pages anyone can open. Everything else needs a session. */
export const PUBLIC_ROUTES: string[] = [ROUTES.login, ROUTES.signup, ROUTES.forgot];

export const PRIVACY_URL = "https://www.consultantsrus.co/privacy-policy";
export const TERMS_URL = "https://www.consultantsrus.co/term-conditions";
