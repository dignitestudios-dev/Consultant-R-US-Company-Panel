import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm."),
});
