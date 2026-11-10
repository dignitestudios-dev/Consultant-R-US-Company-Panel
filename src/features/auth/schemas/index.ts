import { z } from "zod";

const email = z.email("Enter a valid email address.");
const password = z.string().min(8, "Use at least 8 characters.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your company name."),
    email,
    password,
    confirmPassword: z.string().min(1, "Repeat your password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const forgotEmailSchema = z.object({ email });
export const otpSchema = z.object({ otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code.") });

export const resetSchema = z
  .object({ newPassword: password, confirmPassword: z.string().min(1, "Repeat your password.") })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: password,
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
