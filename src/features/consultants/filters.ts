import type { CertKey, DegreeKey, ResumeKey } from "./types";

export type Filters = {
  /** "1".."5" or "6+" */
  experience: string;
  /** "18-24" style range */
  age: string;
  education: DegreeKey | "";
  certs: CertKey[];
  resumes: ResumeKey[];
  industry: string;
  /** yyyy-mm-dd */
  availability: string;
  preferredState: string;
  preferredCity: string;
};

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
