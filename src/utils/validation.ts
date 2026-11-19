import { z } from "zod";

export const LIMITS = { companyName: 100, email: 254, passwordMin: 8, passwordMax: 128 } as const;

/** Length only. Used for confirm-password fields, where the match check does the rest. */
export const passwordLength = z
  .string()
  .min(LIMITS.passwordMin, `Use at least ${LIMITS.passwordMin} characters.`)
  .max(LIMITS.passwordMax, `Password must be ${LIMITS.passwordMax} characters or fewer.`);

/** Length plus 1 lowercase, 1 uppercase, 1 digit and 1 special character. */
export const strongPassword = passwordLength
  .regex(/[a-z]/, "Include a lowercase letter.")
  .regex(/[A-Z]/, "Include an uppercase letter.")
  .regex(/\d/, "Include a number.")
  .regex(/[^A-Za-z0-9]/, "Include a special character.");

export const emailSchema = z
  .string()
  .trim()
  .max(LIMITS.email, `Email must be ${LIMITS.email} characters or fewer.`)
  .pipe(z.email("Enter a valid email address."));
