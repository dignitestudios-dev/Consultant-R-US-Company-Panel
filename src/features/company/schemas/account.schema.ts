import { z } from "zod";
import { strongPassword } from "@/utils/validation";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm."),
});
