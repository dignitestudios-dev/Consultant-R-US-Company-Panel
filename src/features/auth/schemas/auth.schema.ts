import { z } from "zod";
import { LIMITS, emailSchema, passwordLength, strongPassword } from "@/utils/validation";

export { LIMITS };

const email = emailSchema;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Enter your company name.")
      .max(LIMITS.companyName, `Company name must be ${LIMITS.companyName} characters or fewer.`),
    email,
    password: strongPassword,
    confirmPassword: passwordLength,
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const forgotEmailSchema = z.object({ email });

export const otpSchema = z.object({ otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code.") });

export const resetSchema = z
  .object({
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, "Repeat your password."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });
