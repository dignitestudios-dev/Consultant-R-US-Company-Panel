import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changePassword,
  completeProfile,
  deleteAccount,
  updateProfile,
} from "@/features/company/api/company.service";
import { COMPANY_KEY } from "@/features/company/api/company.queries";
import type { SaveCompanyInput } from "@/features/company/types/company.types";
import { buildCompanyFormData } from "@/features/company/utils/company.utils";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/auth.slice";
import { errorMessage } from "@/utils/api-error";

export function useSaveCompanyMutation() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveCompanyInput) => {
      const body = buildCompanyFormData(input);
      return input.mode === "setup" ? completeProfile(body) : updateProfile(body);
    },
    onSuccess: (company, input) => {
      dispatch(setUser({ ...company, isProfileCompleted: true }));
      qc.invalidateQueries({ queryKey: COMPANY_KEY });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useChangePasswordMutation(onDone: () => void) {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed");
      onDone();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
}

export function useDeleteAccountMutation(onDeleted: () => void) {
  return useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onSuccess: () => {
      toast.success("Your account was deleted");
      onDeleted();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
}
