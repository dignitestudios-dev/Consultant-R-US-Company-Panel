export const PASSWORD_RULES = [
  { label: "A lowercase letter", test: /[a-z]/ },
  { label: "An uppercase letter", test: /[A-Z]/ },
  { label: "A number", test: /\d/ },
  { label: "A special character", test: /[^A-Za-z0-9]/ },
] as const;

export const PASSWORD_MIN = 8;

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"]; // red to green

/** Score = rules met (0-4) + 1 for minimum length, out of 5. */
export function getPasswordStrength(pw: string) {
  const met = PASSWORD_RULES.map((r) => r.test.test(pw));
  const score = met.filter(Boolean).length + (pw.length >= PASSWORD_MIN ? 1 : 0);
  return {
    score,
    max: 5,
    color: COLORS[score] ?? COLORS[0],
    met,
    lengthOk: pw.length >= PASSWORD_MIN,
  };
}
