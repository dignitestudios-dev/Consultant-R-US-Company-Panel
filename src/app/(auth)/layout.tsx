import Image from "next/image";
import { AuthContainer } from "@/components/auth-container";
import { BadgeCheck, Filter, Phone } from "lucide-react";

const POINTS = [
  { icon: Filter, text: "Filter by certification, availability, and location" },
  { icon: BadgeCheck, text: "Browse verified profiles and resumes" },
  { icon: Phone, text: "Call or email consultants directly" },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:h-screen lg:overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden lg:h-screen overflow-hidden border-r bg-card p-12 text-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute -right-24 -top-24 size-[420px] rounded-full bg-gold/30 blur-[110px]"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 size-[360px] rounded-full bg-white/10 blur-[110px]"
          aria-hidden="true"
        />
        <Image
          src="/logo.png"
          alt="Consultants R US"
          width={198}
          height={204}
          priority
          className="relative h-24 w-auto self-start"
        />
        <div className="relative max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-5xl font-extrabold leading-[1.08] tracking-tight">
              Find and connect with the best.
            </h1>
            <p className="text-lg leading-relaxed text-foreground/75">
              Explore profiles to quickly discover candidates that match your company&apos;s needs.
            </p>
          </div>
          <ul className="space-y-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm font-medium text-foreground/90"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-gold">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="min-w-0 lg:h-screen lg:overflow-x-hidden lg:overflow-y-auto">
        <div className="flex min-h-full items-start justify-center px-5 py-12 lg:items-center">
          <AuthContainer>
            <Image
              src="/logo.png"
              alt="Consultants R US"
              width={198}
              height={204}
              className="mx-auto h-20 w-auto lg:hidden"
            />
            {children}
          </AuthContainer>
        </div>
      </main>
    </div>
  );
}
