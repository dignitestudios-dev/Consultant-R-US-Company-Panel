import type {
  CertKey,
  Consultant,
  DegreeKey,
  DocLink,
  ResumeKey,
} from "@/features/consultants/types/consultants.types";

export const CERTS: { key: CertKey; label: string }[] = [
  { key: "H2S", label: "H2S Certified" },
  { key: "WellControl", label: "Well Control" },
  { key: "CPR_AED", label: "CPR / AED" },
  { key: "ConfinedSpaceCertified", label: "Confined Space" },
  { key: "Bop", label: "BOP" },
  { key: "DrillingWellControl", label: "Drilling Well Control" },
  { key: "RodHandling", label: "Rod Handling" },
  { key: "RescueTraining", label: "Rescue Training" },
  { key: "FitTest", label: "Fit Test" },
  { key: "Excavation", label: "Excavation" },
];

export const RESUME_TYPES: { key: ResumeKey; label: string }[] = [
  { key: "completionResumes", label: "Completion" },
  { key: "engineeringResumes", label: "Engineering" },
  { key: "workOverCompletionResumes", label: "Work Over Completion" },
  { key: "drillingResumes", label: "Drilling" },
];

export const DEGREES: { key: DegreeKey; label: string }[] = [
  { key: "highSchool", label: "High School" },
  { key: "associate", label: "Associate" },
  { key: "bachelor", label: "Bachelor's" },
  { key: "master", label: "Master's" },
];

type Raw = Record<string, any>;

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);
const urls = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()) : [];

/** Accepts list items (transformed) and wishlist items (raw documents). */
export function normalizeConsultant(raw: Raw, forceFavorite = false): Consultant | null {
  const sr = raw?.signUpRecord && typeof raw.signUpRecord === "object" ? raw.signUpRecord : null;
  const id = sr?._id ?? sr?.id;
  if (!id) return null;

  const certs = (
    raw.certificates && typeof raw.certificates === "object" ? raw.certificates : {}
  ) as Raw;
  const degs = (raw.degrees && typeof raw.degrees === "object" ? raw.degrees : {}) as Raw;

  return {
    id: String(id),
    name: str(raw.name) ?? str(sr.fullName) ?? "No name",
    email: str(raw.email) ?? str(sr.email),
    phone: str(raw.phone) ?? str(sr.phone),
    dob: str(sr.dob),
    jobTitle: str(raw.jobTitle),
    experience: typeof raw.experience === "number" ? raw.experience : null,
    industry: str(raw.industry),
    availability: str(raw.availability),
    shiftType: str(raw.shiftType),
    rotationalShifts: !!raw.rotationalShifts,
    openToTravel: !!raw.openToTravel,
    preferredState: str(raw.prefferedStateToWork),
    preferredCity: str(raw.prefferedCityToWork),
    profilePicture: str(raw.profilePicture) ?? str(sr.profilePicture),
    isWishList: forceFavorite || !!raw.isWishList,
    resumes: {
      completionResumes: urls(raw.completionResumes),
      engineeringResumes: urls(raw.engineeringResumes),
      workOverCompletionResumes: urls(raw.workOverCompletionResumes),
      drillingResumes: urls(raw.drillingResumes),
    },
    certificates: CERTS.flatMap(({ key, label }) => {
      const url = str(certs[key]);
      return url ? [{ label, url }] : [];
    }),
    degrees: DEGREES.flatMap(({ key, label }) =>
      urls(degs[key]).map((url, i, all) => ({
        label: all.length > 1 ? `${label} ${i + 1}` : label,
        url,
      })),
    ),
  };
}

/** Resume categories this person has documents for. */
export const specialties = (c: Consultant) =>
  RESUME_TYPES.filter(({ key }) => c.resumes[key].length > 0).map((t) => t.label);

export const allResumeDocs = (c: Consultant): DocLink[] =>
  RESUME_TYPES.flatMap(({ key, label }) =>
    c.resumes[key].map((url, i, all) => ({
      label: all.length > 1 ? `${label} resume ${i + 1}` : `${label} resume`,
      url,
    })),
  );
