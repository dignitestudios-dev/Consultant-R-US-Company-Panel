import { AppHeader } from "@/components/app-header";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGuard>
      <AppHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6">{children}</main>
    </AuthGuard>
  );
}
