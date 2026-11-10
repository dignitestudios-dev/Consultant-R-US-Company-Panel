export type Job = { title: string; company: string; dates: string; detail: string };

export type Consultant = {
  id: number;
  name: string;
  role: string;
  years: number;
  expertise: string;
  location: string;
  availability: "Available now" | "Within 30 days" | "Project dependent";
  shift: "Day" | "Night" | "Rotational";
  education: string;
  certs: string[];
  skills: string[];
  docs: string[];
  phone: string;
  email: string;
  about: string;
  experience: Job[];
};

// Sample data carried over from the approved prototype.
export const CONSULTANTS: Consultant[] = [
  { id: 1, name: "Sid Michael", role: "Oil Rig Operator", years: 3, expertise: "Completions", location: "Midland, TX", availability: "Available now", shift: "Rotational", education: "Associate degree", certs: ["H2S Clean", "OSHA 30", "IADC WellSharp"], skills: ["Rig operations", "Pressure testing", "Safety audits"], docs: ["Completions"], phone: "(555) 010-1101", email: "sid.michael@example.com", about: "Field-focused rig operator with hands-on Permian Basin experience. Known for safe, steady operations during completions work.", experience: [{ title: "Rig Operator", company: "Sample Energy Services", dates: "2023 to present", detail: "Operate and monitor rig equipment on multi-well pads while supporting daily safety checks." }, { title: "Floorhand", company: "Example Drilling Co.", dates: "2022 to 2023", detail: "Supported tripping, pipe handling, and routine equipment maintenance." }] },
  { id: 2, name: "Crystal Hayes", role: "Lead Division Representative", years: 4, expertise: "Engineering", location: "Houston, TX", availability: "Within 30 days", shift: "Day", education: "Bachelor's degree", certs: ["OSHA 30", "PMP"], skills: ["AFE management", "Vendor coordination", "Field reporting"], docs: ["Engineering", "Completions"], phone: "(555) 010-1102", email: "crystal.hayes@example.com", about: "Division representative who connects field teams with operations leadership and keeps projects on budget.", experience: [{ title: "Lead Division Representative", company: "Sample Petroleum", dates: "2022 to present", detail: "Lead coordination across engineering, vendors, and field supervisors for a multi-rig program." }, { title: "Field Engineer", company: "Example Resources", dates: "2021 to 2022", detail: "Tracked daily costs and prepared operations reports." }] },
  { id: 3, name: "Ross Tanaka", role: "Completions Supervisor", years: 11, expertise: "Completions", location: "Williston, ND", availability: "Available now", shift: "Rotational", education: "Bachelor's degree", certs: ["IADC WellSharp", "H2S Clean", "OSHA 30"], skills: ["Hydraulic fracturing", "Coiled tubing", "Wellsite supervision"], docs: ["Completions", "Work Over Completions"], phone: "(555) 010-1103", email: "ross.tanaka@example.com", about: "Veteran wellsite supervisor who has led completions programs across the Bakken and Permian basins.", experience: [{ title: "Completions Supervisor", company: "Sample Operating LLC", dates: "2018 to present", detail: "Supervise frac and coiled tubing operations from planning through flowback." }, { title: "Completions Foreman", company: "Example Well Services", dates: "2014 to 2018", detail: "Managed crews and service vendors on horizontal completions." }] },
  { id: 4, name: "Suzanne Porter", role: "Drilling Engineer", years: 5, expertise: "Engineering", location: "Denver, CO", availability: "Within 30 days", shift: "Day", education: "Master's degree", certs: ["IADC WellSharp", "PE License"], skills: ["Well planning", "Directional drilling", "Cost modeling"], docs: ["Engineering"], phone: "(555) 010-1104", email: "suzanne.porter@example.com", about: "Drilling engineer focused on well design and practical cost reductions in unconventional plays.", experience: [{ title: "Drilling Engineer", company: "Sample Resources", dates: "2021 to present", detail: "Design well plans and work with directional teams to improve drilling performance." }] },
  { id: 5, name: "Marcus Bell", role: "Workover Consultant", years: 16, expertise: "Work Over Completions", location: "Lafayette, LA", availability: "Available now", shift: "Rotational", education: "High school diploma", certs: ["IADC WellSharp", "H2S Clean", "OSHA 30"], skills: ["Workover rigs", "Fishing operations", "Well control"], docs: ["Work Over Completions", "Completions"], phone: "(555) 010-1105", email: "marcus.bell@example.com", about: "Independent workover consultant experienced in returning mature wells to production onshore and in shallow water.", experience: [{ title: "Workover Consultant", company: "Independent", dates: "2015 to present", detail: "Plan and supervise workovers, including fishing jobs and recompletions." }, { title: "Workover Supervisor", company: "Example Gulf Energy", dates: "2010 to 2015", detail: "Led rig crews and service vendors for well intervention programs." }] },
  { id: 6, name: "Elena Ruiz", role: "Production Engineer", years: 7, expertise: "Engineering", location: "Midland, TX", availability: "Project dependent", shift: "Day", education: "Bachelor's degree", certs: ["OSHA 30", "PE License"], skills: ["Artificial lift", "Production optimization", "Decline analysis"], docs: ["Engineering"], phone: "(555) 010-1106", email: "elena.ruiz@example.com", about: "Production engineer who improves well performance through artificial lift design and data analysis.", experience: [{ title: "Production Engineer", company: "Sample Permian Partners", dates: "2019 to present", detail: "Optimize artificial lift across a large horizontal well portfolio." }] },
  { id: 7, name: "Darnell Greene", role: "Night Completions Consultant", years: 9, expertise: "Completions", location: "Oklahoma City, OK", availability: "Available now", shift: "Night", education: "Associate degree", certs: ["H2S Clean", "IADC WellSharp"], skills: ["Wireline", "Hydraulic fracturing", "Wellsite supervision"], docs: ["Completions"], phone: "(555) 010-1107", email: "darnell.greene@example.com", about: "Dependable night-shift completions consultant with a strong record of safe, efficient stage execution.", experience: [{ title: "Completions Consultant", company: "Independent", dates: "2017 to present", detail: "Oversee overnight frac and wireline operations for operators in the Anadarko Basin." }] },
  { id: 8, name: "Hannah Cole", role: "Workover Engineer", years: 2, expertise: "Work Over Completions", location: "Houston, TX", availability: "Project dependent", shift: "Day", education: "Bachelor's degree", certs: ["OSHA 30"], skills: ["Workover rigs", "Procedure writing", "Well control"], docs: ["Work Over Completions"], phone: "(555) 010-1108", email: "hannah.cole@example.com", about: "Early-career engineer who prepares clear workover procedures and supports field execution.", experience: [{ title: "Workover Engineer", company: "Sample Well Solutions", dates: "2024 to present", detail: "Write workover procedures and track job cost and results." }] },
];

