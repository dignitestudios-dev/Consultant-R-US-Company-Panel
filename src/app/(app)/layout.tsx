import { AppHeader } from "@/components/shared/app-header";
import { AuthGuard } from "@/components/shared/auth-guard";

/** Soft golden light spilling in from both sides of the screen. */
function SideGlows() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-48 top-[8%] h-[520px] w-[360px] rounded-full bg-gold/25 blur-[130px]" />
      <div className="absolute -left-40 bottom-[-10%] h-[380px] w-[300px] rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute -right-48 top-[28%] h-[560px] w-[380px] rounded-full bg-gold/20 blur-[140px]" />
      <div className="absolute -right-36 bottom-[4%] h-[320px] w-[260px] rounded-full bg-gold/15 blur-[110px]" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
    </div>
  );
}

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGuard>
      <div className="relative isolate flex min-h-screen flex-1 flex-col">
        <SideGlows />
        <AppHeader />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
