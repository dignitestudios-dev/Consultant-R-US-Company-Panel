"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { PasswordField } from "@/components/auth-fields";
import { changePassword, deleteAccount } from "../api";
import { changePasswordSchema } from "../schemas";
import { useLogoutLocal } from "../hooks/use-logout";
import { errorMessage } from "@/lib/api/errors";

type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

export function ChangePasswordDialog({ open, onOpenChange }: DialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const m = useMutation({
    mutationFn: (v: { currentPassword: string; newPassword: string }) =>
      changePassword({ currentPassword: v.currentPassword, newPassword: v.newPassword }),
    onSuccess: () => {
      toast.success("Password changed");
      reset();
      onOpenChange(false);
    },
    onError: (e) => toast.error(errorMessage(e)),
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
        <form onSubmit={handleSubmit((v) => m.mutate(v))} noValidate className="space-y-4">
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

const deleteSchema = z.object({ password: z.string().min(1, "Enter your password to confirm.") });

export function DeleteAccountDialog({ open, onOpenChange }: DialogProps) {
  const clear = useLogoutLocal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(deleteSchema) });

  const m = useMutation({
    mutationFn: (v: { password: string }) => deleteAccount(v.password),
    onSuccess: () => {
      toast.success("Your account was deleted");
      clear();
    },
    onError: (e) => toast.error(errorMessage(e)),
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
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes your company account and signs you out everywhere. Enter your password to
            confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit((v) => m.mutate(v))} noValidate className="space-y-4">
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
