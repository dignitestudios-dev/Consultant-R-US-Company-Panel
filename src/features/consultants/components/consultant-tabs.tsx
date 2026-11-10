"use client";

import { Calendar, Clock, Mail, MapPin, Phone, Plane, Repeat, Sun, Briefcase } from "lucide-react";
import { Availability } from "./availability";
import { DocumentList } from "./documents";
import { formatDate, formatPhone, telHref } from "@/lib/format";
import { mailtoHref } from "../email";
import { allResumeDocs, type Consultant } from "../types";

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
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

const none = <span className="font-normal text-muted-foreground">Not provided</span>;
const link = "underline-offset-4 hover:text-gold hover:underline";

export function ProfileTab({ p }: { p: Consultant }) {
  const phone = formatPhone(p.phone);
  const place = [p.preferredCity, p.preferredState].filter(Boolean).join(", ");
  const shift = p.shiftType === "Both" ? "Both (Night or Day)" : p.shiftType;

  return (
    <dl className="grid gap-2.5 p-5 animate-in fade-in-0 duration-300 sm:grid-cols-2 @2xl:p-6">
      <Fact icon={Phone} label="Contact number">
        {phone ? (
          <a href={telHref(p.phone)} className={link}>
            {phone}
          </a>
        ) : (
          none
        )}
      </Fact>
      <Fact icon={Mail} label="Email">
        {p.email ? (
          <a href={mailtoHref(p.email)} className={link}>
            {p.email}
          </a>
        ) : (
          none
        )}
      </Fact>
      <Fact icon={Briefcase} label="Experience">
        {p.experience !== null ? `${p.experience} ${p.experience === 1 ? "year" : "years"}` : none}
      </Fact>
      <Fact icon={Clock} label="Availability">
        <Availability value={p.availability} className="font-semibold" />
      </Fact>
      <Fact icon={Sun} label="Preferred job type">
        {shift ?? none}
      </Fact>
      <Fact icon={MapPin} label="Preferred work location">
        {place || none}
      </Fact>
      <Fact icon={Plane} label="Open to travelling">
        {p.openToTravel ? "Yes" : "No"}
      </Fact>
      <Fact icon={Repeat} label="Rotational shifts">
        {p.rotationalShifts ? "Yes" : "No"}
      </Fact>
      <Fact icon={Calendar} label="Date of birth">
        {formatDate(p.dob) ?? none}
      </Fact>
      {p.industry && (
        <Fact icon={Briefcase} label="Industry">
          {p.industry}
        </Fact>
      )}
    </dl>
  );
}

export function ResumesTab({ p }: { p: Consultant }) {
  return (
    <div className="space-y-4 p-5 animate-in fade-in-0 duration-300 @2xl:p-6">
      <DocumentList
        docs={allResumeDocs(p)}
        employeeId={p.id}
        track
        empty="This consultant hasn't uploaded a resume yet."
      />
    </div>
  );
}

export function CertificatesTab({ p }: { p: Consultant }) {
  return (
    <div className="space-y-6 p-5 animate-in fade-in-0 duration-300 @2xl:p-6">
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Certificates
        </h3>
        <DocumentList docs={p.certificates} employeeId={p.id} empty="No certificates uploaded." />
      </section>
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Degrees
        </h3>
        <DocumentList docs={p.degrees} employeeId={p.id} empty="No degrees uploaded." />
      </section>
    </div>
  );
}
