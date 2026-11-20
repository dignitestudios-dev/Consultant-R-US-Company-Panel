import type {
  CertKey,
  DegreeKey,
  Filters,
  ResumeKey,
} from "@/features/consultants/types/consultants.types";
import { CERTS, DEGREES, RESUME_TYPES } from "@/features/consultants/utils/consultants.utils";

export const emptyFilters = (): Filters => ({
  experience: "",
  age: "",
  education: "",
  certs: [],
  resumes: [],
  industry: "",
  availability: "",
  preferredState: "",
  preferredCity: "",
});

export const EXPERIENCE_OPTIONS = [
  { value: "0-5", label: "0–5 Years" },
  { value: "5-10", label: "5–10 Years" },
  { value: "10-15", label: "10–15 Years" },
  { value: "15-20", label: "15–20 Years" },
  { value: "20+", label: "20+ Years" },
];

export const AGE_OPTIONS = ["18-24", "25-30", "30-40", "40-50", "50+"];

/** "5-10" -> min 5, max 10; "20+" -> min 20, no max. Anything else -> null. */
function parseRange(v: string): { min: number; max?: number } | null {
  const open = /^(\d+)\+$/.exec(v);
  if (open) return { min: Number(open[1]) };
  const closed = /^(\d+)-(\d+)$/.exec(v);
  if (closed) return { min: Number(closed[1]), max: Number(closed[2]) };
  return null;
}

export const filterCount = (f: Filters) =>
  [
    f.experience,
    f.age,
    f.education,
    f.industry,
    f.availability,
    f.preferredState,
    f.preferredCity,
  ].filter(Boolean).length +
  f.certs.length +
  f.resumes.length;

/** Query params exactly as GET /contractor/get-employees-by-contractor reads them. */
export function toQuery(f: Filters): Record<string, string | boolean> {
  const q: Record<string, string | boolean> = {};
  const exp = parseRange(f.experience);
  if (exp) {
    q.minExperience = String(exp.min);
    if (exp.max !== undefined) q.maxExperience = String(exp.max);
  }
  const age = parseRange(f.age);
  if (age) {
    q.minAge = String(age.min);
    if (age.max !== undefined) q.maxAge = String(age.max);
  }
  if (f.education) q[f.education] = true;
  for (const c of f.certs) q[c] = true;
  for (const r of f.resumes) q[r] = true;
  if (f.industry) q.industryFocus = f.industry;
  if (f.availability) q.availability = f.availability;
  if (f.preferredState.trim()) q.prefferedStateToWork = f.preferredState.trim();
  if (f.preferredCity.trim()) q.prefferedCityToWork = f.preferredCity.trim();
  return q;
}

/** Filters as URL search params (empty values are dropped by the URL helper). */
export const filtersToParams = (f: Filters): Record<string, string | null> => ({
  exp: f.experience || null,
  age: f.age || null,
  edu: f.education || null,
  certs: f.certs.join(",") || null,
  resumes: f.resumes.join(",") || null,
  industry: f.industry || null,
  avail: f.availability || null,
  state: f.preferredState || null,
  city: f.preferredCity || null,
});

const list = (v: string) => v.split(",").filter(Boolean);

/** Rebuilds filters from the URL. Only known keys are accepted. */
export function filtersFromParams(get: (key: string) => string): Filters {
  const edu = get("edu");
  const certKeys = CERTS.map((c) => c.key as string);
  const resumeKeys = RESUME_TYPES.map((r) => r.key as string);
  return {
    experience: EXPERIENCE_OPTIONS.some((o) => o.value === get("exp")) ? get("exp") : "",
    age: AGE_OPTIONS.includes(get("age")) ? get("age") : "",
    education: DEGREES.some((d) => d.key === edu) ? (edu as DegreeKey) : "",
    certs: list(get("certs")).filter((c) => certKeys.includes(c)) as CertKey[],
    resumes: list(get("resumes")).filter((r) => resumeKeys.includes(r)) as ResumeKey[],
    industry: get("industry"),
    availability: get("avail"),
    preferredState: get("state"),
    preferredCity: get("city"),
  };
}
