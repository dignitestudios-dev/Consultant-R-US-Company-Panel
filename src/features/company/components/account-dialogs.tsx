"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/shared/auth-fields";
import {
  changePasswordSchema,
  deleteAccountSchema,
} from "@/features/company/schemas/account.schema";
import { useChangePassword, useDeleteAccount } from "@/features/company/hooks/use-account-actions";
import type {
  ChangePasswordFormData,
  DeleteAccountFormData,
} from "@/features/company/types/company.types";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: DialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) });

  const m = useChangePassword(() => {
    reset();
    onOpenChange(false);
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change password</AlertDialogTitle>
          <AlertDialogDescription>
            Other devices will be signed out after you change it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={handleSubmit((v) =>
            m.mutate({ currentPassword: v.currentPassword, newPassword: v.newPassword }),
          )}
          noValidate
          className="space-y-4"
        >
          <PasswordField
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <PasswordField
            label="New password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" variant="gold" disabled={m.isPending} className="h-10 font-bold">
              {m.isPending && <Loader2 className="animate-spin" />} Update
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteAccountDialog({ open, onOpenChange }: DialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({ resolver: zodResolver(deleteAccountSchema) });

  const m = useDeleteAccount();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes your company account and signs you out everywhere. Enter your password to
            confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit((v) => m.mutate(v.password))} noValidate className="space-y-4">
          <PasswordField
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={m.isPending}
              className="h-10 font-bold"
            >
              {m.isPending && <Loader2 className="animate-spin" />} Delete account
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
