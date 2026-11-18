export type CertKey =
  | "H2S"
  | "WellControl"
  | "CPR_AED"
  | "ConfinedSpaceCertified"
  | "Bop"
  | "DrillingWellControl"
  | "RodHandling"
  | "RescueTraining"
  | "FitTest"
  | "Excavation";

export type ResumeKey =
  "completionResumes" | "engineeringResumes" | "workOverCompletionResumes" | "drillingResumes";

export type DegreeKey = "highSchool" | "associate" | "bachelor" | "master";

export interface DocLink {
  label: string;
  url: string;
}

export interface Consultant {
  /** Account id (signUpRecord). Used in URLs, favorites, tracking and email. */
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  dob: string | null;
  jobTitle: string | null;
  experience: number | null;
  industry: string | null;
  availability: string | null;
  shiftType: string | null;
  rotationalShifts: boolean;
  openToTravel: boolean;
  preferredState: string | null;
  preferredCity: string | null;
  profilePicture: string | null;
  isWishList: boolean;
  resumes: Record<ResumeKey, string[]>;
  certificates: DocLink[];
  degrees: DocLink[];
}

export interface ConsultantPage {
  items: Consultant[];
  page: number;
  totalPages: number;
  totalItems: number;
  companiesCount: number;
}

export type TrackEvent = "view-resume" | "resume-downloaded" | "profile-view";

export interface Filters {
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
}
