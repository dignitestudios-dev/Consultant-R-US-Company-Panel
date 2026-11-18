import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getAllCompanies, getProfile } from "@/features/company/api/company.service";

export const COMPANY_KEY = ["company"] as const;
export const COMPANIES_KEY = ["companies"] as const;

export function useCompanyQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: COMPANY_KEY,
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });
}

export function useCompaniesQuery() {
  return useQuery({ queryKey: COMPANIES_KEY, queryFn: getAllCompanies });
}
