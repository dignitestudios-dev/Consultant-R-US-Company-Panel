import Image from "next/image";
import { BadgeCheck, Filter, Phone } from "lucide-react";

const POINTS = [
  { icon: Filter, text: "Filter by certification, availability, and location" },
  { icon: BadgeCheck, text: "Browse verified profiles and resumes" },
  { icon: Phone, text: "Call or email consultants directly" },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r bg-card p-12 text-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute -right-24 -top-24 size-[420px] rounded-full bg-gold/30 blur-[110px]"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 size-[360px] rounded-full bg-white/10 blur-[110px]"
          aria-hidden="true"
        />
        <Image src="/logo.png" alt="Consultants R US" width={198} height={204} priority className="relative h-24 w-auto self-start" />
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
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-gold">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-foreground/60">
          Prototype with sample data. Please don&apos;t enter real passwords.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Image src="/logo.png" alt="Consultants R US" width={198} height={204} className="mx-auto h-20 w-auto lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
