"use client";

import { useState } from "react";
import {
  BadgeCheck, Briefcase, Clock, Download, GraduationCap, Mail, MapPin, Phone, Printer, Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Availability } from "./availability";
import type { Consultant } from "@/lib/data";
import { cn } from "@/lib/utils";

function Card({
  title, icon: Icon, children, className,
}: { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-3.5 rounded-[10px] border bg-background/40 p-4", className)}>
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="size-3.5 text-gold" />}
        {title}
      </h3>
      {children}
    </section>
  );
}

function Fact({
  icon: Icon, label, children,
}: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-[10px] border bg-background/40 p-3.5">
      <span className="grid size-8 flex-none place-items-center rounded-lg bg-gold-soft text-gold">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 space-y-0.5">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="break-words text-sm font-semibold">{children}</dd>
      </div>
    </div>
  );
}

export function Profile({ p }: { p: Consultant }) {
  return (
    <div className="@container animate-in fade-in-0 duration-300">
      <div className="grid gap-4 p-5 @2xl:grid-cols-[minmax(0,1fr)_320px] @2xl:p-6">
        <div className="space-y-4">
          <Card title="About">
            <p className="text-sm leading-relaxed text-foreground/85">{p.about}</p>
          </Card>

          <Card title="Work experience" icon={Briefcase}>
            <ol className="relative space-y-6 border-l border-border pl-6">
              {p.experience.map((j, i) => (
                <li key={j.title + j.dates} className="relative space-y-1.5">
                  <span
                    className={cn(
                      "absolute -left-[31px] top-1 size-3 rounded-full border-2",
                      i === 0 ? "border-gold bg-gold shadow-[0_0_0_4px_rgb(193_154_77/0.18)]" : "border-muted-foreground/50 bg-card",
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="text-sm font-bold">{j.title}</h4>
                    {i === 0 && j.dates.includes("present") && (
                      <Badge variant="secondary" className="h-5 px-2 text-[10px] text-gold">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">{j.company}</span> · {j.dates}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">{j.detail}</p>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {p.skills.map((s) => (
                <Badge key={s} variant="outline" className="h-6 px-2.5 font-medium">{s}</Badge>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <dl className="grid gap-2.5 sm:grid-cols-2 @2xl:grid-cols-1">
            <Fact icon={Clock} label="Availability"><Availability value={p.availability} /></Fact>
            <Fact icon={Wrench} label="Expertise">{p.expertise}</Fact>
            <Fact icon={Briefcase} label="Job preference">{p.shift} shift</Fact>
            <Fact icon={GraduationCap} label="Education">{p.education}</Fact>
            <Fact icon={MapPin} label="Location">{p.location}</Fact>
            <Fact icon={Phone} label="Phone">
              <a href={`tel:${p.phone.replace(/[^0-9]/g, "")}`} className="underline-offset-4 hover:text-gold hover:underline">{p.phone}</a>
            </Fact>
            <Fact icon={Mail} label="Email">
              <a href={`mailto:${p.email}`} className="underline-offset-4 hover:text-gold hover:underline">{p.email}</a>
            </Fact>
          </dl>

          <Card title="Certifications" icon={BadgeCheck}>
            <ul className="space-y-2">
              {p.certs.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-sm font-medium">
                  <BadgeCheck className="size-4 flex-none text-success" /> {c}
                </li>
              ))}
            </ul>
          </Card>

        </div>
      </div>
    </div>
  );
}

function PaperHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="border-b border-[#e6dcc6] pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a25]">
      {children}
    </h4>
  );
}

export function Resume({ p }: { p: Consultant }) {
  const [doc, setDoc] = useState(0);
  const active = p.docs[doc] ?? p.docs[0];

  return (
    <div className="@container space-y-4 p-5 animate-in fade-in-0 duration-300 @2xl:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Resume version" className="inline-flex rounded-lg border bg-background/40 p-1">
          {p.docs.map((d, i) => (
            <button
              key={d}
              type="button"
              aria-pressed={i === doc}
              onClick={() => setDoc(i)}
              className={cn(
                "h-8 rounded-md px-3 text-xs font-semibold transition-colors",
                i === doc ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => toast("Print is not active in this prototype")}>
            <Printer /> Print
          </Button>
          <Button type="button" variant="gold" size="sm" onClick={() => toast("Download is not active in this prototype")}>
            <Download /> Download
          </Button>
        </div>
      </div>

      <div className="rounded-[10px] border bg-[#08111a] p-3 @2xl:p-6">
        <article
          key={active}
          className="mx-auto max-w-[760px] overflow-hidden rounded-md bg-white text-[#101d2d] shadow-[0_20px_50px_-12px_rgb(0_0_0/0.6)] animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <header className="space-y-2 bg-[#101d2d] px-6 py-6 text-white @2xl:px-10">
            <h3 className="text-2xl font-extrabold tracking-tight">{p.name}</h3>
            <p className="text-sm font-semibold text-[#e2be82]">{p.role}</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/75">
              <span>{p.location}</span><span>{p.phone}</span><span className="break-all">{p.email}</span>
            </p>
          </header>

          <div className="grid gap-x-8 gap-y-6 px-6 py-6 @2xl:grid-cols-[1fr_200px] @2xl:px-10">
            <div className="space-y-6">
              <section className="space-y-2">
                <PaperHeading>Summary</PaperHeading>
                <p className="text-[13px] leading-relaxed">{p.about}</p>
              </section>
              <section className="space-y-3">
                <PaperHeading>{active} experience</PaperHeading>
                {p.experience.map((j) => (
                  <div key={j.title + j.dates} className="space-y-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <strong className="text-[13px]">{j.title}</strong>
                      <span className="text-xs text-[#5a6b7f]">{j.dates}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#7a5a25]">{j.company}</p>
                    <p className="text-[13px] leading-relaxed">{j.detail}</p>
                  </div>
                ))}
              </section>
            </div>

            <aside className="space-y-6">
              <section className="space-y-2">
                <PaperHeading>Certifications</PaperHeading>
                <ul className="space-y-1 text-[13px]">
                  {p.certs.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </section>
              <section className="space-y-2">
                <PaperHeading>Skills</PaperHeading>
                <ul className="space-y-1 text-[13px]">
                  {p.skills.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </section>
              <section className="space-y-2">
                <PaperHeading>Education</PaperHeading>
                <p className="text-[13px]">{p.education}</p>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}