export type FilterKey =
  | "expertise" | "experience" | "certs" | "location"
  | "availability" | "skills" | "shift" | "education";

export const FILTER_GROUPS: { key: FilterKey; label: string; options: string[]; single?: boolean }[] = [
  { key: "expertise", label: "Expertise", options: ["Completions", "Engineering", "Work Over Completions"] },
  { key: "experience", label: "Experience", options: ["1+ years", "3+ years", "5+ years", "10+ years"], single: true },
  { key: "certs", label: "Certifications", options: ["IADC WellSharp", "H2S Clean", "OSHA 30", "PE License", "PMP"] },
  { key: "location", label: "Location", options: ["Midland, TX", "Houston, TX", "Williston, ND", "Denver, CO", "Lafayette, LA", "Oklahoma City, OK"] },
  { key: "availability", label: "Availability", options: ["Available now", "Within 30 days", "Project dependent"] },
  { key: "skills", label: "Skills", options: ["Hydraulic fracturing", "Well control", "Wellsite supervision", "Directional drilling", "Artificial lift", "Workover rigs"] },
  { key: "shift", label: "Job Preferences", options: ["Day", "Night", "Rotational"] },
  { key: "education", label: "Education", options: ["High school diploma", "Associate degree", "Bachelor's degree", "Master's degree"] },
];

export type Filters = Record<FilterKey, string[]>;
export const emptyFilters = (): Filters => ({
  expertise: [], experience: [], certs: [], location: [],
  availability: [], skills: [], shift: [], education: [],
});

export function matches(p: Consultant, f: Filters, query: string) {
  const q = query.trim().toLowerCase();
  if (q) {
    const hay = [p.name, p.role, p.location, p.expertise, ...p.skills].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.expertise.length && !f.expertise.includes(p.expertise)) return false;
  if (f.experience.length && p.years < parseInt(f.experience[0], 10)) return false;
  if (f.availability.length && !f.availability.includes(p.availability)) return false;
  if (f.location.length && !f.location.includes(p.location)) return false;
  if (f.shift.length && !f.shift.includes(p.shift)) return false;
  if (f.education.length && !f.education.includes(p.education)) return false;
  if (f.certs.length && !f.certs.every((c) => p.certs.includes(c))) return false;
  if (f.skills.length && !f.skills.every((c) => p.skills.includes(c))) return false;
  return true;
}

export const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("");
