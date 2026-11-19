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
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
  { value: "5", label: "5 Years" },
  { value: "6+", label: "5+ Years" },
];

export const AGE_OPTIONS = ["18-24", "25-30", "30-40", "40-50", "50-60"];

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
  if (f.experience) q.experience = f.experience;
  if (f.age) q.age = f.age;
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
    experience: get("exp"),
    age: get("age"),
    education: DEGREES.some((d) => d.key === edu) ? (edu as DegreeKey) : "",
    certs: list(get("certs")).filter((c) => certKeys.includes(c)) as CertKey[],
    resumes: list(get("resumes")).filter((r) => resumeKeys.includes(r)) as ResumeKey[],
    industry: get("industry"),
    availability: get("avail"),
    preferredState: get("state"),
    preferredCity: get("city"),
  };
}
